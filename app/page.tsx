"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

const WorldMap = dynamic(
  () => import("@/components/WorldMap"),
  {
    ssr: false,
  }
);
import AdminPanel from "@/components/AdminPanel";

import { supabase } from "@/lib/supabase";

export default function Home() {

  const [events, setEvents] =
    useState<any[]>([]);

  const [selectedEvent, setSelectedEvent] =
    useState<any>(null);

  const [search, setSearch] =
    useState("");

  const [severityFilter, setSeverityFilter] =
    useState("ALL");

  /* LOAD EVENTS */

  useEffect(() => {

    fetchEvents();

    const channel =
      supabase

        .channel(
          "events-realtime"
        )

        .on(

          "postgres_changes",

          {

            event: "*",

            schema: "public",

            table: "events",
          },

          () => {

            fetchEvents();
          }
        )

        .subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );
    };

  }, []);

  async function fetchEvents() {

    const {
      data,
    } = await supabase

      .from("events")

      .select("*")

      .order(
        "id",
        {
          ascending: false,
        }
      );

    if (data) {

      setEvents(data);
    }
  }

  /* ADD EVENT */

  async function handleAddEvent(
    eventData: any
  ) {

    await supabase

      .from("events")

      .insert([
        eventData,
      ]);
  }

  /* FILTER EVENTS */

  const filteredEvents =
    events.filter(
      (event) => {

        const matchesSearch =

          event.title
            ?.toLowerCase()

            .includes(
              search.toLowerCase()
            )

          ||

          event.region
            ?.toLowerCase()

            .includes(
              search.toLowerCase()
            );

        const matchesSeverity =

          severityFilter ===
          "ALL"

            ? true

            : event.severity ===
              severityFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesSeverity
        );
      }
    );

  /* COUNTS */

  const highThreats =
    events.filter(
      (
        event
      ) =>

        event.severity ===
        "high"
    ).length;
let defcon = "DEFCON 5";
let defconLabel = "NORMAL";
let defconColor = "#22c55e";

if (highThreats >= 1) {

  defcon = "DEFCON 4";
  defconLabel = "ELEVATED";
  defconColor = "#eab308";
}

if (highThreats >= 3) {

  defcon = "DEFCON 3";
  defconLabel = "HIGH ALERT";
  defconColor = "#f97316";
}

if (highThreats >= 5) {

  defcon = "DEFCON 2";
  defconLabel = "SEVERE";
  defconColor = "#ef4444";
}

if (highThreats >= 7) {

  defcon = "DEFCON 1";
  defconLabel = "CRITICAL";
  defconColor = "#dc2626";
}
  const navalAssets =
    events.filter(
      (
        event
      ) =>

        event.category ===
        "Naval"
    ).length;

  return (

    <main className="dashboard">

      {/* HEADER */}

      <div className="topbar">

        <div>

          <div className="platform-label">
            GLOBAL THREAT
            INTELLIGENCE PLATFORM
          </div>

          <h1 className="logo">
            OSINT.DIGEST
          </h1>

        </div>

        {/* ONLY ONE ADMIN PANEL */}

        <AdminPanel
          onAddEvent={
            handleAddEvent
          }
        />

      </div>

      {/* TIME ROW */}

      <div className="time-row">

        <div className="time-box">
          UTC / ZULU
        </div>

        <div className="time-value">

          {
            new Date()
              .toUTCString()
          }

        </div>

        <div className="time-box green">
          IST
        </div>

        <div className="time-value green-text">

          {
            new Date()
              .toLocaleString(
                "en-IN"
              )
          }

        </div>

      </div>
<div
  className="defcon-bar"

  style={{
    borderColor: defconColor,
  }}
>

  <div
    className="defcon-level"

    style={{
      color: defconColor,
    }}
  >
    {defcon}
  </div>

  <div className="defcon-label">
    {defconLabel}
  </div>

</div>
      {/* TICKER */}

      <div className="ticker">

        <div className="ticker-track">

          {events.map(
            (
              event
            ) => (

              <span

                key={
                  event.id
                }

                className={

                  event.severity ===
                  "high"

                    ? "ticker-high"

                    : "ticker-normal"
                }
              >

                ● {

                  event.region
                }

                {" — "}

                {

                  event.title
                }

                {" — active"}

              </span>
            )
          )}

        </div>

      </div>

      {/* METRICS */}

      <div className="metrics-grid">

        <div className="metric-card red">

          <div className="metric-title">
            HIGH THREATS
          </div>

          <div className="metric-value">
            {highThreats}
          </div>

        </div>

        <div className="metric-card blue">

          <div className="metric-title">
            ACTIVE INCIDENTS
          </div>

          <div className="metric-value">
            {events.length}
          </div>

        </div>

        <div className="metric-card green">

          <div className="metric-title">
            MONITORING
          </div>

          <div className="metric-value">
            0
          </div>

        </div>

        <div className="metric-card blue">

          <div className="metric-title">
            NAVAL ASSETS
          </div>

          <div className="metric-value">
            {navalAssets}
          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="search-row">

        <input

          type="text"

          placeholder="Search threats..."

          className="search-box"

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select

          className="severity-filter"

          value={
            severityFilter
          }

          onChange={(e) =>
            setSeverityFilter(
              e.target.value
            )
          }
        >

          <option>
            ALL
          </option>

          <option>
            HIGH
          </option>

          <option>
            MEDIUM
          </option>

          <option>
            LOW
          </option>

        </select>

      </div>

      {/* MAIN GRID */}

      <div className="main-grid">

        {/* LIVE FEED */}

        <div className="panel">

          <h2 className="panel-title">
            LIVE FEED
          </h2>

          <div className="feed-list">

            {filteredEvents.map(
              (
                event
              ) => (

                <div

                  key={
                    event.id
                  }

                  className={`feed-card ${
                    event.severity ===
                    "high"

                      ? "feed-high"

                      : "feed-normal"
                  }`}

                  onClick={() =>
                    setSelectedEvent(
                      event
                    )
                  }
                >

                  <h3>
                    {event.title}
                  </h3>

                  <p>
                    REGION: {
                      event.region
                    }
                  </p>

                  <p>
                    CATEGORY: {
                      event.category
                    }
                  </p>

                  <p>
                    STATUS: active
                  </p>

                </div>
              )
            )}

          </div>

        </div>

        {/* MAP */}

        <WorldMap

          events={
            filteredEvents
          }

          selectedEvent={
            selectedEvent
          }
        />

        {/* ANALYSIS */}

        <div className="panel">

          <h2 className="panel-title">
            EVENT ANALYSIS
          </h2>

          {selectedEvent ? (

            <div className="analysis-box">

              <h3>
                {
                  selectedEvent.title
                }
              </h3>

              <p>
                REGION: {
                  selectedEvent.region
                }
              </p>

              <p>
                CATEGORY: {
                  selectedEvent.category
                }
              </p>

              <p>
                STATUS: active
              </p>

              <p>
                SEVERITY: {
                  selectedEvent.severity
                }
              </p>

              <p>
                LAT: {
                  selectedEvent.lat
                }
              </p>

              <p>
                LNG: {
                  selectedEvent.lng
                }
              </p>

            </div>

          ) : (

            <p className="analysis-empty">
              Select an event
              from live feed.
            </p>

          )}

        </div>

      </div>

    </main>
  );
}