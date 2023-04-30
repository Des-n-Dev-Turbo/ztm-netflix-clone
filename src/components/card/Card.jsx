import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import cls from 'classnames';

import styles from './Card.module.css';

const Card = ({
  imgUrl = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1159&q=80',
  size = 'medium',
  id,
  shouldScale = true,
}) => {
  const [imgSrc, setImgSrc] = useState(imgUrl);

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleOnError = () => {
    setImgSrc(
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1159&q=80'
    );
  };

  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };

  const shouldHover = shouldScale && {
    whileHover: { ...scale },
  };

  return (
    <div className={styles.container}>
      <motion.div className={cls(styles.imgMotionWrapper, classMap[size])} {...shouldHover}>
        <Image src={imgSrc} alt="image" fill className={styles.cardImg} onError={handleOnError} />
      </motion.div>
    </div>
  );
};

export default Card;
