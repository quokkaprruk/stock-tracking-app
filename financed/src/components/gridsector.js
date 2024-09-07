import React from "react";
import Image from "next/image";
import Link from "next/link";

function Gridindustry() {
  const industries = [
    {
      name: "Energy",
      subdesc:
        "Encompasses the production and distribution of energy resources.",
      img: "/energy.png",
    },
    {
      name: "Financials",
      subdesc: "Covers banking, investment, and insurance services.",
      img: "/financ.png",
    },
    {
      name: "Healthcare",
      subdesc: "Focuses on medical services, equipment, and pharmaceuticals.",
      img: "/healthcare.png",
    },
    {
      name: "Information Technology",
      subdesc: "Includes software, hardware, and IT service providers.",
      img: "/infotech.png",
    },
    {
      name: "Communication",
      subdesc: "Involves telecommunications, media, and entertainment.",
      img: "/communications.png",
    },
    {
      name: "Utilities",
      subdesc: "Provides essential services such as electricity and water.",
      img: "/utilities.png",
    },
  ];

  return (
    <div>
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <header className="mb-4 lg:mb-6 not-format">
          <h2 className="mb-4 text-3xl font-extrabold leading-tight text-gray-700 lg:mb-6 lg:text-4xl dark:text-white">
            Industries
          </h2>
          <p className="text-xl text-gray-500 dark:text-white">
            Overview of different industries in the stock market
          </p>
        </header>
      </div>

      <div className="flex justify-center ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((industry, index) => (
            <div key={index} className="flex justify-center mt-5">
              <Link
                href={`/industry/${encodeURIComponent(
                  industry.name.replace(/ /g, "-")
                )}`}
                className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <h5 className="ml-2 text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                  {industry.name}
                </h5>
                <div className="flex items-center">
                  <Image
                    src={industry.img}
                    alt={industry.name}
                    width={50}
                    height={40}
                    className="mt-4 ml-2"
                  />
                  <p className="mt-4 ml-6 font-normal text-gray-400 dark:text-gray-400">
                    {industry.subdesc}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Gridindustry;
