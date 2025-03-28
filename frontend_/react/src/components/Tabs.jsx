// components/Tabs.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Tabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      label: "Trazabilidad",
      path: "/",
      icon: (
        <span className="group-hover:rotate-[25deg] group-hover:scale-130 transition-transform duration-500 ease-out">
          📍
        </span>
      ),
    },
    {
      label: "Blocks",
      path: "/blocks",
      icon: (
        <span className="group-hover:rotate-[25deg] group-hover:scale-130 transition-transform duration-500 ease-out">
          🧱
        </span>
      ),
    },
    {
      label: "TXs",
      path: "/transactions",
      icon: (
        <span className="text-green-400 group-hover:rotate-[25deg] group-hover:scale-130 transition-transform duration-500 ease-out">
          💱
        </span>
      ),
    },
  ];

  return (
    <div className="flex justify-center space-x-4">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-[#30363d] transition-all duration-200 transform ${
              isActive
                ? "bg-blue-500 text-green-900"
                : "bg-[#161b22] text-gray-500 hover:text-black"
            }`}
          >
            <span
              className={`inline-block transform transition-transform duration-500 ease-out group-hover:scale-110 ${
                isActive ? "rotate-[25deg] scale-125" : ""
              }`}
            >
              {tab.icon}
            </span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
