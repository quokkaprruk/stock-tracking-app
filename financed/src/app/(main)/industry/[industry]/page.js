"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Hero from "@/components/hero";
import axios from "axios";

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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

export default function IndustryPage() {
  const { industry } = useParams(); //get the params from the url
  const [description, setDescription] = useState("");
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    if (industry) {
      const selectedIndustry = industries.find(
        (ind) => ind.name.toLowerCase() === industry.toLowerCase()
      );
      console.log(industry.toLowerCase());

      if (selectedIndustry) {
        setDescription(selectedIndustry.description);
      } else {
        setDescription("Unknown Industry");
      }
    }
  }, [industry]); //run callback func when industry changed (based on the current route)

  useEffect(() => {
    if (description) {
      const fetchStocksforSector = async () => {
        try {
          const res = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/stock/industries/${encodeURIComponent(description)}`
          );
          console.log(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/stock/industries/${encodeURIComponent(description)}`
          );

          setStocks(res.data);
        } catch (e) {
          console.log("Error fetching stock: ", e);
        }
      };
      fetchStocksforSector();
    }
  }, [description]); //ftch stock company based on industry desc when 'desc' state change

  return (
    <div>
      <Hero text={capitalizeFirstLetter(industry)} />
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <header className=" mb-4 lg:mb-6 not-format">
          <h2 className="mt-10 mb-4 text-3xl font-extrabold leading-tight text-gray-700 lg:mb-6 lg:text-4xl dark:text-white">
            Largest companies in this industry
          </h2>
        </header>
      </div>
      <div className="w-full lg:w-4/5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map((stock, index) => (
            <a
              key={index}
              href={`/stock/${encodeURIComponent(stock.symbol)}`}
              className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {stock.symbol}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {stock.company_name}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
