"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);

    const res = await fetch("/api/applications", {
      headers: {
        "x-admin-password": password,
      },
    });

    setLoading(false);

    if (!res.ok) {
      alert("Wrong password");
      return;
    }

    const result = await res.json();

    setData(result);
    setAuthorized(true);
  }

  async function handleDelete(id: number) {
    const ok = confirm("정말 이 신청정보를 삭제할까요?");

    if (!ok) return;

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      alert("Delete failed. Please try again.");
      return;
    }

    setData((prev) => prev.filter((item) => item.id !== id));

    alert("Deleted successfully.");
  }

  if (!authorized) {
    return (
      <main style={mainStyle}>
        <div style={loginBoxStyle}>
          <h1 style={{ color: "lime" }}>Admin Login</h1>

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button onClick={login} style={buttonStyle}>
            {loading ? "Loading..." : "Login"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={mainStyle}>
      <h1 style={titleStyle}>Applications</h1>

      <div style={listStyle}>
        {data.map((item) => (
          <div key={item.id} style={cardStyle}>
            <h2 style={{ color: "lime" }}>{item.name}</h2>

            <p>Server: {item.server}</p>
            <p>Power: {item.power}</p>
            <p>Alliance: {item.alliance}</p>
            <p>Migration Grade: {item.migration_grade}</p>
            <p>Message: {item.message}</p>

            <p style={{ color: "gray", marginTop: "10px" }}>
              {new Date(item.created_at).toLocaleString()}
            </p>

            <button
              onClick={() => handleDelete(item.id)}
              style={deleteButtonStyle}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

const mainStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "black",
  color: "white",
  padding: "30px",
  fontFamily: "Arial",
};

const loginBoxStyle: React.CSSProperties = {
  maxWidth: "400px",
  margin: "120px auto",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const titleStyle: React.CSSProperties = {
  color: "lime",
  marginBottom: "30px",
};

const listStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid lime",
  borderRadius: "15px",
  padding: "20px",
};

const inputStyle: React.CSSProperties = {
  padding: "16px",
  borderRadius: "10px",
  border: "1px solid gray",
  backgroundColor: "#111",
  color: "white",
  fontSize: "18px",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "lime",
  color: "black",
  padding: "16px",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
};

const deleteButtonStyle: React.CSSProperties = {
  marginTop: "15px",
  backgroundColor: "#ff3333",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
};