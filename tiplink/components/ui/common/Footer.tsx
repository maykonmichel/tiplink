import styles from '../../../styles/Home.module.css';
import { Twitter } from '@mui/icons-material';
import { Copyright } from '@mui/icons-material';
import 'material-icons/iconfont/material-icons.css';

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div>
        <Copyright style={{fontSize: '0.8rem'}}/> 2022
      </div>
      <div className={styles.poweredBy}>
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
      </div>
      <div className={styles.footerLinks}>
        <a href="/faq">FAQ</a>

        <div className={styles.footerSocial}>
          <a href="https://twitter.com/TipLinkOfficial" 
          target="_blank" rel="noopener noreferrer">
            <Twitter />
          </a>
          <a href="#" onClick={(e) => {e.preventDefault(); return false;}}>
            <span className='material-icons'>discord</span>
          </a>
        </div>
      </div>
    </div>
  );
}