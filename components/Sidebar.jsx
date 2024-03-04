"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Pie from "@/public/svg/Pie";
import FourBlocks from "@/public/svg/FourBlocks";
import Bell from "@/public/svg/Bell";
import Users from "@/public/svg/Users";
import ShoppingBag from "@/public/svg/ShoppingBag";
import Logout from "@/public/svg/Logout";
import UserSetting from "@/public/svg/UserSetting";
import Store from "@/public/svg/Store";
import DropBox from "@/public/svg/DropBox";

const Sidebar = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/client");
    },
  });

  console.log(session?.user);

  return (
    <>
      <aside
        id="default-sidebar"
        className="top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {session?.user?.allowedPaths.includes("/") && (
              <li>
                <Link
                  href="/"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <Pie />
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>
            )}
            {session?.user?.allowedPaths.includes("/manage-shops") && (
              <li>
                <Link
                  href="/manage-shops"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <Store />
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Manage Shops
                  </span>
                  {/* <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  Pro
                </span> */}
                </Link>
              </li>
            )}

            {session?.user?.allowedPaths.includes("/product-approval") && (
              <li>
                <Link
                  href="/product-approval"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <DropBox />
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Product Management
                  </span>
                  {/* <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  3
                </span> */}
                </Link>
              </li>
            )}
            {session?.user?.allowedPaths.includes("/bulk-upload-requests") && (
              <li>
                <Link
                  href="/bulk-upload-requests"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Bulk Upload Requests
                  </span>
                </Link>
              </li>
            )}
            {session?.user?.allowedPaths.includes("/food-management") && (
              <li>
                <Link
                  href="/food-management"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <Users />
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Food Management
                  </span>
                </Link>
              </li>
            )}
            {session?.user?.allowedPaths.includes("/coupons") && (
              <li>
                <Link
                  href="/coupons"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <ShoppingBag />
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Available Coupons
                  </span>
                </Link>
              </li>
            )}
            {/* <li>
              <Link
                href="/delivery-boys"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <Users />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Assign Delivery Boy
                </span>
              </Link>
            </li> */}
            {session?.user?.allowedPaths.includes("/categories") && (
              <li>
                <Link
                  href="/categories"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FourBlocks />
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Category
                  </span>
                </Link>
              </li>
            )}

            {session?.user?.allowedPaths.includes("/locations") && (
              <li>
                <Link
                  href="/locations"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <Logout />
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Add/Drop Location
                  </span>
                </Link>
              </li>
            )}

            {session?.user?.allowedPaths.includes("/manage-layout") && (
              <li>
                <Link
                  href="/manage-layout"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FourBlocks />
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Layout Management
                  </span>
                </Link>
              </li>
            )}
          </ul>
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200">
            {session?.user?.allowedPaths.includes("/admin-management") && (
              <li>
                <Link
                  href="/admin-management"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <UserSetting />
                  <span className="ml-3">Manage Admin Roles</span>
                </Link>
              </li>
            )}
            <li>
              <button
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                onClick={() => signOut()}
              >
                <Logout />
                <span className="ml-3">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
