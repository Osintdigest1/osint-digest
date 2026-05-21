"use client";

import { useState } from "react";

type AdminPanelProps = {
  onAddEvent: (event: any) => void;
};

export default function AdminPanel({
  onAddEvent,
}: AdminPanelProps) {

  const [title, setTitle] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("Naval");
  const [severity, setSeverity] = useState("high");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  function handleSubmit() {

    if (
      !title ||
      !region ||
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
    };

    onAddEvent(newEvent);

    setTitle("");
    setRegion("");
    setLat("");
    setLng("");
  }

  return (

    <div className="admin-panel">

      <h2 className="panel-title">
        LIVE EVENT INJECTION
      </h2>

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
        <option>Conflict</option>
        <option>Border</option>
      </select>

      <select
        value={severity}
        onChange={(e) =>
          setSeverity(e.target.value)
        }
      >
        <option>high</option>
        <option>medium</option>
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
      >
        PUSH LIVE EVENT
      </button>

    </div>
  );
}