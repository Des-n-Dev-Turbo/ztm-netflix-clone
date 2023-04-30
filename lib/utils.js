import { jwtVerify } from 'jose';

const verifyToken = async function (token) {
  try {
    if (token) {
      const decodedToken = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY));

      const userId = decodedToken.payload && decodedToken.payload?.issuer;

      return userId;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export default verifyToken;
