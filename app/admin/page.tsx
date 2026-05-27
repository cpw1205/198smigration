"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("applications") || "[]");
    setData(saved);
  }, []);

  function clearData() {
    if (confirm("Delete all applications?")) {
      localStorage.removeItem("applications");
      setData([]);
    }
  }

  return (
    <main style={mainStyle}>
      <h1 style={titleStyle}>Admin Page</h1>
      <p style={{ color: "gray" }}>Migration application list</p>

      <button onClick={clearData} style={deleteButtonStyle}>
        Delete All
      </button>

      <div style={listStyle}>
        {data.length === 0 && <p>No applications yet.</p>}

        {data.map((item, index) => (
          <div key={index} style={cardStyle}>
            <h2 style={{ color: "lime" }}>{item.name}</h2>
            <p>Server: {item.server}</p>
            <p>Power: {item.power}</p>
            <p>Alliance: {item.alliance}</p>
            <p>Message: {item.message}</p>
            <p style={{ color: "gray" }}>{item.date}</p>
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
  fontFamily: "Arial",
  padding: "30px",
};

const titleStyle: React.CSSProperties = {
  color: "lime",
  fontSize: "50px",
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: "red",
  color: "white",
  padding: "12px 25px",
  border: "none",
  borderRadius: "10px",
  marginBottom: "30px",
  cursor: "pointer",
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