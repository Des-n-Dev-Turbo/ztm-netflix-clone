import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import magic from '../../lib/magic-connect';

import styles from '@/styles/LoginPage.module.css';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on('routeChangeComplete', handleComplete);

    return () => {
      router.events.off('routeChangeComplete', handleComplete);
    };
  }, [router]);

  const handleOnChangeEmail = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
  };

  const handleOnFocusEmail = (e) => {
    setTouched(false);
  };

  const handleOnBlurEmail = (e) => {
    setTouched(true);
  };

  const handleOnLogin = async (e) => {
    e.preventDefault();

    if (email) {
      setIsLoading(true);
      setUserMsg('');
      if (email) {
        try {
          const DIDToken = await magic.auth.loginWithMagicLink({ email });

          if (DIDToken) {
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${DIDToken}`,
                'Content-Type': 'application/json',
              },
            });

            const loggedInRes = await response.json();

            if (loggedInRes.done) {
              router.replace('/');
            } else {
              setIsLoading(false);
              setUserMsg('Something went wrong while Logging In!');
            }
          }
        } catch (error) {
          setIsLoading(false);
          console.log({ error });
        }
      }
    } else {
      setUserMsg('Please enter a valid Email Address!');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix - SignIn</title>
        <link rel="icon" href="/static/N.png" />
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image src={'/static/netflix.svg'} alt="Netflix Logo" width={128} height={34} />
            </div>
          </Link>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type="text"
            placeholder="Email Address"
            className={styles.emailInput}
            value={email}
            onChange={handleOnChangeEmail}
            onBlur={handleOnBlurEmail}
            onFocus={handleOnFocusEmail}
          />
          <p className={styles.userMsg}>{(userMsg && touched) || !email ? userMsg : null}</p>
          <button className={styles.loginBtn} onClick={handleOnLogin} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'SignIn'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
