'use client'

import Link from "next/link";
import MazindaLogo from "@/public/logo_mazinda.png";
import Image from "next/image";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";

const Navbar = () => {
  let pathname = usePathname();

  const handleLogout = () => {
    Cookies.remove('admin_token');
  }

  return (
    <nav className="bg-white p-4 flex justify-between">
      <Link href="/">
        <Image width={120} src={MazindaLogo} alt="Mazinda Logo" />
      </Link>
      {!pathname.includes('auth') ? <Link href='/auth/login' onClick={handleLogout} className="bg-yellow-400 py-2 px-5 text-white rounded-full">Logout</Link> : null}
    </nav>
  );
};

export default Navbar;
