import React from 'react';
import styles from './index.module.scss';
import { FiPlus } from 'react-icons/fi';

interface Props {
  onClick(): void;
}

export default function AddCommunityLink({ onClick }: Props) {
  return (
    <div className={styles.link} onClick={onClick}>
      <FiPlus />
    </div>
  );
}