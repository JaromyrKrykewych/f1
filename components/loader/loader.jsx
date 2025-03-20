"use client";

import { FaFlagCheckered } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";

export default function F1Loading() {
  return (
    <div className="relative w-[80%] m-auto h-32 overflow-hidden bg-gray-900 flex items-center">
      {/* Línea de pista */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-500"></div>

      {/* Auto en movimiento */}
      <motion.div
        className="absolute text-red-500 text-5xl"
        initial={{ x: "-10vw" }}
        animate={{
          x: "100vw",
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        <Image src="/images/car.png" alt="Car" width={50} height={50} />
      </motion.div>

      {/* Bandera de meta */}
      <FaFlagCheckered className="absolute right-5 text-white text-3xl" />
    </div>
  );
}
