"use client";

import "./globals.css";
import { Quicksand } from "next/font/google";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide } from "react-toastify";

import NextTopLoader from "nextjs-toploader";

import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/AuthProvider";

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
          <Navbar />
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
