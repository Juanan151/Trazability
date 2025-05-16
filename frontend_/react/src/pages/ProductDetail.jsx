// pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllEventsByProductId } from "../utils/rpcClient";
import MainLayout from "../components/MainLayout";
import MapView from "../components/MapView";
import {
  MapPin,
  Globe,
  Thermometer, Droplet, Activity, Clock4,
  Link as LinkIcon,
  ArrowLeft,
  Repeat
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = parseInt(id?.replace("PROD-", ""));
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!isNaN(numericId)) {
      getAllEventsByProductId(numericId).then(setEvents);
    }
  }, [numericId]);

  const metrics = {
  avgTemperature: average(events.map((e) => e.temperature)),
  avgHumidity: average(events.map((e) => e.humidity))
};
  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-white mb-6">
          Detalles del Producto
        </h1>
        <h2 className="text-3xl font-bold text-white">
          <span className="text-blue-400">PROD-{numericId}</span>
        </h2>
      </div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-100 text-black font-semibold px-4 py-1.5 rounded-md hover:bg-white transition"
        >
          <ArrowLeft size={16} className="inline mr-1" /> Volver
        </button>
      </div>

      {/* Layout principal */}
<div className="flex flex-col lg:flex-row gap-6 mb-6">
  {/* ──────────── COLUMNA IZQUIERDA ──────────── */}
  <div className="w-full lg:w-1/2 flex flex-col gap-6">
    {/* Mapa */}
    <div className="h-[400px] bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden">
      <MapView events={events} />
    </div>

    {/* Gráfica MOVIMIENTOS */}
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Evolución Movimientos
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={events.map((e, i) => ({ ...e, index: i + 1 }))}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis dataKey="index" stroke="#cbd5e0" />
          <YAxis stroke="#cbd5e0" />
          <Tooltip
            formatter={(v) => [`${v}`, "Movimientos acumulados"]}
            contentStyle={{ background: "#1a202c", border: "none" }}
          />
          <Line
            type="monotone"
            dataKey="motionCount"
            name="Movimientos"
            stroke="#facc15"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* ──────────── COLUMNA DERECHA ──────────── */}
  <div className="w-full lg:w-1/2 flex flex-col gap-6">
    {/* Métricas */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <MetricCard
        label="Temperatura media"
        value={`${metrics.avgTemperature.toFixed(1)} °C`}
      />
      <MetricCard
        label="Humedad media"
        value={`${metrics.avgHumidity.toFixed(1)} %`}
      />
    </div>

    {/* Gráfica TEMPERATURA */}
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Evolución Temperatura
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={events.map((e, i) => ({ ...e, index: i + 1 }))}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis dataKey="index" stroke="#cbd5e0" />
          <YAxis stroke="#cbd5e0" />
          <Tooltip
            formatter={(v) => [`${v} °C`, "Temperatura"]}
            contentStyle={{ background: "#1a202c", border: "none" }}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            name="Temp (°C)"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Gráfica HUMEDAD */}
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Evolución Humedad
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={events.map((e, i) => ({ ...e, index: i + 1 }))}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis dataKey="index" stroke="#cbd5e0" />
          <YAxis stroke="#cbd5e0" />
          <Tooltip
            formatter={(v) => [`${v} %`, "Humedad"]}
            contentStyle={{ background: "#1a202c", border: "none" }}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            name="Hum (%)"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

      {/* Lista de eventos */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Eventos GPS registrados
        </h2>

        <div className="space-y-4">
          {events.map((e, i) => (
            <div
              key={i}
              className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 text-white shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
                  <MapPin size={20} />
                  Punto {i + 1}
                </div>
                {i === events.length - 1 && (
                  <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                    Último
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-teal-400" />
                  <span>
                    {e.latitude.toFixed(4)}, {e.longitude.toFixed(4)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Thermometer size={14} className="text-rose-300" />
                  <span>Temp: {e.temperature} °C</span>
                </div>

                <div className="flex items-center gap-2">
                  <Droplet size={14} className="text-sky-300" />
                  <span>Hum: {e.humidity} %</span>
                </div>

                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-amber-300" />
                  <span>Mov: {e.motionCount}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm text-blue-400 hover:underline">
                <Repeat size={14} />
                <a href={`/tx/${e.txHash}`} className="truncate">
                  {e.txHash}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-center">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-xl font-semibold text-white mt-1">{value}</p>
    </div>
  );
}

function average(arr) {
  if (!arr.length) return 0;
  const sum = arr.reduce((acc, n) => acc + n, 0);
  return sum / arr.length;
}
