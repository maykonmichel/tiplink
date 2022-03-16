import styles from '../../../styles/Home.module.css';

export default function Footer() {
  return (
    <div className={styles.footer}>
      Copyright 2022
      <a
        href="https://solana.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={styles.box}>
          Powered by{' '}
          <img src="/solana.png" alt="Solana Logo" width={98} height={40} />
        </div>
      </a>
      <div>
        <a href="/faq">FAQ</a>
      </div>
    </div>
  );
}