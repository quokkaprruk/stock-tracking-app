"use client";
import React, { useState, useEffect } from "react";
import Hero from "@/components/hero";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { tokenAtom } from "@/store";
import axios from "axios";

export default function FavPage() {
  const [token, setToken] = useAtom(tokenAtom);
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/favourite`,
        {
          headers: { Authorization: token },
        }
      );

      setFavorites(data);
    })();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(favorites.length / itemsPerPage);

  const removeFavorite = (symbol) => {
    setFavorites(favorites.filter((item) => item.symbol !== symbol));
    try {
      axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/favourite/${symbol}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) return (marketCap / 1e12).toFixed(2) + " T";
    if (marketCap >= 1e9) return (marketCap / 1e9).toFixed(2) + " B";
    if (marketCap >= 1e6) return (marketCap / 1e6).toFixed(2) + " M";
    if (marketCap >= 1e3) return (marketCap / 1e3).toFixed(2) + " K";
    return marketCap.toString();
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const renderPagination = () => (
    <div className="flex justify-center mt-4">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className={`px-4 py-2 mx-1 rounded-lg ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-400"
        }`}
      >
        Previous
      </button>
      {[...Array(totalPages).keys()].map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 mx-1 rounded-lg ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-400"
            }`}
          >
            {page}
          </button>
        );
      })}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 mx-1 rounded-lg ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-400"
        }`}
      >
        Next
      </button>
    </div>
  );

  const renderFavorites = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = favorites.slice(startIndex, endIndex);

    return currentItems.map((item) => (
      <tr key={item.symbol} id={item.symbol} className="border-b">
        {Object.entries(item).map(
          (
            [key, value],
            index //return array of the favorite
          ) => (
            <td key={index} className="py-2 px-4">
              {key === "regularMarketChangePercent"
                ? `${value}%`
                : key === "marketCap"
                ? formatMarketCap(value)
                : value}
            </td>
          )
        )}
        <td className="py-2 px-4">
          <button
            id="remove"
            onClick={() => removeFavorite(item.symbol)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Remove
          </button>
        </td>
      </tr>
    ));
  };
  return (
    <div>
      <Hero text="Favorite" />
      <div className="p-6 max-w-6xl mx-auto font-sans">
        <div className="mb-4">
          <h1 className="text-gray-800 text-3xl font-bold">Favorite List</h1>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Symbol
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Industry
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Market Cap
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>{renderFavorites()}</tbody>
            </table>
          </div>
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}
