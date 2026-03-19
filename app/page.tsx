import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const headerOptions = {
    luxury: { tagline: "Praezision in meisterlicher Handarbeit" },
    clinic: { tagline: "Klare Prozesse fuer moderne Praxen" },
    bold: { tagline: "Digitale Zahntechnik mit Charakter" },
  } as const;
  const activeHeader: keyof typeof headerOptions = "luxury";
  const activeBrand = headerOptions[activeHeader];

  return (
    <div className={styles.container}>
      <div className={styles.glowBlob1}></div>
      <div className={styles.glowBlob2}></div>
      <div className={styles.glowBlob3}></div>

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
          <Link href="/" className={`${styles.navLink} ${styles.navLinkActive}`} aria-current="page">Startseite</Link>
          <Link href="/leistungen" className={styles.navLink}>Leistungen</Link>
          <Link href="/kontakt" className={styles.navLink}>Kontakt & Upload</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.badge}>
            <span className={styles.badgePulse}></span>
            DSGVO-Konform & Sicher
          </div>
          <h1 className={styles.title}>
            Praezision fuer <span className="text-gradient">Ihre Zaehne</span>
          </h1>
          <p className={styles.goldInfo}>
            Von komplexer Implantatprothetik bis zu praezisem 3D-Druck: Wir bieten ein umfassendes Spektrum modernster zahntechnischer Loesungen.
          </p>
          <p className={styles.goldInfo}>
            Senden Sie uns einfach Ihren Intraoralscan ueber unser sicheres und DSGVO-konformes Upload-Portal.
          </p>
          <div className={styles.actions}>
            <Link href="/kontakt" className={styles.primaryButton}>
              Fall uebermitteln
              <svg className={styles.btnIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            <Link href="/leistungen" className={styles.secondaryButton}>
              Unsere Leistungen
            </Link>
          </div>
        </section>

        <section className={styles.stats}>
          <div className={styles.statItem}>
            <h2>100% Sicher</h2>
            <p>Mehrstufig geschuetzt</p>
          </div>
          <div className={styles.statItem}>
            <h2>Schnell</h2>
            <p>Verschluesselte Uebertragung</p>
          </div>
          <div className={styles.statItem}>
            <h2>DSGVO-Konform</h2>
            <p>Nach EU-Richtlinien</p>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Warum <span className="text-gradient">Art-Dental</span>?</h2>
            <p className={styles.sectionSubtitle}>Ihre Vorteile mit unserem digitalen Laborpartner</p>
          </div>
          <div className={styles.featureGrid}>
            <div className={`glass ${styles.featureCard}`} data-bg="1">
              <div className={styles.featureContent}>
                <h3>Hoechste Praezision</h3>
                <p>Modernste CAD/CAM-Technik und 3D-Druck garantieren mikrometergenaue Passungen fuer jeden Fall.</p>
              </div>
            </div>
            <div className={`glass ${styles.featureCard}`} data-bg="2">
              <div className={styles.featureContent}>
                <h3>Sicherer Workflow</h3>
                <p>Vollstaendig verschluesselter Datenaustausch fuer Scans und Patientendaten gemaess europaeischen Richtlinien.</p>
              </div>
            </div>
            <div className={`glass ${styles.featureCard}`} data-bg="3">
              <div className={styles.featureContent}>
                <h3>Schnelle Fertigung</h3>
                <p>Optimierte digitale Prozesse reduzieren die Durchlaufzeiten und garantieren termingerechte Lieferung.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.workflow}>
          <div className={styles.sectionHeader}>
            <h2 className={`${styles.sectionTitle} ${styles.workflowTitle}`}>So einfach funktioniert</h2>
          </div>
          <div className={styles.steps}>
            <div className={`glass ${styles.step}`}>
              <div className={styles.stepNumber}>1</div>
              <h3>Scan erstellen</h3>
              <p>Fuehren Sie den Intraoralscan in Ihrer Praxis durch.</p>
            </div>
            <div className={styles.stepDivider}>
              <div className={styles.dividerLine}></div>
            </div>
            <div className={`glass ${styles.step}`}>
              <div className={styles.stepNumber}>2</div>
              <h3>Upload starten</h3>
              <p>Laden Sie die STL-Dateien sicher ueber unser Portal hoch.</p>
            </div>
            <div className={styles.stepDivider}>
              <div className={styles.dividerLine}></div>
            </div>
            <div className={`glass ${styles.step}`}>
              <div className={styles.stepNumber}>3</div>
              <h3>Labor fertigt</h3>
              <p>Wir designen und produzieren Ihren Fall mit Praezision.</p>
            </div>
            <div className={styles.stepDivider}>
              <div className={styles.dividerLine}></div>
            </div>
            <div className={`glass ${styles.step}`}>
              <div className={styles.stepNumber}>4</div>
              <h3>Auslieferung</h3>
              <p>Sie erhalten die fertige Arbeit termingerecht in der Praxis.</p>
            </div>
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
