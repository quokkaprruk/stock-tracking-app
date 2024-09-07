"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenAtom, isLoggedInAtom } from "@/store";
import { useAtom } from "jotai";

const industries = [
  { name: "Energy", description: "Oil & Gas Exploration & Production" },
  { name: "Financials", description: "Banks - Regional" },
  { name: "Healthcare", description: "Medical Care Facilities" },
  {
    name: "Information-Technology",
    description: "Information Technology Services",
  },
  { name: "Communications", description: "Telecom Services" },
  { name: "Utilities-Water", description: "Utilities - Regulated Water" },
];

export default function Navbar() {
  const [token, setToken] = useAtom(tokenAtom);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const router = useRouter();

  // Ensuring it only runs in the browser environment
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      setToken(storedToken);
      setIsLoggedIn(!!storedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-gray-200 dark:border-gray-600 dark:bg-gray-900">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/profitlogo.png" className="h-8" alt="Website Logo" />
          <span className="self-center text-2xl text-gray-700 font-semibold whitespace-nowrap dark:text-white">
            Financed
          </span>
        </a>
        <button
          data-collapse-toggle="mega-menu-full"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="mega-menu-full"
          aria-expanded={isDropdownOpen}
          onClick={handleDropdownToggle}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          id="mega-menu-full"
          className={`items-center justify-between font-medium ${
            isDropdownOpen ? "block" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                href="/"
                className="block py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                aria-current="page"
              >
                Overview
              </a>
            </li>
            <li>
              <button
                id="mega-menu-full-dropdown-button"
                data-collapse-toggle="mega-menu-full-dropdown"
                className="flex items-center justify-between w-full py-2 px-3 text-gray-700 rounded md:w-auto hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                onClick={handleDropdownToggle}
              >
                Industries
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
            </li>
            <li>
              <a
                href="/favourites"
                className="block py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Favorites
              </a>
            </li>
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <ul className="flex flex-col md:flex-row md:space-x-4">
                  <li className="mt-2 ml-2 md:mt-0">
                    <a
                      href="/login"
                      className="bg-white text-green-400 border-solid border-2 border-green-400 hover:ring hover:ring-green-100 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                    >
                      Login
                    </a>
                  </li>
                  <li className="mt-6 ml-2 md:mt-0">
                    <a
                      href="/register"
                      className="text-white bg-green-400 hover:ring hover:ring-green-200 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Register
                    </a>
                  </li>
                </ul>
              </>
            )}
          </ul>
        </div>
      </div>
      {isDropdownOpen && (
        <div
          id="mega-menu-full-dropdown"
          className="mt-1 border-gray-200 shadow-sm bg-gray-50 md:bg-white border-y dark:bg-gray-800 dark:border-gray-600"
        >
          <div className="grid max-w-screen-xl px-4 py-5 mx-auto text-gray-700 dark:text-white sm:grid-cols-2 md:px-6">
            {industries.map((industry, index) => (
              <ul key={index}>
                <li>
                  <Link
                    href={`/industry/${encodeURIComponent(
                      industry.name.replace(/ /g, "-")
                    )}`}
                  >
                    <div
                      className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleDropdownClose}
                    >
                      <div className="font-semibold">{industry.name}</div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {industry.description}
                      </span>
                    </div>
                  </Link>
                </li>
              </ul>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
