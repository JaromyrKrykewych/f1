const StandingHeading = ({ columns }) => {
  const gridTemplate = columns.map((col) => col.width || "auto").join(" ");

  return (
    <div
      className="grid bg-gray-700 text-white font-bold py-3 px-4 "
      style={{ gridTemplateColumns: gridTemplate }}
    >
      {columns.map((col, index) => (
        <span
          key={index}
          className={
            col.align === "center"
              ? "text-center"
              : col.align === "right"
              ? "text-right"
              : "text-left"
          }
        >
          {col.title}
        </span>
      ))}
    </div>
  );
};

export default StandingHeading;
