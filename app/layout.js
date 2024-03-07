"use client";

import "./globals.css";
import { Quicksand } from "next/font/google";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import { ToastContainer } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NextTopLoader from "nextjs-toploader";

import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/AuthProvider";
import MobileSidebar from "@/components/MobileSidebar";

const quicksand = Quicksand({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
});

// export const metadata = {
//   title: "Admin - Mazinda",
//   description: "Admin End for Mazinda",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <AuthProvider>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            transition={Slide}
            theme="light"
          />
          <div className="flex items-center ">
            <div className="md:hidden ml-3">
              <MobileSidebar />
            </div>
            <div className="hidden md:block">
              <Navbar />
            </div>
          </div>
          <NextTopLoader color="#F17E13" showSpinner={false} />
          <div className="flex">
            <div className="hidden md:block">
              <Sidebar />
            </div>

            <div className="flex-1 p-4 bg-gray-50">{children}</div>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
