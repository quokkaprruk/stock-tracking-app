"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home({ text }) {
  const [stock, setStock] = useState("");
  const router = useRouter();
  const handleSearch = (e) => {
    e.preventDefault(); //
    if (stock.trim()) {
      router.push(`/stock/${encodeURIComponent(stock)}`);
    }
  };
  return (
    <section className="relative w-full h-screen max-h-[75vh] bg-gray-700 bg-blend-multiply">
      <Image
        src="/wallpaper2.jpg"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        quality={75}
        priority // This ensures the image loads quickly
        className="absolute inset-0 z-0 mix-blend-multiply"
      />
      <div className="relative z-5 px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-40">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
          {text}
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
          Canadian Stocks
        </p>
        <div className="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-y-0">
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
              <input
                type="search"
                id="default-search"
                className="block w-96 p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Stock symbol"
                value={stock}
                required
                onChange={(e) => setStock(e.target.value)}
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="w-4 h-4 text-white-500 dark:text-white-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
