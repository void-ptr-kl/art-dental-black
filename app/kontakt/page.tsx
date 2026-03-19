"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export default function KontaktPage() {
    const headerOptions = {
        luxury: { tagline: "Praezision in meisterlicher Handarbeit" },
        clinic: { tagline: "Klare Prozesse fuer moderne Praxen" },
        bold: { tagline: "Digitale Zahntechnik mit Charakter" },
    } as const;
    const activeHeader: keyof typeof headerOptions = "luxury";
    const activeBrand = headerOptions[activeHeader];

    const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    const isTurnstileEnabled = Boolean(turnstileSiteKey);
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [formStartedAt] = useState<number>(() => Date.now());

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("uploading");

        const formData = new FormData(e.currentTarget);
        if (file) {
            formData.append("file", file);
        }

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage(data.message || "Erfolgreich gesendet.");
            } else {
                setStatus("error");
                setMessage(data.error || "Ein Fehler ist aufgetreten.");
            }
        } catch {
            setStatus("error");
            setMessage("Verbindung zum Server fehlgeschlagen.");
        }
    };

    return (
        <div className={styles.container}>
            {isTurnstileEnabled && (
                <Script
                    src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                    async
                    defer
                    strategy="afterInteractive"
                />
            )}

            {/* Abstract Backgrounds */}
            <div className={styles.glowBlob1}></div>

            {/* Modern Header (Same as Home for consistency) */}
            <header className={`glass ${styles.header} ${styles[`header_${activeHeader}`]}`}>
                <div className={styles.brandWrap}>
                    <Image
                        src="/logo-new.png"
                        alt="Art-Dental-Labor Logo"
                        width={280}
                        height={96}
                        className={styles.brandLogo}
                        priority
                    />
                    <div className={`${styles.brandText} ${styles[`brandText_${activeHeader}`]}`}>
                        <span className={`${styles.brandTitle} ${styles[`brandTitle_${activeHeader}`]}`}>
                            <span className="text-gradient">Art</span>-Dental-Labor
                        </span>
                        <span className={`${styles.brandTagline} ${styles[`brandTagline_${activeHeader}`]}`}>
                            {activeBrand.tagline}
                        </span>
                    </div>
                </div>
                <Link href="/" className={styles.centerLogoLink} aria-label="Zur Startseite">
                    <Image
                        src="/logo-new.png"
                        alt="Art-Dental-Labor"
                        width={90}
                        height={90}
                        className={styles.centerLogoImage}
                    />
                </Link>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>Startseite</Link>
                    <Link href="/leistungen" className={styles.navLink}>Leistungen</Link>
                    <Link href="/kontakt" className={styles.navLink}>Kontakt & Upload</Link>
                </nav>
            </header>

            <main className={styles.main}>
                <div className={`glass ${styles.formContainer}`}>
                    <h1 className={styles.title}>Kontakt & <span className="text-gradient">Patientendaten-Upload</span></h1>
                    <p className={styles.subtitle}>
                        Senden Sie uns Intraoralscans (STL) oder andere Patientendaten sicher und streng nach DSGVO-Richtlinien.
                        Alle Dateien werden serverseitig mit AES-256 verschlüsselt.
                    </p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <input type="hidden" name="form_started_at" value={formStartedAt} />
                        <div className={styles.honeypot} aria-hidden="true">
                            <label htmlFor="website">Website</label>
                            <input
                                id="website"
                                name="website"
                                type="text"
                                tabIndex={-1}
                                autoComplete="off"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Praxis / Behandler Name</label>
                            <input type="text" id="name" name="name" required placeholder="z.B. Praxis Dr. Mustermann" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email">E-Mail Adresse</label>
                            <input type="email" id="email" name="email" required placeholder="ihre@email.de" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="message">Nachricht / Anweisungen zum Fall</label>
                            <textarea id="message" name="message" rows={4} placeholder="Zusätzliche Informationen..."></textarea>
                        </div>

                        <div className={styles.fileUploadArea}>
                            <label htmlFor="file" className={styles.fileLabel}>
                                <div className={styles.uploadIcon}>
                                    <Image
                                        src="/upload-dropzone.jpg"
                                        alt="Daten fuer Zahntechnik hochladen"
                                        width={640}
                                        height={360}
                                        className={styles.uploadImage}
                                    />
                                </div>
                                <div className={styles.uploadText}>
                                    {file ? (
                                        <span className={styles.selectedFileName}>{file.name}</span>
                                    ) : (
                                        <span>Klicken oder Datei hierher ziehen (z.B. .stl, .zip)</span>
                                    )}
                                </div>
                            </label>
                            <input
                                type="file"
                                id="file"
                                onChange={handleFileChange}
                                className={styles.fileInput}
                                accept=".stl,.zip,.rar,.pdf,.jpg,.png"
                            />
                        </div>

                        {isTurnstileEnabled ? (
                            <div className={styles.turnstileWrapper}>
                                <div
                                    className="cf-turnstile"
                                    data-sitekey={turnstileSiteKey}
                                    data-theme="auto"
                                    data-language="de"
                                />
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={status === "uploading"}
                        >
                            {status === "uploading" ? "Wird verschlüsselt und gesendet..." : "Kontakt & Upload"}
                        </button>
                        <div className={styles.securityNote}>
                            <span className={styles.securityDot} aria-hidden="true"></span>
                            <span>DSGVO-Konform & Sicher</span>
                        </div>
                        {status === "success" && (
                            <div className={styles.successMessage}>✅ {message}</div>
                        )}
                        {status === "error" && (
                            <div className={styles.errorMessage}>❌ {message}</div>
                        )}
                    </form>
                </div>

                {/* Google Maps Location */}
                <div className={`glass ${styles.mapContainer}`}>
                    <h2>So finden Sie uns</h2>
                    <p>Kleinfeldele 24, 79379 Müllheim im Markgräflerland</p>
                    <div className={styles.mapFrame}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2685.204558557348!2d7.609204276133276!3d47.806655171221714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47910b8cf8b5cfad%3A0xe51deabedb858f0!2sKleinfeldele%2024%2C%2079379%20M%C3%BCllheim%20im%20Markgr%C3%A4flerland!5e0!3m2!1sen!2sde!4v1709477464082!5m2!1sen!2sde"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </main>
        </div>
    );
}



