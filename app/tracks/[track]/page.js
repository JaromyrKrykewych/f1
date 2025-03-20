"use client";

import { useEffect, useState } from "react";

import { F1Loading } from "@/components";
import { useParams } from "next/navigation";

const fetchTrackStats = async (track) => {
  const res = await fetch(`/api/tracks/${track}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

const TrackData = () => {
  const { track } = useParams();

  const [isLoaded, setIsLoaded] = useState(false);
  const [standings, setStandings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [bestAverages, setBestAverages] = useState([]);
  const [lapsLedStandings, setLapsLedStandings] = useState([]);
  const [overallRanking, setOverallRanking] = useState([]);
  const [scuderiaStandings, setScuderiaStandings] = useState([]);
  const [scuderiaAverage, setScuderiaAverage] = useState([]);

  useEffect(() => {
    if (!track) return;

    fetchTrackStats(track)
      .then((data) => {
        if (!data) throw new Error("No data received");

        setStandings(data.standings || []);
        setPositions(data.positions || []);
        setBestAverages(data.bestAverages || []);
        setLapsLedStandings(data.lapsLedStandings || []);
        setOverallRanking(data.finalRanking || []);
        setScuderiaStandings(data.scuderiaStandings || []);
        setScuderiaAverage(data.scuderiaAverage || []);
        setIsLoaded(true);
      })
      .catch((err) => console.error("Error fetching standings:", err));
  }, [track]);

  return (
    <div className="p-6 min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900">
      <h1 className="text-2xl font-bold mb-4">Standings for {track}</h1>
      {!isLoaded ? (
        <F1Loading />
      ) : (
        <div className="w-[95%] m-auto grid grid-cols-[35%_26%_35%] gap-8">
          {/* Tabla por puntos */}
          <div className={`w-full max-w-md mx-auto`}>
            <h2 className="text-white text-xl font-bold mb-5">
              Ranking by points
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

          {/* Tabla por posición final en carrera */}
          <div className={`w-full max-w-md mx-auto`}>
            <h2 className="text-white text-xl font-bold mb-5">
              Average Final Positions
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
            ${index === standings.length - 1 ? "rounded-b-2xl" : "rounded-none"}
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

          {/* Tabla de promedios de las 3 mejores posiciones */}
          <div className={`w-full max-w-md mx-auto`}>
            <h2 className="text-white text-xl font-bold mb-5">
              Best Perfomances Average
            </h2>
            {/* Encabezado */}
            <div className="grid grid-cols-[12%_40%_12%_12%_12%_12%] bg-gray-700 text-white font-bold py-3 px-4 rounded-t-2xl">
              <span>Pos.</span>
              <span>Driver</span>
              <span className="text-center">Avg</span>
              <span className="text-center">1°</span>
              <span className="text-center">2°</span>
              <span className="text-center">3°</span>
            </div>

            {/* Filas de pilotos */}
            <div className="flex flex-col">
              {bestAverages.map((entry, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-[12%_40%_12%_12%_12%_12%] py-3 px-4 border-b border-gray-500 items-center
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
                  <span className="font-semibold text-red-500 text-center">
                    {entry.average}
                  </span>
                  <span className="text-center">{entry.best}</span>
                  <span className="text-center">{entry.second}</span>
                  <span className="text-center">{entry.third}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla de promedios final */}
          <div className="flex-col ml-5 mr-auto mt-12">
            <h2 className="text-md font-semibold mb-2">Final Ranking</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-red-700">
                  <th className="border border-gray-600  px-2 py-2">Pos.</th>
                  <th className="border border-gray-600  px-3 py-2">Driver</th>
                  <th className="border border-gray-600  px-3 py-2">Avg</th>
                </tr>
              </thead>
              <tbody>
                {overallRanking.slice(0, 60).map((entry) => (
                  <tr
                    key={entry.driver}
                    className="text-center border border-gray-600"
                  >
                    <td
                      className={`border ${
                        entry.position < 21 ? "bg-red-500" : ""
                      } px-2 py-2`}
                    >
                      {entry.position}
                    </td>
                    <td
                      className={`border ${
                        entry.position < 21 ? "bg-red-500" : ""
                      } px-3 py-2 text-left`}
                    >
                      {entry.driver}
                    </td>
                    <td
                      className={`border ${
                        entry.position < 21 ? "bg-red-500" : ""
                      } px-3 py-2`}
                    >
                      {entry.average}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex-col m-auto mt-12">
            {/* Tabla de posiciones de Escuderias */}
            <div className="flex-col m-auto">
              <h2 className="text-md font-semibold mb-2">Scuderia Standings</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-red-700">
                    <th className="border border-gray-600 px-2 py-2">Pos.</th>
                    <th className="border border-gray-600 px-3 py-2 text-left">
                      Scuderia
                    </th>
                    <th className="border border-gray-600 px-3 py-2">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {scuderiaStandings.map((entry, index) => (
                    <tr
                      key={entry.scuderia}
                      className="text-center border border-gray-600"
                    >
                      <td
                        className={`border ${
                          index < 3 ? "bg-red-500" : ""
                        } px-2 py-2`}
                      >
                        {entry.position}
                      </td>
                      <td
                        className={`border ${
                          index < 3 ? "bg-red-500" : ""
                        } px-3 py-2`}
                      >
                        {entry.scuderia}
                      </td>
                      <td
                        className={`border ${
                          index < 3 ? "bg-red-500" : ""
                        } px-3 py-2`}
                      >
                        {entry.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tabla de promedios de Escuderias */}
            <div className="flex-col m-auto mt-12">
              <h2 className="text-md font-semibold mb-2">
                Scuderia Average Standings
              </h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-red-700">
                    <th className="border border-gray-600 px-2 py-2">Pos.</th>
                    <th className="border border-gray-600 px-3 py-2 text-left">
                      Scuderia
                    </th>
                    <th className="border border-gray-600 px-3 py-2">Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {scuderiaAverage.map((entry, index) => (
                    <tr
                      key={entry.scuderia}
                      className="text-center border border-gray-300"
                    >
                      <td
                        className={`border border-gray-300 ${
                          index < 3 ? "bg-red-500" : ""
                        } px-2 py-2`}
                      >
                        {entry.position}
                      </td>
                      <td
                        className={`border border-gray-300 ${
                          index < 3 ? "bg-red-500" : ""
                        } px-3 py-2`}
                      >
                        {entry.scuderia}
                      </td>
                      <td
                        className={`border border-gray-300 ${
                          index < 3 ? "bg-red-500" : ""
                        } px-3 py-2`}
                      >
                        {entry.average}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackData;
