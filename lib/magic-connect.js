import { Magic } from 'magic-sdk';
import { AuthExtension } from '@magic-ext/auth';

const createMagic = () => {
  if (typeof window !== 'undefined') {
    return new Magic(process.env.NEXT_PUBLIC_MAGIC_CONNECT_API_KEY, {
      extensions: [new AuthExtension()],
    });
  }
};

const magic = createMagic();

export default magic;
