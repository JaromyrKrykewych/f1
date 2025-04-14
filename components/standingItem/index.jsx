"use client";

import { useState } from "react";

const StandingItem = ({ data, columns }) => {
  const [visibleCount, setVisibleCount] = useState(20);

  const gridTemplate = columns.map((col) => col.width || "auto").join(" ");

  const getRowStyle = (index) => {
    let base = "py-3 px-4 border-b border-gray-500 items-center grid";
    if (index === 0) return `${base} bg-yellow-500 text-gray-900 font-bold`;
    if (index === 1) return `${base} bg-gray-400 text-gray-900 font-bold`;
    if (index === 2) return `${base} bg-orange-500 text-gray-900 font-bold`;
    if (index >= 3 && index <= 9) {
      return `${base} bg-gradient-to-b from-gray-800 to-gray-600 text-white`;
    }
    if (index >= 10 && index <= 19) {
      return `${base} bg-gradient-to-b from-gray-800 to-gray-600 text-white`;
    }
    return `${base} bg-gradient-to-b from-gray-800 to-gray-600 text-white`;
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, data.length));
  };

  const handleShowAll = () => {
    setVisibleCount(data.length);
  };

  const handleShowLess = () => {
    setVisibleCount(20);
  };

  const visibleData = data.slice(0, visibleCount);

  return (
    <div className="flex flex-col">
      {visibleData.map((entry, index) => (
        <div
          key={index}
          className={`${getRowStyle(index)} ${
            index === visibleData.length - 1 ? "rounded-b-2xl" : ""
          }`}
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((col, i) => (
            <span
              key={i}
              className={`${
                col.align === "center"
                  ? "text-center"
                  : col.align === "right"
                  ? "text-right"
                  : "text-left"
              } ${col.bold ? "font-bold" : ""} ${
                col.color === "red" ? "text-red-500" : ""
              } ${col.textSize || ""}`}
            >
              {entry[col.key]}
            </span>
          ))}
        </div>
      ))}

      {data.length > 20 && (
        <div className="flex justify-center gap-4 mt-6 pb-6">
          {visibleCount < data.length && (
            <button
              onClick={handleShowMore}
              className="self-center bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Show +10
            </button>
          )}
          <button
            onClick={() =>
              visibleData.length === data.length
                ? handleShowLess()
                : handleShowAll()
            }
            className="self-center bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition cursor-pointer"
          >
            {visibleData.length === data.length ? "Show Less" : "Show All"}
          </button>
        </div>
      )}
    </div>
  );
};

export default StandingItem;
