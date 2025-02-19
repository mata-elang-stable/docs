import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className="">Mata Elang is the evolution of Mata Garuda Internet Monitoring Project for Indonesia. This project was initialized as private repository in 2018 by LabJarkomC307 - Politeknik Elektronika Negeri Surabaya (PENS). Currently, Mata Elang become one of collaboration research between PENS, Universitas Indonesia and BPPT. This project is supported by JICA.</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/latest/quick-start">
            Quick Start Guide 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Mata Elang is the evolution of Mata Garuda Internet Monitoring Project for Indonesia. This project was initialized as private repository in 2018 by LabJarkomC307 - Politeknik Elektronika Negeri Surabaya (PENS). Currently, Mata Elang become one of collaboration research between PENS, Universitas Indonesia and BPPT. This project is supported by JICA.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
