import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import cookies from 'js-cookie';

const withAuth = (WrappedComponent, requiredRole) => {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkRole = async () => {
        const role = cookies.get('role');
        if (role === requiredRole) {
          setAuthorized(true);
        } else {
          router.push('/login');
        }
        setLoading(false);
      };

      checkRole();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!authorized) {
      return <div>Unauthorized</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
