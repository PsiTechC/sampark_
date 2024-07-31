import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={`p-4 shadow-md ${styles.navbar}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <div className="text-black text-2xl font-bold ml-5">Sampark AI</div>
        </div>
        <div className="space-x-4">
          <Link href="/clients" className={`text-black hover:text-gray-700 ${styles['nav-link']}`}>Clients</Link>
          <Link href="/dashboard" className={`text-black hover:text-gray-700 ${styles['nav-link']}`}>Dashboard</Link>
          <Link href="/admin" className={`text-black hover:text-gray-700 ${styles['nav-link']}`}>Admin</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
