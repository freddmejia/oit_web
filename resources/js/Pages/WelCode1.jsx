import React, { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const CPRGauge = ({ value, maxValue }) => {
  // 📌 Asegurar que el valor se normaliza entre 0-100
  const normalizedValue = Math.max(0, Math.min((value / maxValue) * 100, 100));

  // 📌 Datos para la barra azul dinámica
  const data = [{ name: "Force", value: normalizedValue, fill: "#4F46E5" }];

  return (
    <div className="relative flex flex-col items-center">
      <ResponsiveContainer width={300} height={180}>
        <RadialBarChart
          cx="50%" cy="70%"
          innerRadius="80%" // 🔹 Ajustar para una mejor visualización
          outerRadius="100%"
          startAngle={180} endAngle={0}
          barSize={20}
          data={data}
        >
          {/* 🔹 Barra azul dinámica */}
          <RadialBar dataKey="value" data={data} fill="#4F46E5" cornerRadius={20} />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* 🔹 Valor numérico centrado en la barra */}
      <p className="absolute bottom-6 text-3xl font-bold text-black">{value} N</p>
    </div>
  );
};

const Welcome = () => {
  const [forceN, setForceN] = useState(250);

  useEffect(() => {
    const interval = setInterval(() => {
      const newForceN = Math.floor(Math.random() * 800); // Simulación entre 0 y 800 N
      setForceN(newForceN);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold mb-6 ">Real-Time CPR Monitoring</h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* 📌 Gauge de Fuerza */}
        <CPRGauge value={forceN} maxValue={800} />
      </div>
    </div>
  );
};

export default Welcome;
