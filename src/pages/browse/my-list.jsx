import Head from 'next/head';

import Navbar from '@/components/nav/Navbar';
import SectionCards from '@/components/card/SectionCards';

import { getFavouritedVideosList } from '../../../lib/videos';
import verifyToken from '../../../lib/utils';

import styles from '@/styles/MyList.module.css';

const MyList = ({ myListVideos }) => {
  return (
    <div>
      <Head>
        <title>Netflix - My List</title>
        <link rel="icon" href="/static/N.png" />
      </Head>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.sectionWrapper}>
          <SectionCards title="My List" videos={myListVideos} size="small" shouldWrap shouldScale={false} />
        </div>
      </main>
    </div>
  );
};

export default MyList;

export const getServerSideProps = async (context) => {
  const { token } = context.req ? context.req.cookies : { token: null };
  const userId = await verifyToken(token);

  const myListVideos = await getFavouritedVideosList(userId, token);

  return {
    props: {
      myListVideos,
    },
  };
};
