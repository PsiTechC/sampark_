// import '../styles/global.css'
// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

// export default MyApp;


// src/pages/_app.js
import '../styles/global.css';
import 'react-datepicker/dist/react-datepicker.css';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import Google OAuth provider
import useSentimentPolling from "@/hooks/useSentimentPolling"; //bolna sentiment
import useBatchSentimentPolling from "@/hooks/useBatchSentimentPolling"; //bolna batch sentiment
import useUserCallPolling from "@/hooks/useUserCallPolling";
import useBatchWSPolling from "@/hooks/useBatchWSPolling";
import useBatchWSPollingVapi from "@/hooks/useBatchWSPollingVapi";




function MyApp({ Component, pageProps }) {
  
// useSentimentPolling();
// useBatchSentimentPolling();
// useUserCallPolling();
;  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}

export default MyApp;
