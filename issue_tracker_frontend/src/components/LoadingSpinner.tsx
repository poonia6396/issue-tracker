import React from 'react';
import { Spinner } from 'react-bootstrap';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles.overlay}>
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default LoadingSpinner;
