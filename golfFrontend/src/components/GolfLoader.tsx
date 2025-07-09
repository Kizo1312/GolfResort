import React, { useState, useEffect } from "react";

const TOTAL_FRAMES = 16;
const FRAME_RATE = 65; // ms between frames

export default function GolfLoader() {
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev % TOTAL_FRAMES) + 1);
    }, FRAME_RATE);

    return () => clearInterval(interval);
  }, []);

  const imagePath = `/animation/golf${frame}.png`;

  return (
    <div className="w-64 h-64 flex-col items-center justify-center">
      <img
        src={imagePath}
        alt={`Golf animation frame ${frame}`}
        className="w-full h-auto"
      />
        <p className="mt-4 text-center text-gray-700 font-medium">
        Vaša rezervacija je u tijeku, molimo pričekajte...
        </p>
    </div>
  );
}