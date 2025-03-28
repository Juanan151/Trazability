// pages/TransactionDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ClipboardCopy,
  Check,
  ArrowLeft,
  DollarSign,
  Cpu,
  Info,
  ArrowDownRight,
  ArrowUpRight,
  Layers,
  Flame,
} from "lucide-react";
import { getTransactionByHash } from "../utils/rpcClient";
import MainLayout from "../components/MainLayout";

export default function TransactionDetail() {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("transactions");

  useEffect(() => {
    getTransactionByHash(hash).then((res) => {
      setTx(res);
      console.log(res);
      setLoading(false);
    });
  }, [hash]);

  const handleCopy = () => {
    if (!tx?.hash) return;
    navigator.clipboard.writeText(tx.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) {
    return (
      <MainLayout activeTab="transactions" setActiveTab={() => {}}>
        <p className="text-center text-gray-400 mt-20">
          Cargando transacción real desde RPC...
        </p>
      </MainLayout>
    );
  }

  if (!tx) {
    return (
      <MainLayout activeTab="transactions" setActiveTab={() => {}}>
        <p className="text-center text-red-400 mt-20">
          Transacción no encontrada.
        </p>
      </MainLayout>
    );
  }

  // Conversión segura de campos hexadecimales
  const hexToInt = (hex) => parseInt(hex || "0x0", 16);
  const formatWei = (wei) => `${hexToInt(wei)} wei`;

  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Layers size={26} className="text-blue-400" />
          Transacción
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-100 text-black font-semibold px-4 py-1.5 rounded-md hover:bg-white transition"
        >
          <ArrowLeft size={16} className="inline mr-1" /> Volver
        </button>
      </div>

      {/* Hash principal */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-6">
        <div>
          <p className="text-sm text-gray-400">Hash</p>
          <p className="font-mono truncate text-white">{tx.hash}</p>
          <p className="text-green-400 text-sm mt-1">Sucess</p>
        </div>
        <button
          onClick={handleCopy}
          className="bg-gray-100 text-black p-2 rounded-md hover:bg-white transition"
        >
          {copied ? <Check size={18} /> : <ClipboardCopy size={18} />}
        </button>
      </div>

      {/* Info general */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Card
          icon={<Layers size={18} />}
          label="Bloque"
          value={parseInt(tx.blockNumber, 16)}
        />
        <Card
          icon={<Flame size={18} />}
          label="Gas usado"
          value={parseInt(tx.gas, 16)}
        />
        <Card
          icon={<Cpu size={18} />}
          label="Nonce"
          value={parseInt(tx.nonce, 16)}
        />
        <Card
          icon={<Info size={18} />}
          label="Llamada a contrato"
          value={tx.input && tx.input !== "0x" ? "Sí" : "No"}
        />
        <Card
          icon={<DollarSign size={18} />}
          label="Valor"
          value={
            <div className="flex items-center gap-2">
              <span>{parseInt(tx.value, 16)} wei</span>
              <span className="text-gray-400 text-sm">
                ({(parseInt(tx.value, 16) / 1e18).toFixed(6)} ETH)
              </span>
            </div>
          }
        />

        <Card
          icon={<DollarSign size={18} />}
          label="Gas Price"
          value={
            <div className="flex items-center gap-2">
              <span>{parseInt(tx.gasPrice, 16)} wei</span>
              <span className="text-gray-400 text-sm">
                ({(parseInt(tx.gasPrice, 16) / 1e9).toFixed(2)} Gwei)
              </span>
            </div>
          }
        />
      </div>

      {/* Desde / Hacia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card
          icon={<ArrowUpRight size={18} />}
          label="Desde"
          value={<code>{tx.from}</code>}
        />
        <Card
          icon={<ArrowDownRight size={18} />}
          label="Hacia"
          value={<code>{tx.to || "—"}</code>}
        />
      </div>
    </MainLayout>
  );
}

function Card({ icon, label, value }) {
  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1 text-gray-400 text-sm">
        {icon} {label}
      </div>
      <div className="text-white font-mono text-sm break-words">{value}</div>
    </div>
  );
}
