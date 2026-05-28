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
    <main className="main">
      <section className="hero"></section>

      <section id="apply" className="applySection">
        <h2>MIGRATION APPLICATION</h2>

        <form onSubmit={handleSubmit} className="form">
          <input type="text" name="name" placeholder="Nickname" value={form.name} onChange={handleChange} required />
          <input type="text" name="server" placeholder="Current Server" value={form.server} onChange={handleChange} required />
          <input type="text" name="power" placeholder="Power" value={form.power} onChange={handleChange} required />
          <input type="text" name="alliance" placeholder="Current Alliance" value={form.alliance} onChange={handleChange} />

          <select name="migration_grade" value={form.migration_grade} onChange={handleChange} required>
            <option value="">Select Migration Grade</option>
            <option value="Elite">Elite (특급)</option>
            <option value="Advanced">Advanced (고급)</option>
            <option value="Medium">Medium (중급)</option>
            <option value="Regular">Regular (일반)</option>
          </select>

          <textarea name="message" placeholder="Introduce yourself" value={form.message} onChange={handleChange} />

          <button type="submit" disabled={loading}>
            {loading ? "SUBMITTING..." : "SUBMIT APPLICATION"}
          </button>
        </form>
      </section>

      <section className="infoSection">
        <h2>WHY SERVER 198?</h2>

        <p className="mainText">
          Server 198 is preparing for one of the most competitive Season 4 battlefields.
          <br />
          Strong alliances, organized leadership, active international players,
          and coordinated warfare systems await.
        </p>

        <div className="infoBox">
          <div className="card">
            <h3>TOP ALLIANCES</h3>
            <p>ETR / RIS3 / 0KK / PTHD</p>
            <span>Multiple powerful alliances with experienced rally leaders and active fighters.</span>
          </div>

          <div className="card">
            <h3>SVS ORGANIZATION</h3>
            <p>Organized battle plans, capital rotation, rally coordination, and tactical warfare.</p>
            <span>Every alliance has battlefield roles and strategic objectives during SVS.</span>
          </div>

          <div className="card">
            <h3>GLOBAL COMMUNITY</h3>
            <p>International active players from multiple regions.</p>
            <span>Daily activity, fast communication, and cooperative gameplay environment.</span>
          </div>

          <div className="card">
            <h3>SEASON 4 PREPARATION</h3>
            <p>Preparing for dinosaur battlefield warfare and large-scale combat.</p>
            <span>Recruitment focused on active, long-term competitive players.</span>
          </div>
        </div>
      </section>

      <footer>© 2026 SERVER 198 MIGRATION</footer>

      <style jsx>{`
        .main {
          background: #050505;
          color: white;
          min-height: 100vh;
          font-family: Arial, sans-serif;
          overflow-x: hidden;
        }

        .hero {
          width: 100%;
          height: 820px;
          background-image: url("/season4-bg.png");
          background-size: contain;
          background-position: top center;
          background-repeat: no-repeat;
          background-color: #050505;
        }

        .applySection {
          padding: 20px 20px 90px;
          background: #101010;
        }

        h2 {
          text-align: center;
          font-size: 46px;
          margin-bottom: 45px;
          color: #ffd400;
        }

        .form {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        input,
        select,
        textarea {
          padding: 17px;
          border-radius: 12px;
          border: 1px solid #333;
          background: #1b1b1b;
          color: white;
          font-size: 16px;
        }

        textarea {
          min-height: 160px;
        }

        button {
          background: #ffd400;
          color: #000;
          padding: 17px;
          border: none;
          border-radius: 12px;
          font-weight: bold;
          font-size: 17px;
          cursor: pointer;
          box-shadow: 0 0 18px rgba(255, 212, 0, 0.4);
        }

        .infoSection {
          padding: 100px 20px;
          max-width: 1300px;
          margin: 0 auto;
        }

        .mainText {
          text-align: center;
          color: #d0d0d0;
          line-height: 1.9;
          font-size: 21px;
          max-width: 900px;
          margin: 0 auto 70px;
        }

        .infoBox {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 28px;
        }

        .card {
          background: #161616;
          padding: 38px;
          border-radius: 18px;
          border: 1px solid #333;
          box-shadow: 0 0 18px rgba(255, 212, 0, 0.12);
        }

        .card h3 {
          color: #ffd400;
          margin-bottom: 18px;
          font-size: 24px;
        }

        .card p {
          font-size: 18px;
          line-height: 1.8;
          margin-bottom: 20px;
          color: white;
        }

        .card span {
          color: #bbbbbb;
          line-height: 1.7;
          font-size: 15px;
        }

        footer {
          text-align: center;
          padding: 45px;
          color: #777;
          border-top: 1px solid #222;
        }

        @media (max-width: 768px) {
          .hero {
            height: 260px;
            background-size: contain;
            background-position: top center;
          }

          .applySection {
            padding: 25px 16px 70px;
          }

          h2 {
            font-size: 30px;
            margin-bottom: 30px;
          }

          .infoSection {
            padding: 70px 16px;
          }

          .mainText {
            font-size: 17px;
            line-height: 1.8;
            margin-bottom: 50px;
          }

          .card {
            padding: 28px;
          }

          .card h3 {
            font-size: 21px;
          }

          .card p {
            font-size: 16px;
          }
        }
      `}</style>
    </main>
  );
}