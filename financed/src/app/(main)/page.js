/*****************************************************************************
* WEB422 – Project
* I declare that this assignment is my own work in accordance with SenecaAcademic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Group member Name: Jashanpreet Singh, Siripa Purinruk Student IDs: 112454228, 120453220 Date: 14 August, 2024
*****************************************************************************/ 
import Hero from "@/components/hero";
import AreaChart from "@/components/areachart";
import GridSector from "@/components/gridsector";

import yahooFinance from "yahoo-finance2";

/*to get 3 monts data*/
const currentDate = new Date();
const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const stockSymbol = "^GSPTSE"; //Toronto stock exchange name
const queryOptions = { period1: formatDate(threeMonthsAgo) };
const stockHistory = (await yahooFinance.chart(stockSymbol, queryOptions))
  .quotes;

export default function Home() {
  return (
    <div>
      <Hero text="Overview" />
      <AreaChart stockData={stockHistory} />
      <GridSector />
      <main className=""></main>
    </div>
  );
}
