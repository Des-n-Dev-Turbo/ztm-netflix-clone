import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import magic from '../../../lib/magic-connect';

import styles from './Navbar.module.css';

const Navbar = () => {
  const router = useRouter();

  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { email } = await magic.user.getInfo();
        if (email) {
          setUsername(email);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleSignOut = async (e) => {
    e.preventDefault();

    await magic.user.logout();
    router.replace('/login');
  };

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push('/');
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push('/browse/my-list');
  };

  const handleShowDropdown = (e) => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoWrapper}>
            <Image src={'/static/netflix.svg'} alt="Netflix Logo" width={128} height={34} />
          </div>
        </Link>
        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{username}</p>
              <Image
                src={'/static/expand_more.svg'}
                alt="Expand More Icon"
                width={32}
                height={32}
                className={styles.expandMore}
              />
            </button>
            {showDropdown ? (
              <div className={styles.navDropdown}>
                <div>
                  <button className={styles.linkName} onClick={handleSignOut}>
                    Sign out
                  </button>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            ) : null}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
