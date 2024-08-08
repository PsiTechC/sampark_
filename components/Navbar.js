// // components/Navbar.js
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/Navbar.module.css';
//import dashboard from '../pages/dashboard';

const Navbar = () =>
   {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  return (
    <nav className={`p-4 shadow-md ${styles.navbar}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center ml-1.8">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <div className="text-black dark:text-black text-3xl font-bold ml-5">Sampark AI</div>
        </div>
        <div className="space-x-4 flex items-center mr-3">

          <Link href="/admin" className={`text-black dark:text-black hover:text-gray-700 dark:hover:text-gray-300 ${styles['nav-link']}`}>Admin</Link>
          <Link href="/clients" className={`text-black dark:text-black hover:text-gray-700 dark:hover:text-gray-300 ${styles['nav-link']}`}>Clients</Link>
          {/* <button onClick={toggleDarkMode} className="text-black dark:text-white">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
