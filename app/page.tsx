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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

    if (error) {
      alert("Submission failed.");
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
        <div style={styles.overlay}>
          <h1 style={styles.season}>SEASON 4</h1>

          <h2 style={styles.mainTitle}>
            SERVER 198
            <br />
            MIGRATION
          </h2>

          <p style={styles.subtitle}>
            Dinosaurs rise again.
            <br />
            Tanks prepare for total war.
            <br />
            Join the strongest battlefield.
          </p>

          <a href="#apply" style={styles.button}>
            APPLY NOW
          </a>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          THE WAR BEGINS
        </h2>

        <p style={styles.text}>
          Server 198 prepares for the arrival of Season 4.
          <br />
          Massive dinosaur warfare, organized tank battles,
          and elite alliances await.
        </p>

        <div style={styles.infoBox}>
          <div style={styles.card}>
            <h3>TOP ALLIANCES</h3>
            <p>ETR / RIS3 / 0KK / PTHD</p>
          </div>

          <div style={styles.card}>
            <h3>SEASON 4</h3>
            <p>Dinosaur battlefield & tank warfare</p>
          </div>

          <div style={styles.card}>
            <h3>GLOBAL PLAYERS</h3>
            <p>International active community</p>
          </div>
        </div>
      </section>

      <section id="apply" style={styles.sectionDark}>
        <h2 style={styles.sectionTitle}>
          MIGRATION APPLICATION
        </h2>

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
            <option value="">
              Select Migration Grade
            </option>

            <option value="Elite">
              Elite (특급)
            </option>

            <option value="Advanced">
              Advanced (고급)
            </option>

            <option value="Medium">
              Medium (중급)
            </option>

            <option value="Regular">
              Regular (일반)
            </option>
          </select>

          <textarea
            name="message"
            placeholder="Introduce yourself"
            value={form.message}
            onChange={handleChange}
            style={styles.textarea}
          />

          <button
            type="submit"
            style={styles.submitButton}
            disabled={loading}
          >
            {loading
              ? "SUBMITTING..."
              : "SUBMIT APPLICATION"}
          </button>
        </form>
      </section>

      <footer style={styles.footer}>
        © 2026 SERVER 198 MIGRATION
      </footer>
    </main>
  );
}

const styles: any = {
  main: {
    backgroundColor: "#050505",
    color: "white",
    minHeight: "100vh",
    fontFamily: "Arial",
  },

  hero: {
    minHeight: "100vh",
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.55)), url('/season4-bg.png')",
    backgroundSize: "contain",
    backgroundPosition: "top center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#050505",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "160px 20px 80px",
  },

  overlay: {
    maxWidth: "900px",
  },

  season: {
    fontSize: "42px",
    color: "#ffcc00",
    letterSpacing: "6px",
    marginBottom: "10px",
    textShadow: "0 0 20px rgba(255,204,0,0.8)",
  },

  mainTitle: {
    fontSize: "90px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "white",
    lineHeight: "1.1",
    textShadow: "0 0 25px rgba(0,0,0,0.9)",
  },

  subtitle: {
    fontSize: "24px",
    lineHeight: "1.8",
    color: "#dddddd",
    marginBottom: "50px",
    textShadow: "0 0 10px rgba(0,0,0,0.8)",
  },

  button: {
    backgroundColor: "#ffcc00",
    color: "#000",
    padding: "18px 45px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "20px",
    boxShadow: "0 0 20px rgba(255,204,0,0.5)",
  },

  section: {
    padding: "100px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  sectionDark: {
    padding: "100px 20px",
    backgroundColor: "#101010",
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: "48px",
    marginBottom: "50px",
    color: "#ffcc00",
  },

  text: {
    textAlign: "center",
    color: "#cccccc",
    lineHeight: "1.9",
    fontSize: "20px",
  },

  infoBox: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    marginTop: "60px",
  },

  card: {
    backgroundColor: "#161616",
    padding: "35px",
    borderRadius: "18px",
    textAlign: "center",
    border: "1px solid #333",
    boxShadow: "0 0 15px rgba(255,204,0,0.1)",
  },

  form: {
    maxWidth: "700px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  input: {
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #333",
    backgroundColor: "#1b1b1b",
    color: "white",
    fontSize: "16px",
  },

  textarea: {
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #333",
    backgroundColor: "#1b1b1b",
    color: "white",
    minHeight: "150px",
    fontSize: "16px",
  },

  submitButton: {
    backgroundColor: "#ffcc00",
    color: "#000",
    padding: "18px",
    border: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "18px",
    cursor: "pointer",
    boxShadow: "0 0 15px rgba(255,204,0,0.3)",
  },

  footer: {
    textAlign: "center",
    padding: "40px",
    color: "#777",
    borderTop: "1px solid #222",
  },
};