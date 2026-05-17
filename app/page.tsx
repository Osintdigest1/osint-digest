"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

import { useMapStore } from "../store/mapStore";

import { supabase } from "../lib/supabase";

const WorldMap = dynamic(
  () => import("../components/WorldMap"),
  {
    ssr: false,
  }
);

type EventType = {
  id: number;
  title: string;
  region: string;
  lat: number;
  lng: number;
  color: string;
  severity: string;
  created_at: string;
};

export default function Home() {
  const [events, setEvents] = useState<EventType[]>([]);

  const [utcTime, setUtcTime] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [region, setRegion] =
    useState("");

  const [lat, setLat] =
    useState("");

  const [lng, setLng] =
    useState("");

  const [severity, setSeverity] =
    useState("medium");

  const setSelectedPosition =
    useMapStore(
      (state) => state.setSelectedPosition
    );

  useEffect(() => {
    fetchEvents();

    updateClock();

    const clockInterval =
      setInterval(() => {
        updateClock();
      }, 1000);

    const channel =
      supabase
        .channel("events-channel")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "events",
          },
          (payload) => {
            setEvents((prev) => [
              payload.new as EventType,
              ...prev,
            ]);
          }
        )
        .subscribe();

    return () => {
      clearInterval(clockInterval);

      supabase.removeChannel(
        channel
      );
    };
  }, []);

  async function fetchEvents() {
    const { data } =
      await supabase
        .from("events")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (data) {
      setEvents(data);
    }
  }

  async function createEvent() {
    if (
      !title ||
      !region ||
      !lat ||
      !lng
    ) {
      alert(
        "Please fill all fields"
      );

      return;
    }

    let color = "orange";

    if (severity === "high") {
      color = "red";
    }

    if (severity === "low") {
      color = "yellow";
    }

    const { error } =
      await supabase
        .from("events")
        .insert([
          {
            title,
            region,
            lat: Number(lat),
            lng: Number(lng),
            severity,
            color,
          },
        ]);

    if (error) {
      console.log(error);

      alert(
        "Failed to create event"
      );
    } else {
      setTitle("");
      setRegion("");
      setLat("");
      setLng("");

      alert(
        "Event Added Successfully"
      );
    }
  }

  function updateClock() {
    const now = new Date();

    setUtcTime(
      now.toUTCString()
    );
  }

  const filteredEvents =
    events.filter((event) => {
      const matchesSeverity =
        filter === "all"
          ? true
          : event.severity ===
            filter;

      const matchesSearch =
        event.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        event.region
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      return (
        matchesSeverity &&
        matchesSearch
      );
    });

  const highThreats =
    events.filter(
      (e) =>
        e.severity === "high"
    ).length;

  const mediumThreats =
    events.filter(
      (e) =>
        e.severity === "medium"
    ).length;

  const lowThreats =
    events.filter(
      (e) =>
        e.severity === "low"
    ).length;

  return (
    <main
      style={{
        background: "black",
        color: "red",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* TOP */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          GLOBAL THREAT MONITOR
        </div>

        <div>
          UTC: {utcTime}
        </div>
      </div>

      {/* TICKER */}
      <div
        style={{
          background: "#111",
          border: "1px solid red",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        <marquee scrollamount={8}>
          🔴 LIVE OSINT MONITORING ACTIVE
          | 🔴 UKRAINE | 🔴 KASHMIR |
          🔴 SOUTH CHINA SEA |
          🔴 GLOBAL ALERT STATUS ACTIVE
        </marquee>
      </div>

      {/* TITLE */}
      <h1
        style={{
          fontSize: "72px",
          marginBottom: "20px",
        }}
      >
        OSINT.DIGEST LIVE
      </h1>

      {/* STATS */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "#111",
            border:
              "1px solid red",
            padding: "15px",
            minWidth: "160px",
          }}
        >
          <h3>TOTAL EVENTS</h3>

          <h1>
            {events.length}
          </h1>
        </div>

        <div
          style={{
            background: "#111",
            border:
              "1px solid red",
            padding: "15px",
            minWidth: "160px",
          }}
        >
          <h3>HIGH THREATS</h3>

          <h1>{highThreats}</h1>
        </div>

        <div
          style={{
            background: "#111",
            border:
              "1px solid orange",
            padding: "15px",
            minWidth: "160px",
          }}
        >
          <h3>MEDIUM</h3>

          <h1>
            {mediumThreats}
          </h1>
        </div>

        <div
          style={{
            background: "#111",
            border:
              "1px solid yellow",
            padding: "15px",
            minWidth: "160px",
          }}
        >
          <h3>LOW</h3>

          <h1>{lowThreats}</h1>
        </div>
      </div>

      {/* ADMIN PANEL */}
      <div
        style={{
          border: "1px solid red",
          padding: "20px",
          marginBottom: "20px",
          background: "#111",
        }}
      >
        <h2
          style={{
            marginBottom: "15px",
          }}
        >
          ADMIN EVENT PANEL
        </h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />

          <input
            placeholder="Region"
            value={region}
            onChange={(e) =>
              setRegion(
                e.target.value
              )
            }
          />

          <input
            placeholder="Latitude"
            value={lat}
            onChange={(e) =>
              setLat(
                e.target.value
              )
            }
          />

          <input
            placeholder="Longitude"
            value={lng}
            onChange={(e) =>
              setLng(
                e.target.value
              )
            }
          />

          <select
            value={severity}
            onChange={(e) =>
              setSeverity(
                e.target.value
              )
            }
          >
            <option value="high">
              High
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="low">
              Low
            </option>
          </select>

          <button
            onClick={createEvent}
          >
            ADD EVENT
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search region, conflict, country..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "15px",
            background: "#111",
            border:
              "1px solid red",
            color: "red",
            fontSize: "16px",
            outline: "none",
          }}
        />
      </div>

      {/* FILTERS */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {[
          "all",
          "high",
          "medium",
          "low",
        ].map((level) => (
          <button
            key={level}
            onClick={() =>
              setFilter(level)
            }
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div
        style={{
          display: "flex",
          gap: "20px",
        }}
      >
        {/* SIDEBAR */}
        <div
          style={{
            width: "350px",
            border: "1px solid red",
            padding: "15px",
            height: "700px",
            overflowY: "auto",
            background: "#050505",
          }}
        >
          <h2>LIVE EVENTS</h2>

          {filteredEvents.map(
            (event) => (
              <div
                key={event.id}
                onClick={() =>
                  setSelectedPosition([
                    event.lat,
                    event.lng,
                  ])
                }
                style={{
                  border: `2px solid ${event.color}`,
                  marginBottom:
                    "15px",
                  padding: "10px",
                  background:
                    "#0a0a0a",
                  cursor:
                    "pointer",
                  position:
                    "relative",
                }}
              >
                <button
                  onClick={async (
                    e
                  ) => {
                    e.stopPropagation();

                    const confirmDelete =
                      confirm(
                        "Delete this event?"
                      );

                    if (
                      !confirmDelete
                    )
                      return;

                    await supabase
                      .from(
                        "events"
                      )
                      .delete()
                      .eq(
                        "id",
                        event.id
                      );

                    setEvents(
                      (
                        prev
                      ) =>
                        prev.filter(
                          (
                            item
                          ) =>
                            item.id !==
                            event.id
                        )
                    );
                  }}
                  style={{
                    position:
                      "absolute",
                    top: "10px",
                    right:
                      "10px",
                    background:
                      "red",
                    color:
                      "white",
                    border:
                      "none",
                    cursor:
                      "pointer",
                    padding:
                      "5px 8px",
                  }}
                >
                  X
                </button>

                <h3>
                  {event.title}
                </h3>

                <p>
                  {event.region}
                </p>

                <p>
                  Severity:
                  {event.severity}
                </p>

                <p
                  style={{
                    fontSize:
                      "12px",
                    opacity: 0.7,
                  }}
                >
                  {new Date(
                    event.created_at
                  ).toLocaleString()}
                </p>
              </div>
            )
          )}
        </div>

        {/* MAP */}
        <div
          style={{
            flex: 1,
          }}
        >
          <WorldMap
            events={
              filteredEvents
            }
          />
        </div>
      </div>
    </main>
  );
}