"use client";

import {
  F1Loading,
  StandingContainer,
  StandingHeading,
  StandingItem,
} from "@/components";
import { useEffect, useState } from "react";

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
          <StandingContainer title={"Ranking Drivers"}>
            <StandingHeading
              columns={[
                { title: "Pos.", width: "15%" },
                { title: "Driver", width: "40%" },
                { title: "N° R.", width: "15%", align: "center" },
                { title: "Wins", width: "15%", align: "center" },
                { title: "Pts", width: "15%", align: "center" },
              ]}
            />
            <StandingItem
              data={standings}
              columns={[
                { key: "position", title: "Pos.", width: "15%" },
                { key: "driver", title: "Driver", width: "40%" },
                { key: "races", title: "N° R.", width: "15%", align: "center" },
                { key: "wins", title: "Wins", width: "15%", align: "center" },
                {
                  key: "points",
                  title: "Pts",
                  width: "15%",
                  bold: true,
                  align: "center",
                  color: "red",
                },
              ]}
            />
          </StandingContainer>

          {/* Tabla por posición final en carrera */}
          <StandingContainer title={"Average Drivers"}>
            <StandingHeading
              columns={[
                { title: "Pos.", width: "15%" },
                { title: "Driver", width: "65%" },
                { title: "Avg", width: "20%", align: "center" },
              ]}
            />
            <StandingItem
              data={positions}
              columns={[
                { key: "position", title: "Pos.", width: "15%" },
                { key: "driver", title: "Driver", width: "65%" },
                { key: "average", title: "Avg", width: "20%", align: "center" },
              ]}
            />
          </StandingContainer>

          {/* Tabla de posiciones de Escuderias */}
          <StandingContainer title={"Ranking Scuderia"}>
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
                { key: "position", title: "Pos.", width: "20%" },
                { key: "scuderia", title: "Scuderia", width: "55%" },
                {
                  key: "points",
                  title: "Pts",
                  width: "25%",
                  align: "center",
                  bold: true,
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

export default HistoricPage;
