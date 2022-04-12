import "@fontsource/poppins";
import Head from "next/head";
import Header from "../components/ui/common/Header";
import SLWallet from "../components/SLWallet";
import Progress from "../components/ui/common/Progress";
import Footer from "../components/ui/common/Footer";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const [ mounted, setMounted ] = useState<boolean>(false);
  const { asPath } = useRouter();

  useEffect(()=>{
    setMounted(true);
  }, [ asPath ]);

  return (
    <div>
      <Head>
        <title>Tip Link</title>
        <meta name="description" content="Send tip links with crypto" />
        {/* <meta property="og:title" content="You received some crypto!" /> */}
        <meta property="og:title" content="You received some crypto!" />
        <meta property="og:url" content="https://www.tiplink.io" />
        <meta property="og:image" content="https://tiplink.io/tiplink-card-preview.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:site" content="@TipLinkOfficial"/>
        <meta name="twitter:title" content="You received some crypto!"/>
        <meta name="twitter:description" content=""/>
        <meta name="twitter:url" content="https://www.tiplink.io"/>
        <meta name="twitter:image" content="http://tiplink.io/tiplink-card-preview.png"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='wrap'>
        <Header/>
        {mounted 
          ? <SLWallet/>
          : <Progress/>
        }
        <Footer/>
      </div>
    </div>
  );
}
