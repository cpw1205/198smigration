"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    server: "",
    power: "",
    alliance: "",
    migration_grade: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.from("applications").insert([
      {
        name: form.name,
        server: form.server,
        power: form.power,
        alliance: form.alliance,
        migration_grade: form.migration_grade,
        message: form.message,
      },
    ]);

    setLoading(false);

    console.log(error);

    if (error) {
      alert("Submission failed. Please try again.");
      return;
    }

    alert("Application submitted successfully!");

    setForm({
      name: "",
      server: "",
      power: "",
      alliance: "",
      migration_grade: "",
      message: "",
    });
  }

  return (
    <main style={styles.main}>
      <section style={styles.hero}>
        <h1 style={styles.title}>SERVER 198 MIGRATION</h1>

        <p style={styles.subtitle}>
          Welcome to the official Server 198 migration website.
          <br />
          Join our warriors and prepare for the next SVS battle.
        </p>

        <a href="#apply" style={styles.button}>
          APPLY NOW
        </a>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>ABOUT SERVER 198</h2>

        <p style={styles.text}>
          Server 198 is recruiting active fighters and loyal alliances.
          <br />
          We focus on teamwork, SVS victory, event coordination,
          and long-term growth.
        </p>

        <div style={styles.infoBox}>
          <div style={styles.card}>
            <h3>TOP ALLIANCES</h3>
            <p>ETR / RIS3 / 0KK / PTHD</p>
          </div>

          <div style={styles.card}>
            <h3>SVS FOCUS</h3>
            <p>Organized strategy & rally coordination</p>
          </div>

          <div style={styles.card}>
            <h3>ACTIVE PLAYERS</h3>
            <p>International community & daily activity</p>
          </div>
        </div>
      </section>

      <section id="apply" style={styles.sectionDark}>
        <h2 style={styles.sectionTitle}>MIGRATION APPLICATION</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Nickname"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="server"
            placeholder="Current Server"
            value={form.server}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="power"
            placeholder="Power"
            value={form.power}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="alliance"
            placeholder="Current Alliance"
            value={form.alliance}
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="migration_grade"
            value={form.migration_grade}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Migration Grade</option>
            <option value="Elite">Elite (특급)</option>
            <option value="Advanced">Advanced (고급)</option>
            <option value="Medium">Medium (중급)</option>
            <option value="Regular">Regular (일반)</option>
          </select>

          <textarea
            name="message"
            placeholder="Introduce yourself"
            value={form.message}
            onChange={handleChange}
            style={styles.textarea}
          />

          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? "SUBMITTING..." : "SUBMIT APPLICATION"}
          </button>
        </form>
      </section>

      <footer style={styles.footer}>
        © 2026 SERVER 198 MIGRATION — ALL RIGHTS RESERVED
      </footer>
    </main>
  );
}

const styles: any = {
  main: {
    backgroundColor: "#0b0b0b",
    color: "white",
    minHeight: "100vh",
    fontFamily: "Arial",
  },

  hero: {
    textAlign: "center",
    padding: "120px 20px",
    background: "linear-gradient(to bottom, #111111, #1b1b1b)",
  },

  title: {
    fontSize: "64px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#ffcc00",
  },

  subtitle: {
    fontSize: "20px",
    lineHeight: "1.8",
    color: "#cccccc",
    marginBottom: "40px",
  },

  button: {
    backgroundColor: "#ffcc00",
    color: "#000",
    padding: "15px 35px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "18px",
  },

  section: {
    padding: "80px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  sectionDark: {
    padding: "80px 20px",
    backgroundColor: "#151515",
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: "40px",
    marginBottom: "50px",
    color: "#ffcc00",
  },

  text: {
    textAlign: "center",
    color: "#cccccc",
    lineHeight: "1.8",
    fontSize: "18px",
  },

  infoBox: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "50px",
  },

  card: {
    backgroundColor: "#1f1f1f",
    padding: "30px",
    borderRadius: "15px",
    textAlign: "center",
    border: "1px solid #333",
  },

  form: {
    maxWidth: "700px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  input: {
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #333",
    backgroundColor: "#222",
    color: "white",
    fontSize: "16px",
  },

  textarea: {
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #333",
    backgroundColor: "#222",
    color: "white",
    minHeight: "140px",
    fontSize: "16px",
  },

  submitButton: {
    backgroundColor: "#ffcc00",
    color: "#000",
    padding: "16px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "18px",
    cursor: "pointer",
  },

  footer: {
    textAlign: "center",
    padding: "40px",
    color: "#777",
    borderTop: "1px solid #222",
    marginTop: "60px",
  },
};