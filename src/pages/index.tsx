import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import clsx from "clsx";
import type { ReactNode } from "react";
import versions from "../../versions.json";

import Translate, { translate } from "@docusaurus/Translate";

import styles from "./index.module.css";

const COLLABORATION_LOGOS = [
  { src: "/img/Logo-jica.png", alt: "JICA", className: styles.flexibleLogo },
  { src: "/img/Logo-ui.png", alt: "UI", className: styles.flexibleLogoUI },
  { src: "/img/logo-pens.png", alt: "PENS", className: styles.flexibleLogo },
  { src: "/img/logo-unsri.png", alt: "UNSRI", className: styles.flexibleLogoUnsri },
  { src: "/img/logo-ssmi-en.png", alt: "IPB SSMI", className: styles.flexibleLogoSSMI },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          <Translate>{siteConfig.title}</Translate>
        </Heading>
        <p className="hero__subtitle">
          <Translate>{siteConfig.tagline}</Translate>
        </p>
        <p className="">
          <Translate>
            Mata Elang is the evolution of Mata Garuda Internet Monitoring Project for Indonesia.
            This project was initialized as private repository in 2018 by LabJarkomC307 - Politeknik
            Elektronika Negeri Surabaya (PENS). Currently, Mata Elang become one of collaboration
            research between PENS, Universitas Indonesia and BPPT. This project is supported by
            JICA.
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/2.0.0/quick-start">
            <Translate>Quick Start Guide 🚀</Translate>
          </Link>
        </div>
        <div className={styles.collaborationRow}>
          <div className={styles.collaborationColumn}>
            <p className={styles.collaborationTitle}>
              <Translate>In Collaboration With: </Translate>
            </p>
            <div className={clsx(styles.collaborationLogos, styles.logoSliderContainer)}>
              <div className={styles.logoSliderViewport}>
                <div className={styles.logoSliderTrack}>
                  {[0, 1].map((copyIndex) => (
                    <div
                      key={copyIndex}
                      className={styles.logoSliderGroup}
                      aria-hidden={copyIndex === 1}
                    >
                      {COLLABORATION_LOGOS.map((logo) => (
                        <img
                          key={`${copyIndex}-${logo.alt}`}
                          src={logo.src}
                          alt={copyIndex === 0 ? logo.alt : ""}
                          className={logo.className}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.collaborationColumn}>
            <p className={styles.collaborationTitle}>
              <Translate>Project Contributor: </Translate>
            </p>
            <div className={styles.collaborationLogos}>
              <img src="/img/logo-pti.png" alt="PTI" className={styles.flexibleLogoPTI} />
              <img src="/img/logo-shaka.png" alt="Shaka" className={styles.flexibleLogoShaka} />
              <img src="/img/logo-tm.png" alt="Trustmedis" className={styles.flexibleLogoTM} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Mata Elang is the evolution of Mata Garuda Internet Monitoring Project for Indonesia. This project was initialized as private repository in 2018 by LabJarkomC307 - Politeknik Elektronika Negeri Surabaya (PENS). Currently, Mata Elang become one of collaboration research between PENS, Universitas Indonesia and BPPT. This project is supported by JICA."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
