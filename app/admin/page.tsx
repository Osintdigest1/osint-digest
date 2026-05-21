"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type EventType = {
  title: string;
  region: string;
  category: string;
  severity: string;
  status: string;
  lat: string;
  lng: string;
  source: string;
};

type StoredEvent = {
  id: number;
  title: string;
  region: string;
  category: string;
  severity: string;
  status: string;
  lat: string;
  lng: string;
  source: string;
  timestamp: string;
};

export default function AdminPage() {
  const [formData, setFormData] =
    useState<EventType>({
      title: "",
      region: "",
      category: "",
      severity: "medium",
      status: "active",
      lat: "",
      lng: "",
      source: "",
    });

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [events, setEvents] =
    useState<StoredEvent[]>([]);

  const [loading, setLoading] =
    useState(false);

  /* FETCH EVENTS */
  const fetchEvents = async () => {
    try {
      const response =
        await fetch("/api/events");

      const data =
        await response.json();

      setEvents(
        Array.isArray(data.events)
          ? data.events
          : []
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
  fetchEvents();

  const channel =
    supabase
      .channel(
        "realtime-events"
      )
      .on(
        "postgres_changes",
        {
          event: "*",

          schema:
            "public",

          table:
            "events",
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

  /* INPUT CHANGE */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  /* SUBMIT */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      /* UPDATE */
      if (editingId) {
        await fetch(
          `/api/events/${editingId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              formData
            ),
          }
        );

        setEditingId(null);
      } else {
        /* CREATE */
        await fetch("/api/events", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            formData
          ),
        });
      }

      setFormData({
        title: "",
        region: "",
        category: "",
        severity: "medium",
        status: "active",
        lat: "",
        lng: "",
        source: "",
      });

      fetchEvents();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  /* DELETE */
  const handleDelete = async (
    id: number
  ) => {
    const confirmed =
      confirm(
        "Delete this event?"
      );

    if (!confirmed) return;

    try {
      await fetch(
        `/api/events/${id}`,
        {
          method: "DELETE",
        }
      );

      fetchEvents();
    } catch (error) {
      console.log(error);
    }
  };

  /* EDIT */
  const handleEdit = (
    event: StoredEvent
  ) => {
    setEditingId(event.id);

    setFormData({
      title: event.title,
      region: event.region,
      category: event.category,
      severity: event.severity,
      status: event.status,
      lat: String(event.lat),
      lng: String(event.lng),
      source: event.source,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* LOGOUT */
  const handleLogout =
    async () => {
      await supabase.auth.signOut();

      window.location.href =
        "/login";
    };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#030712",
        color: "#7dd3fc",
        padding: "40px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <div
            style={{
              color: "#38bdf8",
              fontSize: "14px",
            }}
          >
            OSINT.DIGEST
          </div>

          <h1
            style={{
              fontSize: "56px",
              margin: 0,
            }}
          >
            ADMIN PANEL
          </h1>

          <p
            style={{
              opacity: 0.7,
            }}
          >
            Intelligence Event
            Management Console
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "14px 24px",
            background: "#ef4444",
            border: "none",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          LOGOUT
        </button>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 450px",
          gap: "30px",
        }}
      >
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#020617",
            border:
              "1px solid #0ea5e9",
            padding: "30px",
          }}
        >
          {/* TITLE */}
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label>
              EVENT TITLE
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* REGION */}
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label>
              REGION
            </label>

            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* CATEGORY */}
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label>
              CATEGORY
            </label>

            <select
              name="category"
              value={
                formData.category
              }
              onChange={
                handleChange
              }
              required
              style={inputStyle}
            >
              <option value="">
                Select
              </option>

              <option value="Conflict">
                Conflict
              </option>

              <option value="Border">
                Border
              </option>

              <option value="Naval">
                Naval
              </option>

              <option value="Geopolitical">
                Geopolitical
              </option>
            </select>
          </div>

          {/* SEVERITY */}
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label>
              SEVERITY
            </label>

            <select
              name="severity"
              value={
                formData.severity
              }
              onChange={
                handleChange
              }
              style={inputStyle}
            >
              <option value="low">
                LOW
              </option>

              <option value="medium">
                MEDIUM
              </option>

              <option value="high">
                HIGH
              </option>
            </select>
          </div>

          {/* STATUS */}
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label>
              STATUS
            </label>

            <select
              name="status"
              value={
                formData.status
              }
              onChange={
                handleChange
              }
              style={inputStyle}
            >
              <option value="active">
                ACTIVE
              </option>

              <option value="monitoring">
                MONITORING
              </option>

              <option value="resolved">
                RESOLVED
              </option>
            </select>
          </div>

          {/* LAT LNG */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{ flex: 1 }}
            >
              <label>
                LATITUDE
              </label>

              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div
              style={{ flex: 1 }}
            >
              <label>
                LONGITUDE
              </label>

              <input
                type="number"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* SOURCE */}
          <div
            style={{
              marginBottom: "30px",
            }}
          >
            <label>
              SOURCE
            </label>

            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background:
                editingId
                  ? "#f59e0b"
                  : "#38bdf8",
              border: "none",
              color: "#020617",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {editingId
              ? "SAVE CHANGES"
              : "ADD EVENT"}
          </button>
        </form>

        {/* EVENTS */}
        <div
          style={{
            background: "#020617",
            border:
              "1px solid #0ea5e9",
            padding: "20px",
            overflowY: "auto",
            maxHeight: "900px",
          }}
        >
          <h2>
            LIVE EVENT DATABASE
          </h2>

          {events.map((event) => (
            <div
              key={event.id}
              style={{
                border:
                  event.severity ===
                  "high"
                    ? "1px solid #ef4444"
                    : "1px solid #0ea5e9",

                background:
                  "#0f172a",

                padding: "15px",

                marginTop: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                <div
                  style={{
                    color:
                      event.severity ===
                      "high"
                        ? "#ef4444"
                        : "#38bdf8",

                    fontWeight:
                      "bold",
                  }}
                >
                  {event.severity.toUpperCase()}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() =>
                      handleEdit(
                        event
                      )
                    }
                    style={{
                      background:
                        "#f59e0b",
                      border:
                        "none",
                      color:
                        "white",
                      padding:
                        "6px 12px",
                      cursor:
                        "pointer",
                    }}
                  >
                    EDIT
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        event.id
                      )
                    }
                    style={{
                      background:
                        "#ef4444",
                      border:
                        "none",
                      color:
                        "white",
                      padding:
                        "6px 12px",
                      cursor:
                        "pointer",
                    }}
                  >
                    DELETE
                  </button>
                </div>
              </div>

              <h3>
                {event.title}
              </h3>

              <div>
                REGION:{" "}
                {event.region}
              </div>

              <div>
                CATEGORY:{" "}
                {event.category}
              </div>

              <div>
                STATUS:{" "}
                {event.status}
              </div>

              <div>
                SOURCE:{" "}
                {event.source}
              </div>

              <div
                style={{
                  marginTop: "10px",
                  opacity: 0.6,
                  fontSize: "12px",
                }}
              >
                {event.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: "8px",
  padding: "14px",
  background: "#0f172a",
  border: "1px solid #0ea5e9",
  color: "#7dd3fc",
  outline: "none",
};