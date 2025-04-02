// import '../styles/global.css'
// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

// export default MyApp;


// src/pages/_app.js
import '../styles/global.css';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import Google OAuth provider

function MyApp({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID"> {/* Wrap your app with Google OAuth provider */}
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}

export default MyApp;
