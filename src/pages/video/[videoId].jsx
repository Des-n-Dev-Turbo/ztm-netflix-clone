import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Modal from 'react-modal';
import clsx from 'classnames';

import Navbar from '@/components/nav/Navbar';
import Like from '@/components/icons/LikeIcon';
import DisLike from '@/components/icons/DislikeIcon';

import { getYoutubeVideoById } from '../../../lib/videos';

import styles from '@/styles/VideoPage.module.css';

Modal.setAppElement('#__next');

const VideoPage = ({ video }) => {
  const router = useRouter();

  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount },
  } = video;

  const videoId = router.query.videoId;

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resData = await response.json();

      if (resData?.data) {
        const favouritedRating = Boolean(resData.data[0].favourited);
        setToggleLike(favouritedRating);
        setToggleDisLike(!favouritedRating);
      }
    })();
  }, [videoId]);

  const dateTransform = (date) => {
    const dateTime = new Date(date).toLocaleDateString('en-IN', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      hour12: true,
      minute: '2-digit',
      second: '2-digit',
    });
    return dateTime;
  };

  const runRating = async (favourited) => {
    const response = await fetch('/api/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        watched: true,
        favourited,
        videoId,
      }),
    });

    return response;
  };

  const handleToggleLike = async () => {
    setToggleLike((prevState) => !prevState);
    setToggleDisLike(toggleLike);

    const response = await runRating(1);

    await response.json();
  };

  const handleToggleDisLike = async () => {
    setToggleDisLike((prevState) => !prevState);
    setToggleLike(toggleDisLike);

    const response = await runRating(0);

    await response.json();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/static/N.png" />
      </Head>
      <Navbar />
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="ytplayer"
          className={styles.videoPlayer}
          type="text/html"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
          frameBorder="0"
        ></iframe>
        <div className={styles.likeDislikeBtnWrapper}>
          <button onClick={handleToggleLike}>
            <div className={styles.btnWrapper}>
              <Like selected={toggleLike} />
            </div>
          </button>
          <button onClick={handleToggleDisLike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={toggleDisLike} />
            </div>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{dateTransform(publishTime)}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VideoPage;

export const getStaticPaths = async () => {
  const listOfVideos = ['mYfJxlgR2jw', '4zH5iYM4wJo', 'KCPEHsAViiQ'];
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps = async (context) => {
  const { videoId } = context.params;

  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    revalidate: 10,
  };
};
