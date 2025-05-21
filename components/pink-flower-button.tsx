"use client"
import Image from "next/image"

export function PinkFlowerButton({ onClick, className = "" }: { onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`group bg-transparent border-none p-0 m-0 outline-none focus:ring-2 focus:ring-pink-400 transition-transform hover:scale-110 active:scale-95 ${className}`}
      style={{ background: "none", position: "relative", width: 56, height: 56, cursor: "pointer" }}
      aria-label="Connexion admin"
    >
      <Image src="/fleur-rose.svg" alt="Connexion admin" width={56} height={56} />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-pink-700 opacity-0 group-hover:opacity-100 transition-opacity">Admin</span>
    </button>
  )
}
