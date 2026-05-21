"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

const WorldMap = dynamic(
  () => import("@/components/WorldMap"),
  {
    ssr: false,
  }
);

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);

  const [selectedEvent, setSelectedEvent] =
    useState<any>(null);

  const [search, setSearch] = useState("");

  const [severityFilter, setSeverityFilter] =
    useState("ALL");

  const [utcTime, setUtcTime] = useState("");

  const [istTime, setIstTime] = useState("");

  const [title, setTitle] = useState("");

  const [region, setRegion] = useState("");

  const [category, setCategory] =
    useState("Naval");

  const [severity, setSeverity] =
    useState("high");

  const [lat, setLat] = useState("");

  const [lng, setLng] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setUtcTime(
        now.toUTCString().replace("GMT", "GMT")
      );

      setIstTime(
        now.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })
      );
    };

    updateClock();

    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    if (
      !title ||
      !region ||
      !category ||
      !severity ||
      !lat ||
      !lng
    ) {
      return;
    }

    const newEvent = {
      id: Date.now(),

      title,

      region,

      category,

      severity,

      lat: Number(lat),

      lng: Number(lng),

      status: "active",

      timestamp: new Date().toISOString(),
    };

    setEvents((prev: any) => [
      newEvent,
      ...(Array.isArray(prev) ? prev : []),
    ]);

    setTitle("");

    setRegion("");

    setCategory("Naval");

    setSeverity("high");

    setLat("");

    setLng("");
  };

  const safeEvents = Array.isArray(events)
    ? events
    : [];

  const filteredEvents = safeEvents.filter(
    (event) => {
      const matchesSearch =
        event.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        event.region
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesSeverity =
        severityFilter === "ALL" ||
        event.severity === severityFilter;

      return (
        matchesSearch && matchesSeverity
      );
    }
  );

  const highThreats = safeEvents.filter(
    (e) => e.severity === "high"
  ).length;

  const activeIncidents =
    safeEvents.length;

  const navalAssets = safeEvents.filter(
    (e) => e.category === "Naval"
  ).length;

  return (
    <main
      style={{
        background: "#010b26",
        minHeight: "100vh",
        color: "#4fc3ff",
        padding: "24px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          fontSize: "18px",
          marginBottom: "12px",
        }}
      >
        GLOBAL THREAT INTELLIGENCE PLATFORM
      </div>

      <h1
        style={{
          fontSize: "88px",
          fontWeight: "bold",
          marginBottom: "24px",
          color: "#74d3fc",
        }}
      >
        OSINT.DIGEST
      </h1>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <div style={tagStyle}>
          UTC / ZULU
        </div>

        <div>{utcTime}</div>

        <div
          style={{
            ...tagStyle,
            border: "1px solid #00ff88",
            color: "#00ff88",
          }}
        >
          IST
        </div>

        <div
          style={{
            color: "#00ff88",
          }}
        >
          {istTime}
        </div>
      </div>

      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            color: "#ffd400",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          DEFCON 4
        </div>

        <div
          style={{
            fontSize: "16px",
          }}
        >
          ELEVATED
        </div>
      </div>

      <div
        style={{
          border: "1px solid #00bfff",
          padding: "12px",
          marginBottom: "30px",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {safeEvents.map((event) => (
          <span
            key={event.id}
            style={{
              marginRight: "80px",
              color:
                event.severity === "high"
                  ? "#ff4d4d"
                  : "#4fc3ff",
              fontWeight: "bold",
            }}
          >
            ● {event.region} — {event.title} —
            active
          </span>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            ...statBox,
            border: "1px solid #ff3b3b",
          }}
        >
          <div
            style={{
              color: "#ff4d4d",
              fontSize: "24px",
            }}
          >
            HIGH THREATS
          </div>

          <div
            style={{
              color: "#ff4d4d",
              fontSize: "64px",
              fontWeight: "bold",
            }}
          >
            {highThreats}
          </div>
        </div>

        <div style={statBox}>
          <div
            style={{
              fontSize: "24px",
            }}
          >
            ACTIVE INCIDENTS
          </div>

          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
            }}
          >
            {activeIncidents}
          </div>
        </div>

        <div
          style={{
            ...statBox,
            border: "1px solid #00ff66",
          }}
        >
          <div
            style={{
              color: "#00ff66",
              fontSize: "24px",
            }}
          >
            MONITORING
          </div>

          <div
            style={{
              color: "#00ff66",
              fontSize: "64px",
              fontWeight: "bold",
            }}
          >
            0
          </div>
        </div>

        <div style={statBox}>
          <div
            style={{
              fontSize: "24px",
            }}
          >
            NAVAL ASSETS
          </div>

          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
            }}
          >
            {navalAssets}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <input
          placeholder="Search threats..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            flex: 1,
            background: "#010b26",
            border: "1px solid #00bfff",
            color: "#74d3fc",
            padding: "14px",
          }}
        />

        <select
          value={severityFilter}
          onChange={(e) =>
            setSeverityFilter(e.target.value)
          }
          style={{
            width: "200px",
            background: "#010b26",
            border: "1px solid #00bfff",
            color: "#74d3fc",
            padding: "14px",
          }}
        >
          <option value="ALL">ALL</option>

          <option value="high">
            HIGH
          </option>

          <option value="medium">
            MEDIUM
          </option>

          <option value="low">LOW</option>
        </select>
      </div>

      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            marginBottom: "12px",
          }}
        >
          LIVE EVENT INJECTION
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr 120px 120px 1fr 1fr auto",
            gap: "8px",
          }}
        >
          <input
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <input
            placeholder="Region"
            value={region}
            onChange={(e) =>
              setRegion(e.target.value)
            }
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option>Naval</option>

            <option>Air</option>

            <option>Border</option>
          </select>

          <select
            value={severity}
            onChange={(e) =>
              setSeverity(e.target.value)
            }
          >
            <option value="high">
              high
            </option>

            <option value="medium">
              medium
            </option>

            <option value="low">
              low
            </option>
          </select>

          <input
            placeholder="Latitude"
            value={lat}
            onChange={(e) =>
              setLat(e.target.value)
            }
          />

          <input
            placeholder="Longitude"
            value={lng}
            onChange={(e) =>
              setLng(e.target.value)
            }
          />

          <button
            onClick={handleSubmit}
            style={{
              background: "#01122a",
              border: "1px solid #00bfff",
              color: "#ffffff",
              padding: "10px 18px",
              cursor: "pointer",
            }}
          >
            PUSH LIVE EVENT
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "300px 1fr 320px",
          gap: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid #00bfff",
            padding: "18px",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              marginBottom: "20px",
            }}
          >
            LIVE FEED
          </h2>

          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() =>
                setSelectedEvent(event)
              }
              style={{
                border:
                  event.severity === "high"
                    ? "1px solid #ff3b3b"
                    : "1px solid #00bfff",

                padding: "16px",

                marginBottom: "16px",

                cursor: "pointer",

                background: "#07142d",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {event.title}
              </div>

              <div>
                REGION: {event.region}
              </div>

              <div>
                CATEGORY: {event.category}
              </div>

              <div>
                STATUS: {event.status}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            height: "700px",
            border: "1px solid #00bfff",
            overflow: "hidden",
          }}
        >
          <WorldMap
            events={filteredEvents}
            selectedEvent={selectedEvent}
          />
        </div>

        <div
          style={{
            border: "1px solid #00bfff",
            padding: "18px",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              marginBottom: "20px",
            }}
          >
            EVENT ANALYSIS
          </h2>

          {selectedEvent ? (
            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "14px",
                }}
              >
                {selectedEvent.title}
              </div>

              <div
                style={{
                  marginBottom: "8px",
                }}
              >
                REGION:
                {" "}
                {selectedEvent.region}
              </div>

              <div
                style={{
                  marginBottom: "8px",
                }}
              >
                CATEGORY:
                {" "}
                {selectedEvent.category}
              </div>

              <div
                style={{
                  marginBottom: "8px",
                }}
              >
                SEVERITY:
                {" "}
                {selectedEvent.severity}
              </div>

              <div
                style={{
                  marginBottom: "8px",
                }}
              >
                STATUS:
                {" "}
                {selectedEvent.status}
              </div>

              <div
                style={{
                  marginTop: "20px",
                  color: "#9fdcff",
                  lineHeight: "1.6",
                }}
              >
                Tactical intelligence monitoring
                active. Regional escalation
                probability elevated.
              </div>
            </div>
          ) : (
            <div>
              Select an event from live
              feed.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const tagStyle = {
  border: "1px solid #00bfff",
  padding: "12px 18px",
};

const statBox = {
  border: "1px solid #00bfff",
  padding: "24px",
  background: "#010b26",
};