import '../styles/globals.css'
import { AppProps } from 'next/app';
import GlobalContextWrapper from '../components/GlobalContextWrapper';
// Default styles that can be overridden by your app

const MyApp = ({ Component, pageProps }: AppProps) => {
  return(
    <GlobalContextWrapper>
      <Component {...pageProps}/>
    </GlobalContextWrapper>
  );
}

export default MyApp
