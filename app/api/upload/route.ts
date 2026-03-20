import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";
import nodemailer from "nodemailer";

// 32-Byte Key for AES-256
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = "aes-256-ctr";
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEX_256_KEY_PATTERN = /^[A-Fa-f0-9]{64}$/;
const ALLOWED_EXTENSIONS = new Set([".stl", ".zip", ".rar", ".pdf", ".jpg", ".jpeg", ".png"]);
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const MIN_FORM_FILL_MS = 1500;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function hasPersistentUploadStorage(): boolean {
    return process.env.VERCEL !== "1";
}

function getEncryptionKeyBuffer(): Buffer {
    if (!ENCRYPTION_KEY || !HEX_256_KEY_PATTERN.test(ENCRYPTION_KEY)) {
        throw new Error("ENCRYPTION_KEY must be configured as a 64-character hex string.");
    }
    return Buffer.from(ENCRYPTION_KEY, "hex");
}

function sanitizeFilename(filename: string): string {
    const base = path.basename(filename);
    return base.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function getClientIdentifier(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const fromForwarded = forwarded?.split(",")[0]?.trim();
    return fromForwarded || realIp || "unknown";
}

function isRateLimited(identifier: string): boolean {
    const now = Date.now();

    for (const [key, value] of rateLimitStore) {
        if (value.resetAt <= now) {
            rateLimitStore.delete(key);
        }
    }

    const current = rateLimitStore.get(identifier);
    if (!current || current.resetAt <= now) {
        rateLimitStore.set(identifier, {
            count: 1,
            resetAt: now + RATE_LIMIT_WINDOW_MS,
        });
        return false;
    }

    if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
        return true;
    }

    current.count += 1;
    return false;
}

type TurnstileVerifyResponse = {
    success: boolean;
    "error-codes"?: string[];
};

async function verifyTurnstileToken(token: string, remoteIp: string): Promise<boolean> {
    if (!TURNSTILE_SECRET_KEY) {
        console.error("TURNSTILE_SECRET_KEY is missing.");
        return false;
    }

    const body = new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: remoteIp,
    });

    const result = await fetch(TURNSTILE_VERIFY_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
        cache: "no-store",
    });

    if (!result.ok) {
        return false;
    }

    const data = (await result.json()) as TurnstileVerifyResponse;
    return Boolean(data.success);
}

async function sendNotificationEmail(name: string, email: string, message: string, filename?: string) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials missing in .env.local, skipping email notification.");
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    let textContent = `Neue Anfrage über das Kontaktformular.\n\nPraxis/Behandler: ${name}\nE-Mail: ${email}\nNachricht: ${message}`;
    if (filename) {
        textContent += `\n\nEine Datei wurde hochgeladen und sicher verschlüsselt auf dem Server gespeichert als: ${filename}\nDiese E-Mail enthält aus DSGVO-Gründen keine Patientendaten im Anhang.`;
    }

    const mailOptions = {
        from: `"Art-Dental-Labor" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        replyTo: email,
        subject: filename ? `Neue Patientendaten: ${name}` : `Neue Kontaktanfrage: ${name}`,
        text: textContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: %s", info.messageId);
        if (process.env.SMTP_HOST.includes('ethereal')) {
            console.log("Ethereal Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
    } catch (err) {
        console.error("Failed to send email:", err);
    }
}

export async function POST(req: NextRequest) {
    try {
        const clientId = getClientIdentifier(req);
        if (isRateLimited(clientId)) {
            return NextResponse.json(
                { error: "Zu viele Anfragen. Bitte in einigen Minuten erneut versuchen." },
                { status: 429 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const name = (formData.get("name") as string | null)?.trim() ?? "";
        const email = (formData.get("email") as string | null)?.trim() ?? "";
        const message = (formData.get("message") as string | null)?.trim() ?? "";
        const website = (formData.get("website") as string | null)?.trim() ?? "";
        const formStartedAt = Number((formData.get("form_started_at") as string | null) ?? "0");
        const turnstileToken = (formData.get("cf-turnstile-response") as string | null)?.trim() ?? "";

        // Honeypot field: real users should leave it empty.
        if (website) {
            return NextResponse.json({ success: true, message: "Nachricht erfolgreich gesendet." });
        }

        if (!Number.isFinite(formStartedAt) || formStartedAt <= 0) {
            return NextResponse.json({ error: "Ungültige Formularanfrage." }, { status: 400 });
        }

        if (Date.now() - formStartedAt < MIN_FORM_FILL_MS) {
            return NextResponse.json({ error: "Bitte Formular vollständig ausfüllen." }, { status: 400 });
        }

        // Enforce Turnstile only when server-side secret is configured.
        if (TURNSTILE_SECRET_KEY) {
            if (!turnstileToken) {
                return NextResponse.json({ error: "Bitte Bot-Schutz bestaetigen." }, { status: 400 });
            }

            const isTurnstileValid = await verifyTurnstileToken(turnstileToken, clientId);
            if (!isTurnstileValid) {
                return NextResponse.json({ error: "Bot-Schutz konnte nicht validiert werden." }, { status: 403 });
            }
        }

        if (!name || !email) {
            return NextResponse.json({ error: "Name and Email are required." }, { status: 400 });
        }

        if (!EMAIL_PATTERN.test(email)) {
            return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
        }

        if (!file) {
            // Simple text message without file
            console.log(`[Contact] ${name} (${email}): ${message}`);
            await sendNotificationEmail(name, email, message);
            return NextResponse.json({ success: true, message: "Nachricht erfolgreich gesendet." });
        }

        if (!hasPersistentUploadStorage()) {
            return NextResponse.json(
                {
                    error: "Datei-Uploads sind in der aktuellen Online-Version voruebergehend deaktiviert. Bitte senden Sie uns zunaechst eine Nachricht ohne Anhang."
                },
                { status: 503 }
            );
        }

        if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
            return NextResponse.json({ error: "Invalid file size. Max 25MB allowed." }, { status: 400 });
        }

        const extension = path.extname(file.name).toLowerCase();
        if (!ALLOWED_EXTENSIONS.has(extension)) {
            return NextResponse.json({ error: "Dateityp nicht erlaubt." }, { status: 415 });
        }

        // Secure File Handling for Patient Data (e.g. STL)
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Initialization Vector (IV) must be completely random and unique per encryption
        const iv = crypto.randomBytes(16);

        // Create Cipher
        const keyBuffer = getEncryptionKeyBuffer();
        const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);

        const encryptedBuffer = Buffer.concat([cipher.update(buffer), cipher.final()]);

        // Save to local filesystem for now
        const uploadsDir = path.join(process.cwd(), "uploads");
        await fs.mkdir(uploadsDir, { recursive: true });

        const safeOriginalName = sanitizeFilename(file.name) || "upload.bin";
        const secureFilename = `${Date.now()}_${crypto.randomBytes(8).toString("hex")}_${safeOriginalName}.enc`;
        const outputPath = path.join(uploadsDir, secureFilename);

        // Prepend the IV to the encrypted data so we can decrypt it later
        const finalDataToStore = Buffer.concat([iv, encryptedBuffer]);
        await fs.writeFile(outputPath, finalDataToStore);

        // Send Email Notification
        await sendNotificationEmail(name, email, message, secureFilename);

        return NextResponse.json({
            success: true,
            message: "Patientendaten wurden DSGVO-konform verschlüsselt und sicher übertragen."
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Serverfehler beim Verarbeiten der Anfrage." }, { status: 500 });
    }
}
