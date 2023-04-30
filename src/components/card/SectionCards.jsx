import Link from 'next/link';
import clsx from 'classnames';

import Card from './Card';

import styles from './SectionCards.module.css';

const SectionCards = ({ title, videos = [], size, shouldWrap = false, shouldScale }) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={clsx(styles.cardWrapper, { [styles.wrap]: shouldWrap })}>
        {videos.map((video, idx) => (
          <Link href={`/video/${video.id}`} key={video.id}>
            <Card imgUrl={video.imgUrl} size={size} id={idx} shouldScale={shouldScale}/>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
