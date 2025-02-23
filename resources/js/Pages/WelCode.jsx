import React, { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, LabelList, LineChart, Label, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import HelpDashboardModal from "../Components/modals/HelpDashboardModal";

import MqttService from "../Components/server/data/mqtt/MqttService";

const CPRGauge = ({ value, maxValue, color, measure }) => {
    const data = [
        { name: "Background", value: maxValue, fill: "#F2F2F2", measure: measure },
        { name: "Actual", value: value, fill: color, measure: measure },
      ];
  
    return (
      <div className="relative flex flex-col items-center">

        <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
                cx={"50%"} cy={"55%"}
                innerRadius="80%" outerRadius="150%"
                startAngle={180} endAngle={0}
                barSize={50} data={data}
                >
                <RadialBar dataKey="value" data={[data[1]]} background fill="#F2F2F2" cornerRadius={5} />
                <RadialBar hide dataKey="value" data={[data[0]]} cornerRadius={5} />
            </RadialBarChart>
        </ResponsiveContainer>

        <p className="absolute top-20 text-2xl font-semibold">{value} {measure}</p>

      </div>
    );
  };
  
const Welcome = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [forceKg, setForceKg] = useState(40);
    const [forceN, setForceN] = useState(200);
    const [data, setData] = useState([]);
    const [statusSensor, setStatusSensor] = useState("Offline");
    const [forceValue, setForceValue] = useState("-1");
    const [weightValue, setWeightValue] = useState("-1");
    const [timeValue, setTimeValue] = useState(new Date().toLocaleTimeString());
    const [weightList, setWeightList] = useState([
        
    ]); 

    const [selectedGroup, setSelectedGroup] = useState("Babies");
    const maxValues = {
        Babies: { kg: 5, N: 50 },
        Kids: { kg: 20, N: 200 },
        Adults: { kg: 60, N: 600 },
    };

    useEffect(() => {
        if (forceValue != -1 && weightValue != -1) {
            setTimeValue(timeValue);
            setForceKg(weightValue);
            setForceN(forceValue);
            setStatusSensor("Online");

            const newEntry = {
                time: new Date(timeValue).toLocaleTimeString(),
                strength: forceValue, 
            };
            console.log("New entry: " + newEntry.time + " " + newEntry.strength);
            setWeightList((prevList) => {
                const updatedList = [...prevList, newEntry]; 
                return updatedList.slice(-10);
            });
        }
        else {
            setTimeValue(new Date().toLocaleTimeString())
            setForceKg(0);
            setForceN(0);
            setStatusSensor("Offline");
            setWeightList([]);
        }
    }, [forceValue, weightValue, timeValue]);


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Real-Time CPR Monitoring</h1>
            </div>

            <div className="p-6 sm:p-8 bg-white rounded-lg shadow-lg w-full max-w-6xl">
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
                            <option>Kids</option>
                            <option>Adults</option>
                        </select>
                        <HelpDashboardModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 pb-6">
                    <div className="bg-white p-6 rounded-lg text-center border border-[#879487] drop-shadow-lg min-h-[150px] flex flex-col justify-center">
                        <p className="text-gray-600 font-nunito text-base">Force (Kg)</p>
                        <CPRGauge value={forceKg} maxValue={maxValues[selectedGroup].kg} color="#58CB9D" measure={"Kg"} />
                    </div>

                    <div className="bg-white p-6 rounded-lg text-center border border-[#879487] drop-shadow-lg min-h-[150px] flex flex-col justify-center">
                        <p className="text-gray-600 font-nunito text-base">Strength (Newtons - N)</p>
                        <CPRGauge value={forceN} maxValue={maxValues[selectedGroup].N} color="#585ACB" measure={"N"} />
                    </div>

                    
                </div>

                <div className="bg-white p-6 rounded-lg text-center border border-[#879487] drop-shadow-lg min-h-[150px] flex flex-col justify-center">
                    <p className="text-gray-600 font-nunito text-base">Variation</p>

                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={weightList}>
                            <XAxis dataKey="time" >
                                <Label 
                                    value="Time (hh:mm:ss)" 
                                    offset={-5} 
                                    position="insideBottom" 
                                    style={{ fill: "#666", fontSize: "14px" }} 
                                />
                            </XAxis>
                            <YAxis domain={[0, maxValues[selectedGroup].N]} >
                                <Label 
                                    value="Strength (N)" 
                                    angle={-90} 
                                    position="insideLeft" 
                                    style={{ fill: "#666", fontSize: "14px" }} 
                                />
                            </YAxis>
                            <Tooltip
                                wrapperStyle={{ backgroundColor: "#fff", borderRadius: "8px", padding: "6px", border: "1px solid #ddd" }}
                                cursor={{ strokeDasharray: "3 3" }} 
                                formatter={(value, name) => [`${value} N`, "Strength"]}
                                labelFormatter={(label) => `Time: ${label}`}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="strength" 
                                stroke="#8884d8" 
                                strokeWidth={4} 
                                dot={{ r: 6, strokeWidth: 2 }}
                                activeDot={{ r: 8 }}
                                isAnimationActive={false}
                                animationDuration={500}
                                >
                                <LabelList dataKey="strength" position="bottom" style={{ fill: "#444", fontSize: "16px", fontWeight: "bold" }} />

                            </Line>
                        </LineChart>
                    </ResponsiveContainer>

                </div>

            </div>
            {/*<p className="text-lg text-blue-600">Live MQTT Data: {forceValue}</p>*/}

            <MqttService setForceValue={setForceValue} 
                setWeightValue={setWeightValue} 
                setTimeValue={setTimeValue}  />

        </div>
    );
};

export default Welcome;
