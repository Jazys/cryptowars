import React from "react";

interface PawnProps {
  x: number; // Position en X
  y: number; // Position en Y
}

export default function Pawn({ x, y }: PawnProps) {
  return (
    <div
      className="absolute w-10 h-10 bg-red-500 rounded-full border-4 border-white shadow-lg"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
