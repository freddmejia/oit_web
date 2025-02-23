import React, { useEffect } from "react";
import mqtt from "mqtt";

const MQTTComponent = ({ setForceValue, setWeightValue, setTimeValue }) => {
    const MQTT_HOST = "ws://54.234.43.77:8083/mqtt";
    const MQTT_TOPIC = "test/topic"
    const MQTT_USER = "bos_us23"
    const MQTT_PASSWORD="rootpass798"

    const timeoutDuration = 3000;
    let timeoutRef = null;

    const connectionParams = {
        username: MQTT_USER,
        password: MQTT_PASSWORD,
        clientId: `mqtt_client_${Math.random().toString(16).substr(2, 8)}`,
        keepalive: 60,
        clean: true,
        reconnectPeriod: 1000,
    };

    useEffect(() => {
        const client = mqtt.connect(MQTT_HOST, connectionParams);

        client.on("connect", () => {
            console.log("Connected");
            client.subscribe(MQTT_TOPIC, (err) => {
                if (!err) {
                    console.log(`Subscribe: ${MQTT_TOPIC}`);
                }
                else {
                    console.error("Error to subscribe:", err);
                }
            });
        });

        client.on("message", (topic, payload) => {
            try {
                const data = JSON.parse(payload.toString());
                const force = data.fuerza?.valor ?? "N/A";  
                const weight = data.peso?.valor ?? "N/A";   
                const time = data.tiempo ?? "N/A";  

                setForceValue(force);
                setWeightValue(weight);
                setTimeValue(time);
                
                console.log("Data force: "+ force + " weight: " + weight + " time: " + time);

                if (timeoutRef) clearTimeout(timeoutRef);
                timeoutRef = setTimeout(() => {
                    setForceValue(-1);
                    setWeightValue(-1);
                    setTimeValue(-1);
                }, timeoutDuration);

            } catch (error) {
                setForceValue(-1);
                setWeightValue(-1);
                setTimeValue(-1);
            }

        });

        return () => client.end();
    }, [setForceValue, setWeightValue, setTimeValue]);

    return null;
};

export default MQTTComponent;
