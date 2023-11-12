'use client'

import OvalLoader from "@/components/utility/OvalLoader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Admin = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard");
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <OvalLoader />
    </div>
  );
};

export default Admin;
