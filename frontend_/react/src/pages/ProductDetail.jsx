import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllEventsByProductId } from "../utils/rpcClient";
import MainLayout from "../components/MainLayout";
import MapView from "../components/MapView";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ProductDetail() {
  const { id } = useParams(); // Esperamos "PROD-1"
  const realId = id?.split("-")[1]; // Extrae el número: "1"
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!realId) return;
    getAllEventsByProductId(realId).then(setEvents);
  }, [realId]);

  const calcAvg = (key) => {
    const total = events.reduce((acc, e) => acc + (e[key] || 0), 0);
    return events.length ? (total / events.length).toFixed(2) : "–";
  };

  return (
    <MainLayout activeTab="traceability" setActiveTab={() => {}}>
      <h1 className="text-2xl font-bold text-white mb-4">Detalle de Producto: {id}</h1>

      {/* Panel de estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatBox title="Velocidad media" value={`${calcAvg("speed")} km/h`} />
        <StatBox title="Altitud media" value={`${calcAvg("altitude")} m`} />
        <StatBox title="Satélites promedio" value={`${calcAvg("satellites")}`} />
        <StatBox title="Puntos registrados" value={events.length} />
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MetricChart data={events} dataKey="speed" label="Velocidad (km/h)" color="#3b82f6" />
        <MetricChart data={events} dataKey="altitude" label="Altitud (m)" color="#f59e0b" />
        <MetricChart data={events} dataKey="satellites" label="Satélites" color="#10b981" />
        <MetricChart data={events} dataKey="latitude" label="Latitud" color="#9333ea" />
      </div>

      {/* Mapa */}
      <div className="h-[400px] w-full mb-8">
        <MapView events={events} />
      </div>

      {/* Timeline de eventos */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Historial de ubicaciones</h2>
        <ul className="space-y-4">
          {events.map((e, i) => (
            <li key={i} className="border-l-4 border-blue-500 pl-4 relative">
              <div className="text-white font-mono text-sm">
                <span className="font-semibold text-blue-400">Punto #{i + 1}</span> —{" "}
                Lat: {e.latitude}, Lng: {e.longitude}
              </div>
              <div className="text-gray-400 text-sm">
                Alt: {e.altitude} m • Vel: {e.speed} km/h • Sats: {e.satellites}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  );
}

function StatBox({ title, value }) {
  return (
    <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg text-center">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-xl text-white font-bold">{value}</p>
    </div>
  );
}

function MetricChart({ data, dataKey, label, color }) {
  return (
    <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg">
      <p className="text-white font-semibold mb-2">{label}</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
          <XAxis dataKey={(d, i) => i + 1} tick={{ fill: "#ccc", fontSize: 12 }} />
          <YAxis tick={{ fill: "#ccc", fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: "#161b22", borderColor: "#30363d", color: "white" }}
          />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
