"use client";
import { Line } from "react-chartjs-2";
import { useState } from "react";
import "chart.js/auto";

const dateFormatter = (date) => {
  return (
    date.getFullYear().toString() +
    "-" +
    (date.getMonth() + 1).toString() +
    "-" +
    date.getDate().toString()
  );
};

const AreaChart = ({ stockData }) => {
  const [timeRange, setTimeRange] = useState("7d");

  const filterData = (data, range) => {
    let filteredData;
    switch (range) {
      case "7d":
        filteredData = data.slice(-7); //get last 7 records
        break;
      case "30d":
        filteredData = data.slice(-30);
        break;
      case "90d":
        filteredData = data.slice(-90);
        break;
      default:
        filteredData = data.slice(-7);
    }
    return filteredData;
  };

  const filteredData = filterData(stockData, timeRange);
  const labels = filteredData.map((day) => dateFormatter(new Date(day.date)));
  const dataPoints = filteredData.map((day) => day.close);
  console.log(dataPoints[dataPoints.length - 1]);
  console.log(dataPoints[0]);

  const priceChange = (
    ((dataPoints[dataPoints.length - 1] - dataPoints[0]) / dataPoints[0]) *
    100
  ).toFixed(2);

  const data = {
    labels,
    datasets: [
      {
        label: "Close Price",
        data: dataPoints,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Price (USD)",
        },
      },
    },
  };

  return (
    <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-46">
      <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between">
          <div>
            <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
              Historical Stock Prices
            </h5>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Stock price movements over the period
            </p>
          </div>
          <div
            className={`flex items-center px-2.5 py-0.5 text-base font-semibold ${
              priceChange >= 0
                ? "text-green-500 dark:text-green-500"
                : "text-red-500 dark:text-red-500"
            } text-center`}
          >
            {priceChange}%
            <svg
              className="w-3 h-3 ms-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  priceChange >= 0
                    ? "M5 13V1m0 0L1 5m4-4 4 4"
                    : "M5 1v12m0 0L1 9m4 4 4-4"
                }
              />
            </svg>
          </div>
        </div>
        <Line data={data} options={options} />
        <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
          <div className="flex justify-between items-center pt-5">
            <div className="relative group">
              <button
                id="dropdownHoverButton"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
              >
                Last{" "}
                {timeRange === "1d"
                  ? "Today"
                  : `${timeRange.replace("d", " days")}`}
                <svg
                  className="w-2.5 h-2.5 ms-3"
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

              {/* Dropdown menu */}
              <div
                id="dropdownHover"
                className="absolute left-0 z-10 hidden group-hover:block bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownHoverButton"
                >
                  <li>
                    <a
                      href="#"
                      onClick={() => setTimeRange("7d")}
                      className="text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Last 7 days
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => setTimeRange("30d")}
                      className="text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Last 30 days
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => setTimeRange("90d")}
                      className="text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Last 90 days
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaChart;
