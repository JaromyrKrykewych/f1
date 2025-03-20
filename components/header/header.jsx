"use client";

import { Menu, X } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo y Marca */}
        <div className="flex items-center gap-3">
          <div className="w-[80px] md:w-[100px] h-[60px]"></div>
          <Link
            href="/"
            className="absolute w-20 h-20 md:w-[100px] md:h-[100px]"
          >
            <Image src={"/images/f1.png"} alt="f1" fill priority />
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Formula 1</h1>
            <p className="text-xs md:text-sm text-gray-400">
              This is not an official formula 1 website
            </p>
          </div>
        </div>

        {/* Menú Desktop */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link href="/tracks" className="hover:text-red-500 transition">
              Tracks
            </Link>
          </li>
          <li>
            <Link href="/standings" className="hover:text-red-500 transition">
              Standings
            </Link>
          </li>
        </ul>

        {/* Menú Móvil */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú Móvil desplegable */}
      {isOpen && (
        <ul className="md:hidden mt-2 space-y-2 bg-gray-800 p-4 rounded-lg">
          <li onClick={() => setIsOpen(false)}>
            <Link href="/tracks" className="hover:text-red-500 transition">
              Tracks
            </Link>
          </li>
          <li onClick={() => setIsOpen(false)}>
            <Link href="/standings" className="hover:text-red-500 transition">
              Standings
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
