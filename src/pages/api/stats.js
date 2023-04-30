import jwt from 'jsonwebtoken';

import { createNewStats, findVideoIdByUser, updateStats } from '../../../lib/hasura';

const handler = async (req, res) => {
  try {
    const token = req.cookies.token;
    const { videoId } = req.method === 'POST' ? req.body : req.query;

    if (videoId) {
      if (!token) {
        return res.status(403).json({ message: 'Unauthorized Access Denied' });
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const userId = decodedToken.issuer;

      const findVideo = await findVideoIdByUser(token, userId, videoId);
      const doesStatExist = findVideo.length > 0;

      if (req.method === 'GET') {
        if (doesStatExist) {
          return res.status(200).json({ done: true, data: findVideo });
        }

        return res.status(404).json({ user: null, message: 'Video not found!' });
      }

      if (req.method === 'POST') {
        const { watched = true, favourited } = req.body;

        if (doesStatExist) {
          const response = await updateStats(token, {
            favourited,
            userId,
            watched,
            videoId,
          });

          return res.status(201).json({ done: true, data: response });
        }

        const response = await createNewStats(token, {
          userId,
          videoId,
          favourited,
          watched,
        });
        return res.status(201).json({ done: true, data: response });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export default handler;
