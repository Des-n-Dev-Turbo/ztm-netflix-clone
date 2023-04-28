import Link from 'next/link';
import Card from './Card';

import styles from './SectionCards.module.css';

const SectionCards = ({ title, videos = [], size }) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((video, idx) => (
          <Link href={`/video/${video.id}`} key={video.id}>
            <Card imgUrl={video.imgUrl} size={size} id={idx} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
