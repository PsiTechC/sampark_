import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Navigation</h2>
      <ul>
        
        <li className="mb-2">
          <Link href="/superadmin/clients">
            <a className="text-white hover:text-gray-400">Clients</a>
          </Link>
        </li>
        {/* Add more links as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;
