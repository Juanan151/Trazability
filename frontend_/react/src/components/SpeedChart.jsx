// components/SpeedChart.jsx
import React from "react";

export default function SpeedChart({ data }) {
  if (!data || data.length === 0)
    return <p className="text-gray-500">No hay datos de velocidad.</p>;

  const speeds = data.map((e) => e.speed);
  const maxSpeed = Math.max(...speeds);

  const points = speeds
    .map((speed, i) => {
      const x = (i / (speeds.length - 1)) * 100;
      const y = 100 - (speed / maxSpeed) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4">
      <h3 className="text-white text-md font-semibold mb-2">
        Velocidad (km/h)
      </h3>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-40 bg-[#161b22] rounded"
        preserveAspectRatio="none"
      >
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={points}
        />
        {speeds.map((speed, i) => {
          const x = (i / (speeds.length - 1)) * 100;
          const y = 100 - (speed / maxSpeed) * 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.8"
              fill="#3b82f6"
              className="transition-transform duration-200"
            />
          );
        })}
      </svg>
    </div>
  );
}
