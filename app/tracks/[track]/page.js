"use client";

import {
  F1Loading,
  StandingContainer,
  StandingHeading,
  StandingItem,
} from "@/components";
import { useEffect, useState } from "react";

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
        <div className="w-[95%] m-auto grid grid-cols-[35%_26%_35%] grid-rows-auto gap-8">
          {/* Tabla por puntos */}
          <StandingContainer title="Ranking by points">
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
                {
                  key: "position",
                  title: "Pos.",
                  width: "15%",
                  bold: true,
                  textSize: "text-lg",
                },
                { key: "driver", title: "Driver", width: "40%" },
                { key: "races", title: "N° R.", width: "15%", align: "center" },
                { key: "wins", title: "Wins", width: "15%", align: "center" },
                {
                  key: "points",
                  title: "Pts",
                  width: "15%",
                  align: "center",
                  bold: true,
                  color: "red",
                },
              ]}
            />
          </StandingContainer>

          {/* Tabla por posición final en carrera */}
          <StandingContainer
            title={"Average Final Positions"}
            maxWidth="max-w-md"
          >
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
                {
                  key: "position",
                  title: "Pos.",
                  width: "15%",
                  bold: true,
                  textSize: "text-lg",
                },
                { key: "driver", title: "Driver", width: "65%" },
                { key: "average", title: "Avg", width: "20%", align: "center" },
              ]}
            />
          </StandingContainer>

          {/* Tabla de promedios de las 3 mejores posiciones */}
          <StandingContainer title={"Best Perfomances Average"}>
            <StandingHeading
              columns={[
                { title: "Pos.", width: "12%" },
                { title: "Driver", width: "40%" },
                { title: "Avg", width: "12%", align: "center" },
                { title: "1°", width: "12%", align: "center" },
                { title: "2°", width: "12%", align: "center" },
                { title: "3°", width: "12%", align: "center" },
              ]}
            />
            <StandingItem
              data={bestAverages}
              columns={[
                {
                  key: "position",
                  title: "Pos.",
                  width: "12%",
                  bold: true,
                  textSize: "text-lg",
                },
                { key: "driver", title: "Driver", width: "40%" },
                {
                  key: "average",
                  title: "Avg",
                  width: "12%",
                  align: "center",
                  color: "red",
                },
                { key: "best", title: "1°", width: "12%", align: "center" },
                { key: "second", title: "2°", width: "12%", align: "center" },
                { key: "third", title: "3°", width: "12%", align: "center" },
              ]}
            />
          </StandingContainer>

          {/* Tabla de promedios final */}
          <StandingContainer title="Final Ranking" maxWidth="max-w-xs">
            <StandingHeading
              columns={[
                { title: "Pos.", width: "15%" },
                { title: "Driver", width: "60%" },
                { title: "Avg", width: "25%", align: "center" },
              ]}
            />
            <StandingItem
              data={overallRanking}
              columns={[
                {
                  key: "position",
                  title: "Pos.",
                  width: "15%",
                  bold: true,
                  textSize: "text-lg",
                },
                { key: "driver", title: "Driver", width: "60%" },
                { key: "average", title: "Avg", width: "25%", align: "center" },
              ]}
            />
          </StandingContainer>

          {/* Tabla de posiciones de Escuderias */}
          <StandingContainer title="Scuderia Standings" maxWidth="max-w-xs">
            <StandingHeading
              columns={[
                { title: "Pos.", width: "15%" },
                { title: "Scuderia", width: "60%" },
                { title: "Pts", width: "25%", align: "center" },
              ]}
            />
            <StandingItem
              data={scuderiaStandings}
              columns={[
                {
                  key: "position",
                  title: "Pos.",
                  width: "15%",
                  bold: true,
                  textSize: "text-lg",
                },
                { key: "scuderia", title: "Scuderia", width: "60%" },
                { key: "points", title: "Pts", width: "25%", align: "center" },
              ]}
            />
          </StandingContainer>

          {/* Tabla de promedios de Escuderias */}
          <StandingContainer title="Scuderia Average" maxWidth="max-w-xs">
            <StandingHeading
              columns={[
                { title: "Pos.", width: "15%" },
                { title: "Scuderia", width: "60%" },
                { title: "Avg", width: "25%", align: "center" },
              ]}
            />
            <StandingItem
              data={scuderiaAverage}
              columns={[
                {
                  key: "position",
                  title: "Pos.",
                  width: "15%",
                  bold: true,
                  textSize: "text-lg",
                },
                { key: "scuderia", title: "Scuderia", width: "60%" },
                { key: "average", title: "Avg", width: "25%", align: "center" },
              ]}
            />
          </StandingContainer>
        </div>
      )}
    </div>
  );
};

export default TrackData;
