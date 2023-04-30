import jwt from 'jsonwebtoken';

import { magicAdmin } from '../../../lib/magic';
import { createNewUser, isNewUser } from '../../../lib/hasura';
import { setTokenCookie } from '../../../lib/cookies';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const headers = req.headers;
      const didToken = headers && headers.authorization.split(' ')[1];

      const metadata = await magicAdmin.users.getMetadataByToken(didToken);

      const token = jwt.sign(
        {
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          'https://hasura.io/jwt/claims': {
            'x-hasura-default-role': 'user',
            'x-hasura-allowed-roles': ['user', 'admin'],
            'x-hasura-user-id': `${metadata.issuer}`,
          },
          issuer: metadata.issuer,
          publicAddress: metadata.publicAddress,
          email: metadata.email,
        },
        process.env.JWT_SECRET_KEY
      );

      const newUser = await isNewUser(token, metadata.issuer);

      if (newUser) {
        await createNewUser(token, metadata);
      }

      setTokenCookie(token, res);
      res.json({ done: true, token, message: 'Successfully logged In' });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};

export default handler;
