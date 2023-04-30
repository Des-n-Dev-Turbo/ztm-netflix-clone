import Head from 'next/head';

import Banner from '@/components/banner/Banner';
import Navbar from '@/components/nav/Navbar';
import SectionCards from '@/components/card/SectionCards';

import { getPopularVideos, getVideos, getWatchItAgainVideos } from '../../lib/videos';
import verifyToken from '../../lib/utils';

import styles from '@/styles/Home.module.css';

export default function Home(intialProps) {
  const { disneyVideos, traveVideos, productivityVideos, popularVideos, watchItAgainVideos } = intialProps;

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="ZTM Netflix Clone using Nextjs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/static/N.png" />
      </Head>
      <Navbar />

      <Banner
        title="Clifford the red dog"
        subTitle="a very cute dog"
        imgUrl="/static/clifford.webp"
        videoId="4zH5iYM4wJo"
      />
      <div className={styles.sectionWrapper}>
        <SectionCards title="Disney" videos={disneyVideos} size="large" />
        <SectionCards title="Watch It Again" videos={watchItAgainVideos} size="small" />
        <SectionCards title="Travel" videos={traveVideos} size="small" />
        <SectionCards title="Productivity" videos={productivityVideos} size="medium" />
        <SectionCards title="Popular" videos={popularVideos} size="small" />
      </div>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { token } = context.req ? context.req.cookies : { token: null };
  const userId = await verifyToken(token);

  const disneyVideos = await getVideos('Disney Trailers');
  const productivityVideos = await getVideos('Productivity');
  const traveVideos = await getVideos('Travel');
  const popularVideos = await getPopularVideos();
  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);

  return {
    props: {
      disneyVideos,
      productivityVideos,
      traveVideos,
      popularVideos,
      watchItAgainVideos,
    },
  };
};
