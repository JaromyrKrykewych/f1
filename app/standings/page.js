"use client";

import { useEffect, useState } from "react";

import { F1Loading } from "@/components";

const fetchTrackStats = async () => {
  const res = await fetch(`/api/tracks`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

const OverallStandings = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [standings, setStandings] = useState([]);
  const [scuderiaStandings, setScuderiaStandings] = useState([]);

  useEffect(() => {
    fetchTrackStats()
      .then((data) => {
        if (!data) throw new Error("No data received");

        setStandings(data.standings || []);
        setScuderiaStandings(data.scuderiaStandings || []);
        setIsLoaded(true);
      })
      .catch((err) => console.error("Error fetching standings:", err));
  }, []);

  return (
    <div className="p-6 min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900">
      <h1 className="text-2xl font-bold mb-4">Overall Standings</h1>

      {!isLoaded ? (
        <F1Loading />
      ) : (
        // <div className="w-[80%] m-auto grid grid-cols-2 gap-4">
        //   <div className="flex-col mr-auto">
        //     <h2 className="text-md font-semibold mb-2">Ranking by points</h2>
        //     <table className="min-w-1/3 border-collapse border border-gray-300">
        //       <thead>
        //         <tr className="bg-red-700">
        //           <th className="border border-gray-600 px-2 py-2">Pos.</th>
        //           <th className="border border-gray-600 px-3 py-2">Driver</th>
        //           <th className="border border-gray-600 px-3 py-2">N° R.</th>
        //           <th className="border border-gray-600 px-3 py-2">Wins</th>
        //           <th className="border border-gray-600 px-3 py-2">Pts</th>
        //         </tr>
        //       </thead>

        //       <tbody>
        //         {standings
        //           .sort((a, b) => {
        //             return b.points - a.points || b.wins - a.wins;
        //           })
        //           .map((entry) => (
        //             <tr
        //               key={entry.driver}
        //               className="text-center border border-gray-600"
        //             >
        //               <td className="border px-2 py-2">{entry.position}</td>
        //               <td className="border px-3 py-2 text-left">
        //                 {entry.driver}
        //               </td>
        //               <td className="border px-3 py-2">{entry.races}</td>
        //               <td className="border px-3 py-2">{entry.wins}</td>
        //               <td className="border px-3 py-2 font-bold">
        //                 {entry.points}
        //               </td>
        //             </tr>
        //           ))}
        //       </tbody>
        //     </table>
        //   </div>

        //   <div className="flex-col ml-auto">
        //     <h2 className="text-md font-semibold mb-2">Scuderia Standings</h2>
        //     <table className="w-full border-collapse border border-gray-600">
        //       <thead>
        //         <tr className="bg-red-700">
        //           <th className="border border-gray-600 px-2 py-2">Pos.</th>
        //           <th className="border border-gray-600 px-3 py-2 text-left">
        //             Scuderia
        //           </th>
        //           <th className="border border-gray-600 px-3 py-2">Wins</th>
        //           <th className="border border-gray-600 px-3 py-2">Pts</th>
        //         </tr>
        //       </thead>
        //       <tbody>
        //         {scuderiaStandings.map((entry) => (
        //           <tr
        //             key={entry.scuderia}
        //             className="text-center border border-gray-600"
        //           >
        //             <td className={`border px-2 py-2`}>{entry.position}</td>
        //             <td className={`border px-3 py-2`}>{entry.scuderia}</td>
        //             <td className={`border px-3 py-2`}>{entry.wins}</td>
        //             <td className={`border px-3 py-2`}>{entry.points}</td>
        //           </tr>
        //         ))}
        //       </tbody>
        //     </table>
        //   </div>
        // </div>
        <div className="flex flex-col md:flex-row justify-space-between gap-12 md:gap-8">
          {/* Drivers */}
          <div className="w-full max-w-md mx-auto">
            {/* Encabezado */}
            <div className="grid grid-cols-[15%_40%_15%_15%_15%] bg-gray-700 text-white font-bold py-3 px-4 rounded-t-2xl">
              <span>Pos.</span>
              <span>Driver</span>
              <span className="text-center">N° R.</span>
              <span className="text-center">Wins</span>
              <span className="text-center">Pts</span>
            </div>

            {/* Filas de pilotos */}
            <div className="flex flex-col">
              {standings.map((entry, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-[15%_40%_15%_15%_15%] py-3 px-4 border-b border-gray-500 items-center
            ${
              index === 0
                ? "bg-yellow-500 text-gray-900 font-bold"
                : index === 1
                ? "bg-gray-400 text-gray-900 font-bold"
                : index === 2
                ? "bg-orange-500 text-gray-900 font-bold"
                : "bg-gradient-to-b from-gray-800 to-gray-600 text-white"
            }
            ${index === standings.length - 1 ? "rounded-b-2xl" : "rounded-none"}
            `}
                >
                  <span className="font-bold text-lg">{entry.position}</span>
                  <span>{entry.driver}</span>
                  <span className="text-center">{entry.races}</span>
                  <span className="text-center">{entry.wins}</span>
                  <span className="font-semibold text-red-500 text-center">
                    {entry.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Scuderias */}
          <div className="w-full max-w-sm mx-auto">
            {/* Encabezado */}
            <div className="grid grid-cols-[15%_55%_15%_15%] bg-gray-700 text-white font-bold py-3 px-4 rounded-t-2xl">
              <span>Pos.</span>
              <span>Scuderia</span>
              <span className="text-center">Wins</span>
              <span className="text-center">Pts</span>
            </div>

            {/* Filas de pilotos */}
            <div className="flex flex-col">
              {scuderiaStandings.map((entry, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-[15%_55%_15%_15%] py-3 px-4 border-b border-gray-500 items-center
            ${
              index === 0
                ? "bg-yellow-500 text-gray-900 font-bold"
                : index === 1
                ? "bg-gray-400 text-gray-900 font-bold"
                : index === 2
                ? "bg-orange-500 text-gray-900 font-bold"
                : "bg-gradient-to-b from-gray-800 to-gray-600 text-white"
            }
            ${
              index === scuderiaStandings.length - 1
                ? "rounded-b-2xl"
                : "rounded-none"
            }
            `}
                >
                  <span className="font-bold text-lg">{entry.position}</span>
                  <span>{entry.scuderia}</span>
                  <span className="text-center">{entry.wins}</span>
                  <span className="font-semibold text-red-500 text-center">
                    {entry.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverallStandings;
