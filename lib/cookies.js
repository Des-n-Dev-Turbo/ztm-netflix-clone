import cookie from 'cookie';

const MAX_AGE = 60 * 60 * 24 * 7;

export const setTokenCookie = (token, response) => {
  const setCookie = cookie.serialize('token', token, {
    expires: new Date(Date.now() + MAX_AGE * 1000),
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  response.setHeader('Set-Cookie', setCookie);
};

export const removeTokenCookie = (res) => {
  const val = cookie.serialize('token', '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', val);
};
