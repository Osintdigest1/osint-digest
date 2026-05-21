"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router =
    useRouter();

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      setLoading(true);

      setError("");

      const {
        error,
      } = await supabase.auth.signInWithPassword(
        {
          email,

          password,
        }
      );

      if (error) {
        setError(
          error.message
        );

        setLoading(false);

        return;
      }

      window.location.href =
  "/admin";
    };

  return (
    <main
      style={{
        minHeight: "100vh",

        display: "flex",

        justifyContent:
          "center",

        alignItems:
          "center",

        background:
          "#030712",

        color: "#7dd3fc",

        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={
          handleLogin
        }
        style={{
          width: "420px",

          background:
            "#020617",

          border:
            "1px solid #0ea5e9",

          padding: "40px",
        }}
      >
        <div
          style={{
            fontSize: "14px",

            color: "#38bdf8",
          }}
        >
          OSINT.DIGEST
        </div>

        <h1>
          Analyst Login
        </h1>

        {/* EMAIL */}
        <div
          style={{
            marginBottom:
              "20px",
          }}
        >
          <label>
            EMAIL
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            required
            style={{
              width: "100%",

              marginTop:
                "8px",

              padding:
                "14px",

              background:
                "#0f172a",

              border:
                "1px solid #0ea5e9",

              color:
                "#7dd3fc",

              outline:
                "none",
            }}
          />
        </div>

        {/* PASSWORD */}
        <div
          style={{
            marginBottom:
              "20px",
          }}
        >
          <label>
            PASSWORD
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            required
            style={{
              width: "100%",

              marginTop:
                "8px",

              padding:
                "14px",

              background:
                "#0f172a",

              border:
                "1px solid #0ea5e9",

              color:
                "#7dd3fc",

              outline:
                "none",
            }}
          />
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              background:
                "#450a0a",

              border:
                "1px solid #ef4444",

              color:
                "#fca5a5",

              padding:
                "12px",

              marginBottom:
                "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",

            padding: "16px",

            background:
              "#38bdf8",

            border: "none",

            color: "#020617",

            fontWeight:
              "bold",

            cursor:
              "pointer",
          }}
        >
          {loading
            ? "AUTHENTICATING..."
            : "LOGIN"}
        </button>
      </form>
    </main>
  );
}