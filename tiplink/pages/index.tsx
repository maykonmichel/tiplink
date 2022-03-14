import "@fontsource/poppins";
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
      {mounted 
        ? ((fragment === "") ? <FrontPage/> : <SLWallet/>)
        : <Progress/>
      }
    </div>
  );
}
