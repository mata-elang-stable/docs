import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Advanced Intrusion Detection',
    Svg: require('@site/static/img/image-1.svg').default,
    description: (
      <>
        Mata Elang integrates Snort, a leading Network Intrusion Detection System, 
        with real-time packet inspection to identify malicious activities and security breaches.
      </>
    ),
  },
  {
    title: 'Big Data Analytics',
    Svg: require('@site/static/img/image-2.svg').default,
    description: (
      <>
        Built on a scalable big data platform to process massive amounts of network 
        traffic data efficiently, enabling better detection accuracy, long-term trend 
        analysis, and real-time correlation of security events.
      </>
    ),
  },
  {
    title: 'Seamless Deployment & Scalability',
    Svg: require('@site/static/img/image-3.svg').default,
    description: (
      <>
        Deploy easily using Docker Compose with distributed architecture that scales 
        across multiple network nodes. Monitor high-traffic networks efficiently 
        without performance bottlenecks.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
