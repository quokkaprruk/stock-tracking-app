"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faLightHeart } from "@fortawesome/free-regular-svg-icons";
import { isLoggedInAtom, tokenAtom } from "@/store";
import { useAtom } from "jotai";
import Error from "@/components/error";
import axios from "axios";
import Chatbox from "@/components/chatbox";

// Register necessary Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const formatMarketCap = (marketCap) => {
  if (marketCap >= 1e12) return (marketCap / 1e12).toFixed(2) + " T";
  if (marketCap >= 1e9) return (marketCap / 1e9).toFixed(2) + " B";
  if (marketCap >= 1e6) return (marketCap / 1e6).toFixed(2) + " M";
  if (marketCap >= 1e3) return (marketCap / 1e3).toFixed(2) + " K";
  return marketCap.toString();
};

// 2 decimals
const formatNumber = (num) => num.toFixed(2);

//Gets stock info
const getStockHistory = async (stock, date) => {
  try {
    const resp = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/stock/${stock}?date=${date}`
    );
    return resp.data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null; // Return null if the stock doesn't exist or if there's an error
  }
};

const Stock = () => {
  // /stock/:stocksymbol => use PArams return stock name
  const { stock } = useParams();
  getStockHistory(stock, "2024-7-20");
  const [stockData, setStockData] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [stockNotFound, setStockNotFound] = useState(false);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [token] = useAtom(tokenAtom);

  useEffect(() => {
    (async () => {
      const retrievedData = await getStockHistory(stock, "2023-7-1");
      if (!retrievedData) {
        setStockNotFound(true); // if the stock doesn't exist
        return;
      }
      console.log(retrievedData);
      setStockData(retrievedData);
      console.log(isLoggedIn);
      if (isLoggedIn) {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/favourite`,
          {
            headers: { Authorization: token },
          }
        );
        for (let favorite of data) {
          console.log(favorite);
          if (stock === favorite.symbol) {
            setIsFavorite(true);
          }
        }
      }
    })();
  }, [stock, isLoggedIn]);

  if (stockNotFound) {
    return <Error message="Stock not found."/>;
  }
  if (!stockData) return <p>Loading...</p>;

  //get only the price of the end of each month
  const monthlyData = stockData.history.reduce((acc, current) => {
    const currentMonth = new Date(current.date).getMonth();
    //if the last entry in acc[] has a different month than 'current'
    //this is the new month =>  add to []
    if (
      acc.length === 0 ||
      new Date(acc[acc.length - 1].date).getMonth() !== currentMonth
    ) {
      acc.push(current);
    } else {
      acc[acc.length - 1] = current;
    }
    return acc;
  }, []);

  const datesOnly = monthlyData.map((entry) => entry.date.split("T")[0]);
  const closingPrices = monthlyData.map((entry) => entry.close);

  const chartData = {
    labels: datesOnly,
    datasets: [
      {
        label: "Closing Price",
        data: closingPrices,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        type: "linear",
        beginAtZero: false,
        title: {
          display: true,
          text: "Price",
        },
      },
    },
  };

  const handleFavoriteClick = async () => {
    setIsFavorite((prev) => !prev);
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!isFavorite) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/favourite`,
        { stock: stockData.symbol },
        { headers: { Authorization: `${token}` } }
      );
    } else {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/favourite/${stockData.symbol}`,
        { headers: { Authorization: `${token}` } },
        { stock: stockData.symbol }
      );
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans ">
      <div className="mb-4">
        <div className="flex items-center">
          <h1 className="text-gray-800 text-3xl font-bold">
            {stockData.longName}
          </h1>
        </div>
        <div className="flex items-center mt-2">
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded mr-2">
            {stockData.symbol}
          </span>
          <span className="text-gray-500">{stockData.fullExchangeName}</span>
          {isLoggedIn && (
            <button
              id="add_favorite"
              className="ml-4 text-red-600 rounded"
              onClick={handleFavoriteClick}
            >
              {isFavorite ? (
                <FontAwesomeIcon
                  icon={faSolidHeart}
                  style={{ fontSize: "1.5rem" }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faLightHeart}
                  style={{ fontSize: "1.5rem" }}
                />
              )}
            </button>
          )}
        </div>
        <div className="mt-4 text-xl flex items-center">
          <span className="font-bold text-gray-800">
            {stockData.regularMarketPrice} {stockData.currency}
          </span>
          <span
            className={`ml-4 ${
              stockData.regularMarketChange < 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {stockData.regularMarketChange < 0 ? "-" : "+"}
            {Math.abs(stockData.regularMarketChange).toFixed(2)} (
            {/* {stockData.regularMarketChange < 0 ? "-" : "+"} */}
            {stockData.regularMarketChangePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
      <div className="flex justify-center">
        <div
          className="w-full mx-auto mt-6"
          style={{ maxWidth: "80vw", height: "400px" }}
        >
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="mt-5 p-4 bg-white border-l-4  border-l-teal-500 shadow rounded-lg">
        <h3 className="text-xl text-gray-800 font-semibold mb-5">Key Stats</h3>
        <div className="flex justify-between space-x-4">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-600">
              Market Cap
            </div>
            <div className="text-lg text-teal-500 font-bold">
              {formatMarketCap(stockData.marketCap)}{" "}
              <span className="text-xs">USD</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-600">
              Dividend Yield
            </div>
            <div className="text-lg font-bold text-teal-500">
              {stockData.trailingAnnualDividendYield}%
            </div>
          </div>
          {
            //Some stocks don't have forwardPE
            stockData.forwardPE && (
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-600">
                  P/E Ratio
                </div>
                <div className="text-lg font-bold text-teal-500">
                  {formatNumber(stockData.forwardPE)}
                </div>
              </div>
            )
          }
          {
            //Some stocks don't have epsForward
            stockData.epsForward && (
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-600">
                  Basic EPS
                </div>
                <div className="text-lg font-bold text-teal-500">
                  {stockData.epsForward}{" "}
                  <span className="text-xs text-teal-500">USD/share</span>
                </div>
              </div>
            )
          }
        </div>
      </div>

      <div className="mt-6 ml-4">
        <h3 className="text-xl text-gray-800 font-semibold mb-6">
          Historical Trading
        </h3>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2 text-gray-800 text-center">
                Date (y-mm-dd)
              </th>
              <th className="border border-gray-200 text-gray-800 p-2 text-right">
                Open
              </th>
              <th className="border border-gray-200  text-gray-800 p-2 text-right">
                High
              </th>
              <th className="border border-gray-200 text-gray-800 p-2 text-right">
                Low
              </th>
              <th className="border border-gray-200 text-gray-800 p-2 text-right">
                Close
              </th>
              <th className="border border-gray-200 text-gray-800 p-2 text-right">
                Change
              </th>
              <th className="border border-gray-200 text-gray-800 p-2 text-right">
                % Change
              </th>
            </tr>
          </thead>
          <tbody>
            {monthlyData &&
              monthlyData
                .slice()
                .reverse()
                .map((price, index) => {
                  const priceChg = price.close - price.open;
                  const percentChg = (priceChg / price.open) * 100;
                  return (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="p-2 text-center">
                        {price.date.split("T")[0]}
                      </td>
                      <td className="p-2 text-right">
                        {formatNumber(price.open)}
                      </td>
                      <td className="p-2 text-right">
                        {formatNumber(price.high)}
                      </td>
                      <td className="p-2 text-right">
                        {formatNumber(price.low)}
                      </td>
                      <td className="p-2 text-right">
                        {formatNumber(price.close)}
                      </td>
                      <td className="p-2 text-right">
                        {formatNumber(priceChg)}
                      </td>
                      <td className="p-2 text-right">
                        {formatNumber(percentChg)}%
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
        <Chatbox stock={stock}/>
      </div>
    </div>
  );
};

export default Stock;
