import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";

export default function LeistungenPage() {
    const headerOptions = {
        luxury: { tagline: "Präzision in meisterlicher Handarbeit" },
        clinic: { tagline: "Klare Prozesse für moderne Praxen" },
        bold: { tagline: "Digitale Zahntechnik mit Charakter" },
    } as const;
    const activeHeader: keyof typeof headerOptions = "luxury";
    const activeBrand = headerOptions[activeHeader];

    return (
        <div className={styles.container}>
            <div className={styles.glowBlob1}></div>
            <div className={styles.glowBlob2}></div>

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
                <details className={styles.mobileMenu}>
                    <summary className={styles.mobileMenuButton}>Menü</summary>
                    <div className={styles.mobileMenuPanel}>
                        <Link href="/" className={styles.mobileMenuLink}>Startseite</Link>
                        <Link href="/leistungen" className={`${styles.mobileMenuLink} ${styles.mobileMenuLinkActive}`}>Leistungen</Link>
                        <Link href="/kontakt" className={styles.mobileMenuLink}>Kontakt & Upload</Link>
                    </div>
                </details>
            </header>

            <main className={styles.main}>
                <section className={styles.hero}>
                    <h1 className={styles.title}>
                        Unsere <span className="text-gradient">Leistungen</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Von komplexer Implantatprothetik bis zu präzisem 3D-Druck.
                        Wir bieten ein umfassendes Spektrum modernster zahntechnischer Lösungen.
                    </p>
                </section>

                <section className={styles.servicesGrid}>
                    <div className={`glass ${styles.serviceCard}`}>
                        <div className={styles.serviceImage}>
                            <Image
                                src="/leistung-1-fraese.png"
                                alt="Gefräste Vollprothesen in der CNC-Fertigung"
                                fill
                                className={styles.servicePhoto}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        <div className={styles.serviceContent}>
                            <h3>Vollkeramik & Ästhetik</h3>
                            <p>
                                Hochästhetische Kronen, Brücken und Veneers aus Zirkonoxid oder Lithiumdisilikat (e.max).
                                Perfekte Farbadaption für natürlich wirkenden Zahnersatz.
                            </p>
                            <ul className={styles.serviceList}>
                                <li>Veneers & Non-Prep-Veneers</li>
                                <li>Monolithisches Zirkon</li>
                                <li>Individuelle Frontzahnästhetik</li>
                            </ul>
                        </div>
                    </div>

                    <div className={`glass ${styles.serviceCard}`}>
                        <div className={styles.serviceImage}>
                            <Image
                                src="/leistung-2-scanner.png"
                                alt="Digitaler Scan- und CAD-CAM-Workflow im Labor"
                                fill
                                className={styles.servicePhoto}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        <div className={styles.serviceContent}>
                            <h3>Implantatprothetik</h3>
                            <p>
                                Maßgeschneiderte Abutments und verschraubte Suprakonstruktionen für alle gängigen Implantatsysteme.
                                Absolute Spannungsfreiheit durch CAD/CAM.
                            </p>
                            <ul className={styles.serviceList}>
                                <li>Individuelle Titan/Zirkon Abutments</li>
                                <li>All-on-4 / All-on-6 Konzepte</li>
                                <li>Bohrschablonen für Navigation</li>
                            </ul>
                        </div>
                    </div>

                    <div className={`glass ${styles.serviceCard}`}>
                        <div className={styles.serviceImage}>
                            <Image
                                src="/leistung-3-3ddruck-v2.png"
                                alt="Digitale Konstruktion und technische Umsetzung im Labor"
                                fill
                                className={styles.servicePhoto}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        <div className={styles.serviceContent}>
                            <h3>3D-Druck & Modelle</h3>
                            <p>
                                Wir drucken Ihre Intraoralscans als hochpräzise physische Modelle. Auch individuelle Abformlöffel
                                und temporärer Zahnersatz können gedruckt werden.
                            </p>
                            <ul className={styles.serviceList}>
                                <li>Kiefermodelle aus Intraoralscans</li>
                                <li>Gedruckte Provisorien</li>
                                <li>Aufbissschienen & Aligner</li>
                            </ul>
                        </div>
                    </div>

                    <div className={`glass ${styles.serviceCard}`}>
                        <div className={styles.serviceImage}>
                            <Image
                                src="/leistung-4-praxis.png"
                                alt="Patientenorientierte Versorgung in der Praxis"
                                fill
                                className={styles.servicePhoto}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        <div className={styles.serviceContent}>
                            <h3>Digitale Totalprothetik</h3>
                            <p>
                                Frästechnik für herausnehmbaren Zahnersatz. Perfekte Passung und reproduzierbare Ergebnisse
                                durch den digitalen Workflow für Vollprothesen.
                            </p>
                            <ul className={styles.serviceList}>
                                <li>Gefräste Vollprothesen</li>
                                <li>Kombitechnik & Teleskope</li>
                                <li>Allergiefreie Materialien</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className={styles.videoSection}>
                    <div className={`glass ${styles.videoContainer}`}>
                        <h2>Einblick in unser Labor</h2>
                        <video
                            className={styles.laborVideo}
                            src="/labor-einblick.mp4"
                            controls
                            preload="metadata"
                            playsInline
                        />
                    </div>
                </section>

                <section className={styles.ctaSection}>
                    <div className={`glass ${styles.ctaContainer}`}>
                        <h2>Haben Sie einen speziellen Patientenfall?</h2>
                        <p>Senden Sie uns einfach Ihren Intraoralscan über unser sicheres und DSGVO-konformes Upload-Portal.</p>
                        <Link href="/kontakt" className={styles.primaryButton}>
                            Jetzt Fall übermitteln
                        </Link>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <p>&copy; {new Date().getFullYear()} Art-Dental-Labor. Alle Rechte vorbehalten.</p>
                    <div className={styles.footerLinks}>
                        <Link href="#">Impressum</Link>
                        <Link href="#">Datenschutz</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
