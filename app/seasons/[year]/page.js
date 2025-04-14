"use client";

import {
  F1Loading,
  StandingContainer,
  StandingHeading,
  StandingItem,
} from "@/components";
import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

const fetchSeasonStats = async (year) => {
  const res = await fetch(`/api/season/${year}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

const SeasonYear = () => {
  const { year } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [standings, setStandings] = useState([]);
  const [scuderiaStandings, setScuderiaStandings] = useState([]);
  const [standingShowed, setStandingShowed] = useState("drivers");

  useEffect(() => {
    if (!year) return;

    fetchSeasonStats(year)
      .then((data) => {
        if (!data) throw new Error("No data received");
        setStandings(data.standings);
        setScuderiaStandings(data.scuderiaStandings);
        setIsLoaded(true);
      })
      .catch((err) => console.error("Error fetching standings:", err));
  }, [year]);

  return (
    <div className="p-6 min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900">
      <h1 className="text-2xl font-bold mb-4">{`${year}'s F1 Standings`}</h1>
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
          <StandingContainer
            title="Driver's Standing"
            maxWidth="max-w-md"
            visible={standingShowed === "drivers"}
          >
            <StandingHeading
              columns={[
                { title: "Pos.", width: "12%" },
                { title: "Driver", width: "36%" },
                { title: "Team", width: "28%" },
                { title: "Wins", width: "12%", align: "center" },
                { title: "Pts", width: "12%", align: "center" },
              ]}
            />
            <StandingItem
              data={standings}
              columns={[
                {
                  key: "position",
                  title: "Pos.",
                  width: "12%",
                  bold: true,
                  textSize: "text-lg",
                },
                { key: "driver", title: "Driver", width: "36%" },
                { key: "scuderia", title: "Team", width: "28%" },
                { key: "wins", title: "Wins", width: "12%", align: "center" },
                {
                  key: "points",
                  title: "Pts",
                  width: "12%",
                  align: "center",
                  color: "red",
                },
              ]}
            />
          </StandingContainer>

          {/* Scuderias */}
          <StandingContainer
            title="Scuderia's Standing"
            maxWidth="max-w-xs"
            visible={standingShowed === "scuderias"}
          >
            <StandingHeading
              columns={[
                { title: "Pos.", width: "20%" },
                { title: "Scuderia", width: "55%" },
                { title: "Pts", width: "25%", align: "center" },
              ]}
            />
            <StandingItem
              data={scuderiaStandings}
              columns={[
                {
                  key: "position",
                  title: "Pos.",
                  width: "20%",
                  bold: true,
                  textSize: "text-lg",
                },
                { key: "scuderia", title: "Scuderia", width: "55%" },
                {
                  key: "points",
                  title: "Pts",
                  width: "25%",
                  align: "center",
                  color: "red",
                },
              ]}
            />
          </StandingContainer>
        </div>
      )}
    </div>
  );
};

export default SeasonYear;
