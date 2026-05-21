"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

import AdminPanel from "@/components/AdminPanel";

const WorldMap = dynamic(
  () => import("@/components/WorldMap"),
  {
    ssr: false,
  }
);

export default function Home() {

  const [events, setEvents] =
    useState<any[]>([]);

  const [selectedEvent, setSelectedEvent] =
    useState<any>(null);

  const [search, setSearch] =
    useState("");

  const [severityFilter, setSeverityFilter] =
    useState("ALL");

  const [utcTime, setUtcTime] =
    useState("");

  const [istTime, setIstTime] =
    useState("");

  useEffect(() => {

    const updateClock = () => {

      const now = new Date();

      setUtcTime(
        now.toUTCString()
      );

      setIstTime(
        now.toLocaleString(
          "en-IN",
          {
            timeZone:
              "Asia/Kolkata",
          }
        )
      );
    };

    updateClock();

    const interval =
      setInterval(
        updateClock,
        1000
      );

    return () =>
      clearInterval(interval);

  }, []);

  useEffect(() => {

    async function loadEvents() {

      try {

        const response =
          await fetch("/api/events");

        const data =
          await response.json();

        setEvents(data);

      } catch (error) {

        console.log(error);

      }
    }

    loadEvents();

  }, []);

  function handleAddEvent(
    newEvent: any
  ) {

    setEvents((prev) => [
      newEvent,
      ...prev,
    ]);
  }

  const filteredEvents =
    events.filter((event) => {

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

      const matchesSeverity =
        severityFilter === "ALL"
          ? true
          : event.severity ===
            severityFilter;

      return (
        matchesSearch &&
        matchesSeverity
      );
    });

  const highThreats =
    events.filter(
      (e) =>
        e.severity === "high"
    ).length;

  const navalAssets =
    events.filter(
      (e) =>
        e.category === "Naval"
    ).length;

  return (

    <main
      style={{
        background: "#020617",
        minHeight: "100vh",
        padding: "24px",
        color: "#dbeafe",
        fontFamily:
          "Arial, sans-serif",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >

        <div
          style={{
            color: "#38bdf8",
            fontSize: "18px",
            marginBottom: "10px",
          }}
        >
          GLOBAL THREAT
          INTELLIGENCE
          PLATFORM
        </div>

        <h1
          style={{
            color: "#7dd3fc",
            fontSize: "82px",
            fontWeight: "bold",
            marginBottom: "25px",
          }}
        >
          OSINT.DIGEST
        </h1>

        {/* TOP BAR */}

        <div
          style={{
            display: "flex",
            gap: "18px",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >

          <div
            style={{
              border:
                "1px solid #0ea5e9",
              padding:
                "10px 18px",
            }}
          >
            UTC / ZULU
          </div>

          <div
            style={{
              color: "#38bdf8",
            }}
          >
            {utcTime}
          </div>

          <div
            style={{
              border:
                "1px solid #22c55e",
              padding:
                "10px 18px",
              color: "#22c55e",
            }}
          >
            IST
          </div>

          <div
            style={{
              color: "#4ade80",
            }}
          >
            {istTime}
          </div>

        </div>

        {/* DEFCON */}

        <div
          style={{
            color: "#facc15",
            fontSize: "28px",
            marginBottom: "4px",
          }}
        >
          DEFCON 4
        </div>

        <div
          style={{
            color: "#93c5fd",
            marginBottom: "20px",
          }}
        >
          ELEVATED
        </div>

        {/* TICKER */}

        <div
          style={{
            border:
              "1px solid #0ea5e9",
            padding: "14px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            marginBottom: "30px",
          }}
        >

          {events.map((event) => (

            <span
              key={event.id}
              style={{
                marginRight: "80px",
                color:
                  event.severity ===
                  "high"
                    ? "#ef4444"
                    : "#38bdf8",

                fontWeight: "bold",
                fontSize: "18px",
              }}
            >

              ● {event.region}
              {" — "}
              {event.title}
              {" — "}
              {event.status}

            </span>

          ))}

        </div>

      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, 1fr)",
          gap: "18px",
          marginBottom: "24px",
        }}
      >

        <div
          style={{
            border:
              "1px solid #ef4444",
            padding: "24px",
          }}
        >

          <div
            style={{
              color: "#ef4444",
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >
            HIGH THREATS
          </div>

          <div
            style={{
              color: "#ef4444",
              fontSize: "64px",
              fontWeight: "bold",
            }}
          >
            {highThreats}
          </div>

        </div>

        <div
          style={{
            border:
              "1px solid #0ea5e9",
            padding: "24px",
          }}
        >

          <div
            style={{
              color: "#38bdf8",
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >
            ACTIVE INCIDENTS
          </div>

          <div
            style={{
              color: "#38bdf8",
              fontSize: "64px",
              fontWeight: "bold",
            }}
          >
            {events.length}
          </div>

        </div>

        <div
          style={{
            border:
              "1px solid #22c55e",
            padding: "24px",
          }}
        >

          <div
            style={{
              color: "#22c55e",
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >
            MONITORING
          </div>

          <div
            style={{
              color: "#22c55e",
              fontSize: "64px",
              fontWeight: "bold",
            }}
          >
            0
          </div>

        </div>

        <div
          style={{
            border:
              "1px solid #0ea5e9",
            padding: "24px",
          }}
        >

          <div
            style={{
              color: "#38bdf8",
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >
            NAVAL ASSETS
          </div>

          <div
            style={{
              color: "#38bdf8",
              fontSize: "64px",
              fontWeight: "bold",
            }}
          >
            {navalAssets}
          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "5fr 1fr",
          gap: "14px",
          marginBottom: "30px",
        }}
      >

        <input
          placeholder="Search threats..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          style={{
            background: "#020617",
            border:
              "1px solid #0ea5e9",
            padding: "16px",
            color: "#dbeafe",
          }}
        />

        <select
          value={severityFilter}
          onChange={(e) =>
            setSeverityFilter(
              e.target.value
            )
          }

          style={{
            background: "#020617",
            border:
              "1px solid #0ea5e9",
            padding: "16px",
            color: "#dbeafe",
          }}
        >

          <option>
            ALL
          </option>

          <option>
            high
          </option>

          <option>
            medium
          </option>

        </select>

      </div>

      {/* ADMIN PANEL */}

      <div
        style={{
          marginBottom: "30px",
        }}
      >

        <AdminPanel
          onAddEvent={
            handleAddEvent
          }
        />

      </div>

      {/* MAIN GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 2fr 1fr",
          gap: "20px",
          alignItems: "start",
        }}
      >

        {/* LEFT */}

        <div
          style={{
            border:
              "1px solid #0ea5e9",
            background: "#020617",
            padding: "20px",
            minHeight: "700px",
          }}
        >

          <h2
            style={{
              color: "#38bdf8",
              marginBottom: "24px",
              fontSize: "48px",
            }}
          >
            LIVE FEED
          </h2>

          {filteredEvents.map(
            (event: any) => (

              <div
                key={event.id}

                onClick={() =>
                  setSelectedEvent(
                    event
                  )
                }

                style={{
                  border:
                    event.severity ===
                    "high"
                      ? "1px solid #ef4444"
                      : "1px solid #0ea5e9",

                  padding: "18px",
                  marginBottom:
                    "18px",

                  background:
                    "#081129",

                  cursor:
                    "pointer",
                }}
              >

                <h3
                  style={{
                    color:
                      "#38bdf8",
                    marginBottom:
                      "12px",

                    fontSize:
                      "20px",
                  }}
                >
                  {event.title}
                </h3>

                <p>
                  REGION:
                  {" "}
                  {event.region}
                </p>

                <p>
                  CATEGORY:
                  {" "}
                  {event.category}
                </p>

                <p>
                  STATUS:
                  {" "}
                  {event.status}
                </p>

              </div>

            )
          )}

        </div>

        {/* CENTER */}

        <div>

          <WorldMap
            events={
              filteredEvents
            }

            selectedEvent={
              selectedEvent
            }
          />

        </div>

        {/* RIGHT */}

        <div
          style={{
            border:
              "1px solid #0ea5e9",
            background: "#020617",
            padding: "20px",
            minHeight: "700px",
          }}
        >

          <h2
            style={{
              color: "#38bdf8",
              marginBottom: "24px",
              fontSize: "48px",
            }}
          >
            EVENT ANALYSIS
          </h2>

          {selectedEvent ? (

            <div>

              <h3
                style={{
                  color: "#38bdf8",
                  marginBottom:
                    "18px",

                  fontSize:
                    "24px",
                }}
              >
                {
                  selectedEvent.title
                }
              </h3>

              <p>
                REGION:
                {" "}
                {
                  selectedEvent.region
                }
              </p>

              <p>
                CATEGORY:
                {" "}
                {
                  selectedEvent.category
                }
              </p>

              <p>
                SEVERITY:
                {" "}
                {
                  selectedEvent.severity
                }
              </p>

              <p>
                STATUS:
                {" "}
                {
                  selectedEvent.status
                }
              </p>

            </div>

          ) : (

            <p>
              Select an event
              from live feed.
            </p>

          )}

        </div>

      </div>

    </main>
  );
}