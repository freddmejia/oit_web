import React, { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import HelpDashboardModal from "../Components/modals/HelpDashboardModal";
const CPRGauge = ({ value, maxValue, color, measure }) => {
    const data = [
        { name: "Background", value: maxValue, fill: "#F2F2F2", measure: measure },
        { name: "Actual", value: value, fill: color, measure: measure },
      ];
  
    return (
      <div className="relative flex flex-col items-center">


{/*<ResponsiveContainer width={200} height={200}>
        <RadialBarChart
          innerRadius="60%"  // 🔹 Define el hueco interno
          outerRadius="100%" // 🔹 Radio externo
          startAngle={180}   // 🔹 Empieza desde la izquierda
          endAngle={0}       // 🔹 Termina en la derecha (semicírculo)
          barSize={14}       // 🔹 Grosor de las barras
          data={data}
        >
          <RadialBar dataKey="value" data={[data[0]]} background fill="#E0E0E0" />

          <RadialBar dataKey="value" data={[data[1]]} />
        </RadialBarChart>
      </ResponsiveContainer>
*/}
        <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart
            innerRadius="80%" outerRadius="150%"
            startAngle={180} endAngle={0}
            barSize={100} data={data}
            >
            <RadialBar dataKey="value" data={[data[1]]} background fill="#F2F2F2" cornerRadius={5} />
            <RadialBar hide dataKey="value" data={[data[0]]} cornerRadius={5} />
            </RadialBarChart>
        </ResponsiveContainer>

        <p className="absolute top-24 text-2xl font-semibold">{value} {measure}</p>

      </div>
    );
  };
  
const Welcome = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [forceKg, setForceKg] = useState(40);
    const [forceN, setForceN] = useState(250);
    const [data, setData] = useState([]);
    const [statusSensor, setStatusSensor] = useState("Offline");

    const [selectedGroup, setSelectedGroup] = useState("Babies");
    const maxValues = {
        Babies: { kg: 5, N: 50 },
        Children: { kg: 20, N: 200 },
        Adults: { kg: 60, N: 600 },
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const newForce = Math.random() * 40 + 20;
            const newForceN = Math.round(newForce * 9.8);

            setForceKg(newForce.toFixed(1));
            setForceN(newForceN);
            setStatusSensor("Online");

            setData((prevData) => [
                ...prevData.slice(-10),
                { time: new Date().toLocaleTimeString(), force: newForce },
            ]);
            console.log("newForce " +newForceN + " forceKg " + newForce + " time " + new Date().toLocaleTimeString());
        }, 5000);

        return () => clearInterval(interval);
    }, []);


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Real-Time CPR Monitoring</h1>
            </div>

            <div className="p-6 sm:p-8 bg-white rounded-lg shadow-lg w-full max-w-5xl">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 border-b-2 border-[#212121] w-full sm:w-auto text-center sm:text-left">
                        CPR Monitoring Dashboard
                    </h2>
                    <span className={`text-sm font-medium mt-2 sm:mt-0 ${
                        statusSensor === "Online" ? "text-green-600" :
                        statusSensor === "Warning" ? "text-yellow-500" :
                        statusSensor === "Offline" ? "text-red-600" :
                        "text-gray-500"
                    }`}>
                        {statusSensor}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between w-full pb-6 space-y-4 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row items-center sm:space-x-4 w-full">
                        <label className="text-base font-semibold text-gray-800 border-b-2 border-[#212121] w-full sm:w-auto text-center sm:text-left">
                            Group people
                        </label>
                        <select
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto"
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                        >                            
                            <option>Babies</option>
                            <option>Children</option>
                            <option>Adults</option>
                        </select>
                        <HelpDashboardModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg text-center border border-[#879487] drop-shadow-lg min-h-[150px] flex flex-col justify-center">
                        <p className="text-gray-600 font-nunito text-base">Force (Kg)</p>
                        <CPRGauge value={forceKg} maxValue={maxValues[selectedGroup].kg} color="#58CB9D" measure={"Kg"} />
                    </div>

                    <div className="bg-white p-6 rounded-lg text-center border border-[#879487] drop-shadow-lg min-h-[150px] flex flex-col justify-center">
                        <p className="text-gray-600 font-nunito text-base">Strength (Newtons - N)</p>
                        <CPRGauge value={forceN} maxValue={maxValues[selectedGroup].N} color="#585ACB" measure={"N"} />
                    </div>

                    <div className="bg-white p-6 rounded-lg text-center border border-[#879487] drop-shadow-lg min-h-[150px] flex flex-col justify-center">
                        <p className="text-gray-600 font-nunito text-base">Variation</p>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={data}>
                                <XAxis dataKey="time" tickFormatter={(t) => `${t}s`} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="force" stroke="#8884d8" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
