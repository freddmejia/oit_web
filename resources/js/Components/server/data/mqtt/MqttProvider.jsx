import React, { createContext, useState, useEffect } from "react";
import mqtt from "mqtt";

export const MQTTContext = createContext();

export const MQTTProvider = ({ children }) => {
    const MQTT_HOST = "ws://54.234.43.77:8083/mqtt";
    const MQTT_PORT = 1883
    const MQTT_TOPIC = "test/topic"
    const MQTT_USER = "bos_us23"
    const MQTT_PASSWORD="rootpass798"


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
            console.log(`📩 Mensaje recibido: ${payload.toString()}`);
            setMqttData(payload.toString());
        });

        return () => client.end();
    }, []);

    return (
        <MQTTContext.Provider value={{ mqttData }}>
            {children}
        </MQTTContext.Provider>
    );
};
