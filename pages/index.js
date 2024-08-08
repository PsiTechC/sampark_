import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin'); // Redirect to the login page
  }, [router]);

  return null;
};

export default Home;
