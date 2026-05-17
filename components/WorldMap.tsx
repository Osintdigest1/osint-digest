"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { useEffect } from "react";

import { useMapStore } from "../store/mapStore";

type EventType = {
  id: number;
  title: string;
  region: string;
  lat: number;
  lng: number;
  color: string;
  severity: string;
};

type Props = {
  events: EventType[];
};

function FlyToLocation() {
  const map = useMap();

  const selectedPosition =
    useMapStore(
      (state) =>
        state.selectedPosition
    );

  useEffect(() => {
    if (!selectedPosition)
      return;

    map.flyTo(
      selectedPosition,
      5,
      {
        duration: 2,
      }
    );
  }, [
    selectedPosition,
    map,
  ]);

  return null;
}

export default function WorldMap({
  events,
}: Props) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{
        height: "700px",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <FlyToLocation />

      {events.map((event) => {
        const markerColor =
          event.severity ===
          "high"
            ? "red"
            : event.severity ===
              "medium"
            ? "orange"
            : "yellow";

        const radius =
          event.severity ===
          "high"
            ? 18
            : event.severity ===
              "medium"
            ? 14
            : 10;

        const threatRadius =
          event.severity ===
          "high"
            ? 300000
            : event.severity ===
              "medium"
            ? 180000
            : 100000;

        return (
          <div key={event.id}>
            {/* THREAT RING */}
            <Circle
              center={[
                event.lat,
                event.lng,
              ]}
              radius={
                threatRadius
              }
              pathOptions={{
                color:
                  markerColor,
                fillColor:
                  markerColor,
                fillOpacity: 0.08,
              }}
            />

            {/* MAIN MARKER */}
            <CircleMarker
              center={[
                event.lat,
                event.lng,
              ]}
              radius={radius}
              pathOptions={{
                color:
                  markerColor,
                fillColor:
                  markerColor,
                fillOpacity: 1,
                weight: 3,
              }}
            >
              <Popup>
                <div>
                  <h2>
                    {
                      event.title
                    }
                  </h2>

                  <p>
                    Region:
                    {
                      event.region
                    }
                  </p>

                  <p>
                    Severity:
                    {
                      event.severity
                    }
                  </p>

                  <p>
                    Coordinates:
                    {event.lat}
                    ,{" "}
                    {event.lng}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          </div>
        );
      })}
    </MapContainer>
  );
}