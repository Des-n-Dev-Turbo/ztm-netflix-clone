import videoTestData from '../data/video.json';

const fetchVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = 'youtube.googleapis.com/youtube/v3';

  const response = await fetch(`https://${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`);

  return await response.json();
};

export const getCommonVideos = async (url) => {
  try {
    const isDev = process.env.DEVELOPMENT;

    const data = isDev ? videoTestData : await fetchVideos(url);

    if (data?.error) {
      throw new Error(data.error);
    }

    return data?.items.map((item, i) => {
      const snippet = item.snippet;

      return {
        title: snippet?.title,
        imgUrl: snippet.thumbnails?.high?.url,
        id: item.id?.videoId || item.id,
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
  } catch (error) {
    console.error('Something went wrong with the video library!');
    return [];
  }
};

export const getVideos = async (searchQuery) => {
  const URL = `search?part=snippet&q=${searchQuery}&type=video`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  const URL = 'videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US';
  return getCommonVideos(URL);
};

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return getCommonVideos(URL);
};
