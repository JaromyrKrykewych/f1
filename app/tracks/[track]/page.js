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
        <div className="grid grid-cols-3">
          {/* Tabla por puntos */}
          <div className="flex-col m-auto">
            <h2 className="text-md font-semibold mb-2">Ranking by points</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-red-700">
                  <th className="border border-gray-600 px-2 py-2">Pos.</th>
                  <th className="border border-gray-600 px-3 py-2">Driver</th>
                  <th className="border border-gray-600 px-3 py-2">N° R.</th>
                  <th className="border border-gray-600 px-3 py-2">Wins</th>
                  <th className="border border-gray-600 px-3 py-2">Pts</th>
                </tr>
              </thead>

              <tbody>
                {standings
                  .sort((a, b) => {
                    return b.points - a.points || b.wins - a.wins;
                  })
                  .map((entry) => (
                    <tr
                      key={entry.driver}
                      className="text-center border border-gray-600"
                    >
                      <td className="border px-2 py-2">{entry.position}</td>
                      <td className="border px-3 py-2 text-left">
                        {entry.driver}
                      </td>
                      <td className="border px-3 py-2">{entry.races}</td>
                      <td className="border px-3 py-2">{entry.wins}</td>
                      <td className="border px-3 py-2 font-bold">
                        {entry.points}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Tabla por posición final en carrera */}
          <div className="flex-col m-auto">
            <h2 className="text-md font-semibold mb-2">
              Average Final Positions
            </h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-red-700">
                  <th className="border border-gray-600 px-2 py-2">Pos.</th>
                  <th className="border border-gray-600 px-3 py-2">Driver</th>
                  <th className="border border-gray-600 px-3 py-2">Avg</th>
                </tr>
              </thead>

              <tbody>
                {positions.map((entry) => (
                  <tr
                    key={entry.driver}
                    className="text-center border border-gray-600"
                  >
                    <td className="border px-2 py-2">{entry.position}</td>
                    <td className="border px-3 py-2 text-left">
                      {entry.driver}
                    </td>
                    <td className="border px-3 py-2">{entry.average}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tabla de promedios de las 3 mejores posiciones */}
          <div className="flex-col m-auto">
            <h2 className="text-md font-semibold mb-2">
              Average Best Positions
            </h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-red-700">
                  <th className="border border-gray-600 px-2 py-2">Pos.</th>
                  <th className="border border-gray-600 px-3 py-2">Driver</th>
                  <th className="border border-gray-600 px-3 py-2">Avg</th>
                  <th className="border border-gray-600 px-3 py-2">1°</th>
                  <th className="border border-gray-600 px-3 py-2">2°</th>
                  <th className="border border-gray-600 px-3 py-2">3°</th>
                </tr>
              </thead>

              <tbody>
                {bestAverages.map((entry) => (
                  <tr
                    key={entry.driver}
                    className="text-center border border-gray-600"
                  >
                    <td className="border px-2 py-2">{entry.position}</td>
                    <td className="border px-3 py-2 text-left">
                      {entry.driver}
                    </td>
                    <td className="border px-3 py-2 font-bold">
                      {entry.average}
                    </td>
                    <td className="border px-3 py-2">{entry.best}</td>
                    <td className="border px-3 py-2">{entry.second}</td>
                    <td className="border px-3 py-2">{entry.third}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

          {/* Tabla de vueltas lideradas */}
          {/* <div className="flex-col m-auto mt-12">
          <h2 className="text-md font-semibold mb-2">Laps Led Standings</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 dark:bg-blue-600">
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Pos.
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Driver
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Laps
                </th>
              </tr>
            </thead>
            <tbody>
              {lapsLedStandings.slice(0, 20).map((entry) => (
                <tr
                  key={entry.driver}
                  className="text-center border border-gray-300"
                >
                  <td
                    className={`border border-gray-300 ${
                      entry.position < 11 ? "bg-blue-500" : ""
                    } px-3 py-2`}
                  >
                    {entry.position}
                  </td>
                  <td
                    className={`border border-gray-300 ${
                      entry.position < 11 ? "bg-blue-500" : ""
                    } px-3 py-2`}
                  >
                    {entry.driver}
                  </td>
                  <td
                    className={`border border-gray-300 ${
                      entry.position < 11 ? "bg-blue-500" : ""
                    } px-3 py-2`}
                  >
                    {entry.lapsLed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

          {/* Tabla de victorias */}
          {/* <div className="flex-col m-auto mt-12">
          <h2 className="text-md font-semibold mb-2">Victory Table</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 dark:bg-blue-600">
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Pos.
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Driver
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Wins
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Pts
                </th>
              </tr>
            </thead>
            <tbody>
              {standings
                .sort((a, b) => {
                  return b.wins - a.wins || b.points - a.points;
                })
                .slice(0, 20)
                .map((entry, index) => (
                  <tr
                    key={entry.driver}
                    className="text-center border border-gray-300"
                  >
                    <td
                      className={`border border-gray-300 ${
                        index < 10 ? "bg-blue-500" : ""
                      } px-3 py-2`}
                    >
                      {index + 1}
                    </td>
                    <td
                      className={`border border-gray-300 ${
                        index < 10 ? "bg-blue-500" : ""
                      } px-3 py-2`}
                    >
                      {entry.driver}
                    </td>
                    <td
                      className={`border border-gray-300 ${
                        index < 10 ? "bg-blue-500" : ""
                      } px-3 py-2`}
                    >
                      {entry.wins}
                    </td>
                    <td
                      className={`border border-gray-300 ${
                        index < 10 ? "bg-blue-500" : ""
                      } px-3 py-2`}
                    >
                      {entry.points}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div> */}
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
