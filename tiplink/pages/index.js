import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Footer from "../components/footer"

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
      <Footer/>

    </div>
  )
}
