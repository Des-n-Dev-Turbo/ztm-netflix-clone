import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Loading from '@/components/loading/Loading';

import magic from '../../lib/magic-connect';

import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        router.replace('/');
      } else {
        router.replace('/login');
      }
    })();
  }, []);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeComplete', handleComplete);

    return () => {
      router.events.off('routeChangeComplete', handleComplete);
    };
  }, [router]);

  return isLoading ? <Loading /> : <Component {...pageProps} />;
}
