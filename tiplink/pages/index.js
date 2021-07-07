import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tip Link</title>
        <meta name="description" content="Send tip links with crypto" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Tip Link
        </h1>

        <div className={styles.grid}>
          <a href="/wallet" className={styles.card}>
            <h2>Create a Wallet</h2>
            <p>Send tip links with crypto!</p>
          </a>

        </div>
      </main>

      <footer className={styles.footer}>
        Copyright 2021
        <a
          href="https://solana.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.box}>
            Powered by{' '}
            <Image src="/solana.png" alt="Solana Logo" width={98} height={40} />
          </div>
        </a>
      </footer>
    </div>
  )
}