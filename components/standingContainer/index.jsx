const StandingContainer = ({
  children,
  title,
  width = "w-full",
  maxWidth = "max-w-md",
  visible = true,
}) => {
  return (
    <div
      className={`${width} ${maxWidth} ${
        !visible && "hidden"
      } h-fit mx-auto bg-gradient-to-b from-gray-900 to-gray-800 pt-6 rounded-2xl shadow-lg md:flex md:flex-col`}
    >
      <h2 className="text-white text-2xl text-center font-bold mb-5">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default StandingContainer;
