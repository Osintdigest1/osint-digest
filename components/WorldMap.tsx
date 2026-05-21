"use client";

import { useEffect, useMemo, useState } from "react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

type EventType = {
  id: number;
  title: string;
  region: string;
  category: string;
  severity: string;
  lat: number;
  lng: number;
  status: string;
};

function FocusMap({
  selectedEvent,
}: {
  selectedEvent: EventType | null;
}) {

  const map = useMap();

  useEffect(() => {

    if (!selectedEvent) return;

    map.flyTo(
      [selectedEvent.lat, selectedEvent.lng],
      5,
      {
        duration: 2,
      }
    );

  }, [selectedEvent, map]);

  return null;
}

export default function WorldMap({
  events,
  selectedEvent,
}: {
  events: EventType[];
  selectedEvent: EventType | null;
}) {

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mapCenter = useMemo(
    () => [20, 78] as [number, number],
    []
  );

  if (!mounted) {
    return (
      <div
        style={{
          width: "100%",
          height: "700px",
          background: "#020617",
          border: "1px solid #0ea5e9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#38bdf8",
          fontSize: "18px",
        }}
      >
        INITIALIZING TACTICAL MAP...
      </div>
    );
  }

  return (

    <div
      style={{
        width: "100%",
        height: "700px",
        overflow: "hidden",
        border: "1px solid #0ea5e9",
        background: "#020617",
      }}
    >

      <MapContainer
        center={mapCenter}
        zoom={3}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "700px",
        }}
      >

        <TileLayer
          attribution="OSINT.DIGEST"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <FocusMap
          selectedEvent={selectedEvent}
        />

        {events.map((event) => (

          <CircleMarker
            key={event.id}
            center={[
              event.lat,
              event.lng,
            ]}

            radius={
              event.severity === "high"
                ? 18
                : 12
            }

            pathOptions={{
              color:
                event.severity === "high"
                  ? "#ef4444"
                  : "#38bdf8",

              fillColor:
                event.severity === "high"
                  ? "#ef4444"
                  : "#38bdf8",

              fillOpacity: 0.7,
            }}
          >

            <Popup>

              <div
                style={{
                  minWidth: "180px",
                  color: "#000",
                }}
              >

                <strong>
                  {event.title}
                </strong>

                <br />

                REGION:
                {" "}
                {event.region}

                <br />

                CATEGORY:
                {" "}
                {event.category}

                <br />

                SEVERITY:
                {" "}
                {event.severity}

                <br />

                STATUS:
                {" "}
                {event.status}

              </div>

            </Popup>

          </CircleMarker>

        ))}

      </MapContainer>

    </div>
  );
}