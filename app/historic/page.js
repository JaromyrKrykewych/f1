"use client";

import { useEffect, useState } from "react";

import { F1Loading } from "@/components";

const fetchCircuitsStats = async () => {
  const res = await fetch(`/api/historic`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

const HistoricPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [standings, setStandings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [scuderiaStandings, setScuderiaStandings] = useState([]);

  useEffect(() => {
    fetchCircuitsStats()
      .then((data) => {
        if (!data) throw new Error("No data received");

        setStandings(data.standings || []);
        setPositions(data.positions || []);
        setScuderiaStandings(data.scuderiaStandings || []);
        setIsLoaded(true);
      })
      .catch((err) => console.error("Error fetching standings:", err));
  }, []);

  return (
    <div className="p-6 min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900">
      <h1 className="text-2xl font-bold mb-4">F1 Hictoric{"'"}s Standings</h1>
      {!isLoaded ? (
        <F1Loading />
      ) : (
        <div className="w-[95%] m-auto grid grid-cols-[35%_26%_26%] justify-between gap-8">
          {/* Tabla por puntos */}
          <div className={`w-full max-w-md mx-auto`}>
            <h2 className="text-white text-xl font-bold mb-5">
              Ranking Drivers
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
                  ${
                    index === standings.length - 1
                      ? "rounded-b-2xl"
                      : "rounded-none"
                  }
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

          {/* Tabla por posición final en carrera */}
          <div className={`w-full max-w-md mx-auto`}>
            <h2 className="text-white text-xl font-bold mb-5">
              Average Drivers Positions
            </h2>
            {/* Encabezado */}
            <div className="grid grid-cols-[15%_65%_20%] bg-gray-700 text-white font-bold py-3 px-4 rounded-t-2xl">
              <span>Pos.</span>
              <span>Driver</span>
              {/* <span className="text-center">N° R.</span> */}
              <span className="text-center">Avg</span>
            </div>

            {/* Filas de pilotos */}
            <div className="flex flex-col">
              {positions.map((entry, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-[15%_65%_20%] py-3 px-4 border-b border-gray-500 items-center
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
                    index === standings.length - 1
                      ? "rounded-b-2xl"
                      : "rounded-none"
                  }
                  `}
                >
                  <span className="font-bold text-lg">{entry.position}</span>
                  <span>{entry.driver}</span>
                  {/* <span className="text-center">{entry.races}</span> */}
                  <span className="text-center">{entry.average}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla de posiciones de Escuderias */}
          <div className="w-full max-w-sm mx-auto`">
            <h2 className="text-white text-xl font-bold mb-5">
              {`Scuderia's Standing`}
            </h2>
            {/* Encabezado */}
            <div className="grid grid-cols-[20%_55%_25%] bg-gray-700 text-white font-bold py-3 px-4 rounded-t-2xl">
              <span>Pos.</span>
              <span>Scuderia</span>
              <span className="text-center">Pts</span>
            </div>

            {/* Filas de scuderias */}
            <div className="flex flex-col">
              {scuderiaStandings.map((entry, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-[20%_55%_25%] py-3 px-4 border-b border-gray-500 items-center
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

export default HistoricPage;
