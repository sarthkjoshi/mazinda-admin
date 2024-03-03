"use client";

import Link from "next/link";
import MazindaLogo from "@/public/logo_mazinda.png";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/client");
    },
  });
  console.log("session", session);

  return (
    <nav className="bg-white p-4 flex justify-between">
      <Link href="/">
        <Image width={120} src={MazindaLogo} alt="Mazinda Logo" />
      </Link>
      <Button onClick={() => signOut()} className="bg-yellow-400 text-white">
        Logout
      </Button>
    </nav>
  );
};

export default Navbar;
