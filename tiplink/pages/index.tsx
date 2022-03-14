import "@fontsource/poppins";
import Head from "next/head";
import FrontPage from "../components/FrontPage";
import SLWallet from "../components/SLWallet";
import Progress from "../components/ui/common/Progress";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const [ mounted, setMounted ] = useState<boolean>(false);
  const [ fragment, setFragment ] = useState<string>("");
  const { asPath } = useRouter();

  useEffect(()=>{
    setMounted(true);
    const frag = asPath.split('#')[1];
    if((frag !== undefined) && (frag !== null)) {
      setFragment(frag);
    }
  }, [ asPath ]);

  return (
    <div>
      <Head>
        <title>Tip Link</title>
        <meta name="description" content="Send tip links with crypto" />
        <meta property="og:title" content="You received some crypto!" />
        <meta property="og:url" content="https://www.tiplink.io" />
        <meta property="og:image" content="http://tiplink.io/tiplink-card-preview.png" />
        <meta property="og:image:secure_url" content="https://tiplink.io/tiplink-card-preview.png" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="You received some crypto!"/>
        <meta name="twitter:image" content="https://tiplink.io/tiplink-card-preview.png"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {mounted 
        ? ((fragment === "") ? <FrontPage/> : <SLWallet/>)
        : <Progress/>
      }
    </div>
  );
}
