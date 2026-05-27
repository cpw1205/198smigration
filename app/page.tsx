"use client";

import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    server: "",
    power: "",
    alliance: "",
    message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const oldData = JSON.parse(localStorage.getItem("applications") || "[]");
    const newData = {
      ...form,
      date: new Date().toLocaleString(),
    };

    localStorage.setItem("applications", JSON.stringify([...oldData, newData]));

    alert("Application submitted successfully!");

    setForm({
      name: "",
      server: "",
      power: "",
      alliance: "",
      message: "",
    });
  }

  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <h1 style={titleStyle}>198 Migration</h1>
        <p style={subTitleStyle}>
          Welcome to the official 198 server migration website.
          <br />
          Join our warriors and prepare for the next SVS.
        </p>
      </section>

      <section style={cardWrapStyle}>
        <InfoCard title="Top Alliance" text="ETR Alliance" />
        <InfoCard title="Server Goal" text="Win every SVS battle" />
        <InfoCard title="Recruiting" text="Active fighters Lv30+" />
      </section>

      <section style={formBoxStyle}>
        <h2 style={formTitleStyle}>Migration Application</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
            required
          />

          <input
            placeholder="Current Server"
            value={form.server}
            onChange={(e) => setForm({ ...form, server: e.target.value })}
            style={inputStyle}
            required
          />

          <input
            placeholder="Power Level"
            value={form.power}
            onChange={(e) => setForm({ ...form, power: e.target.value })}
            style={inputStyle}
            required
          />

          <input
            placeholder="Alliance"
            value={form.alliance}
            onChange={(e) => setForm({ ...form, alliance: e.target.value })}
            style={inputStyle}
          />

          <textarea
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={5}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Apply Now
          </button>
        </form>

        <p style={adminTextStyle}>
          Admin page: <a href="/admin" style={{ color: "lime" }}>/admin</a>
        </p>
      </section>

      <footer style={footerStyle}>© 2026 198 Migration</footer>
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div style={cardStyle}>
      <h2 style={{ color: "lime" }}>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

const mainStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "black",
  color: "white",
  fontFamily: "Arial",
  padding: "30px",
};

const heroStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "50px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "60px",
  color: "lime",
};

const subTitleStyle: React.CSSProperties = {
  fontSize: "22px",
  color: "lightgray",
  lineHeight: "1.6",
};

const cardWrapStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "25px",
  flexWrap: "wrap",
  marginBottom: "60px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#111",
  padding: "25px",
  borderRadius: "18px",
  border: "1px solid lime",
  width: "280px",
  textAlign: "center",
};

const formBoxStyle: React.CSSProperties = {
  maxWidth: "700px",
  margin: "0 auto",
  backgroundColor: "#111",
  padding: "35px",
  borderRadius: "20px",
  border: "1px solid lime",
};

const formTitleStyle: React.CSSProperties = {
  textAlign: "center",
  color: "lime",
  fontSize: "38px",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const inputStyle: React.CSSProperties = {
  padding: "16px",
  borderRadius: "10px",
  border: "1px solid gray",
  backgroundColor: "#222",
  color: "white",
  fontSize: "18px",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "lime",
  color: "black",
  padding: "18px",
  border: "none",
  borderRadius: "12px",
  fontSize: "20px",
  fontWeight: "bold",
  cursor: "pointer",
};

const adminTextStyle: React.CSSProperties = {
  textAlign: "center",
  marginTop: "25px",
  color: "gray",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  marginTop: "70px",
  color: "gray",
};