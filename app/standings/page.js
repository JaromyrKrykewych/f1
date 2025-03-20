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
  const [standingShowed, setStandingShowed] = useState("drivers");

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
      {!isLoaded ? (
        <F1Loading />
      ) : (
        <div className="mt-12 flex flex-col md:flex-row justify-space-between gap-12 md:gap-8">
          {/* Opciones */}
          <div className="flex justify-center gap-4 mb-3 md:hidden">
            <button
              onClick={() => setStandingShowed("drivers")}
              className={`px-4 py-2 rounded-lg text-white ${
                standingShowed === "drivers" ? "bg-red-500" : "bg-gray-700"
              }`}
            >
              Drivers
            </button>
            <button
              onClick={() => setStandingShowed("scuderias")}
              className={`px-4 py-2 rounded-lg text-white ${
                standingShowed === "scuderias" ? "bg-red-500" : "bg-gray-700"
              }`}
            >
              Scuderias
            </button>
          </div>
          {/* Drivers */}
          <div
            className={`${
              standingShowed !== "drivers" && "hidden"
            } w-full max-w-md mx-auto md:flex md:flex-col`}
          >
            <h2 className="text-white text-xl font-bold mb-5">
              {`Driver's Standing`}
            </h2>
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
          <div
            className={`${
              standingShowed !== "scuderias" && "hidden"
            } w-full max-w-md mx-auto md:flex md:flex-col`}
          >
            <h2 className="text-white text-xl font-bold mb-5">
              {`Scuderia's Standing`}
            </h2>
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
