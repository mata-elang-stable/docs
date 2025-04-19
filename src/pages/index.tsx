import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import versions from '../../versions.json';

import Translate, {translate} from '@docusaurus/Translate';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
        <Translate>{siteConfig.title}</Translate>
        </Heading>
        <p className="hero__subtitle"><Translate>{siteConfig.tagline}</Translate></p>
        <p className=""><Translate>Mata Elang is the evolution of Mata Garuda Internet Monitoring Project for Indonesia. This project was initialized as private repository in 2018 by LabJarkomC307 - Politeknik Elektronika Negeri Surabaya (PENS). Currently, Mata Elang become one of collaboration research between PENS, Universitas Indonesia and BPPT. This project is supported by JICA.</Translate></p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to={`/docs/${versions.sort().reverse()[0]}/quick-start`}>
            <Translate>Quick Start Guide 🚀</Translate>
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
        {/* <HomepageFeatures /> */}
      </main>
    </Layout>
  );
}
