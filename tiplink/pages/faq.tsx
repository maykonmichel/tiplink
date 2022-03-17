import Head from "next/head";
import Footer from "../components/ui/common/Footer";
import { Typography } from "@mui/material";
import styles from '../styles/FAQ.module.css';
import "@fontsource/poppins";
import Header from "../components/ui/common/Header";


type TitleProps = {
    title: string;
}

const FAQTitle = ({title}: TitleProps) => {
    return(
        <Typography className={styles.faqSubtitle} variant="h4">{title}</Typography>
    );
}

const FAQContent = () => {
    return(
        <div className='container'>
            <header>
                <Typography variant='h2'>FAQ</Typography>
            </header>
            <div className={styles.faqItem}>
                <FAQTitle title="What is tiplink?"/>
                <Typography>Tiplink is a lightweight wallet designed to make transferring digital assets as easy as sending a link. 
                    Someone with solana can create a tiplink and send that link to anyone over any platform (text, discord, email, etc). The amazing thing is, the link is the wallet!</Typography>
            </div>
            <div className={styles.faqItem}>
                <FAQTitle title="How does tiplink work?"/>
                <Typography>Tiplink works by putting the relevant key information into the URL itself. This allows the user to access their wallet. The great part of this approach is we actually don’t know the private key ourselves, only the user does.  </Typography>
            </div>
            <div className={styles.faqItem}>
                <FAQTitle title="I lost my tiplink, how do I get it back?"/>
                <Typography>We on our side do not store your tiplinks. But, there are a couple handy approaches to recover them on your side.</Typography>
                <ol>
                    <li>Check your browser history. Remember, it’s just a URL, so it should be in there.</li>
                    <li>If you sent the tiplink to someone, it should just be in whatever messaging platform you used.</li>
                    <li>More advanced features here coming soon.</li>
                </ol>
            </div>
            <div className={styles.faqItem}>
                <FAQTitle title="How to withdraw my TipLink balance?"/>
                <Typography>If you want to move your Solana from a link to a standard, higher security crypto wallet, we suggest downloading https://phantom.app.</Typography>
                <br></br>
                <Typography>If you want to convert your crypto into dollars that can be withdrawn to your bank account, you will need a more serious account like https://www.coinbase.com or https://www.ftx.com. Those sites will guide you through the process.</Typography>
            </div>
            <div className={styles.faqItem}>
                <FAQTitle title="What are your socials?"/>
                <ul>
                    <li>Follow us on Twitter: @TipLinkOfficial</li>
                </ul>
            </div>
        </div>
    );
}

export default function FAQ() {
  return (
    <div>
        <Head>
            <title>Tip Link</title>
            <meta name="description" content="Send tip links with crypto" />
            {/* <meta property="og:title" content="You received some crypto!" /> */}
            <meta property="og:url" content="https://www.tiplink.io" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className='wrap'>
            <Header showWalletButton={false}/>
            <FAQContent/>
            <Footer/>
        </div>
    </div>
  );
}