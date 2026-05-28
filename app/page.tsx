"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [lang, setLang] = useState<"en" | "ko">("en");

  const [form, setForm] = useState({
    name: "",
    server: "",
    power: "",
    alliance: "",
    migration_grade: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const t = {
    en: {
      why: "WHY SERVER 198?",
      intro:
        "Server 198 is preparing for one of the most competitive Season 4 battlefields.",
      intro2:
        "Strong alliances, organized leadership, active international players, and coordinated warfare systems await.",
      topAlliances: "TOP ALLIANCES",
      topText: "Multiple powerful alliances with experienced rally leaders and active fighters.",
      svs: "SVS ORGANIZATION",
      svsText:
        "Organized battle plans, capital rotation, rally coordination, and tactical warfare.",
      svsSub:
        "Every alliance has battlefield roles and strategic objectives during SVS.",
      global: "GLOBAL COMMUNITY",
      globalText: "International active players from multiple regions.",
      globalSub:
        "Daily activity, fast communication, and cooperative gameplay environment.",
      season: "SEASON 4 PREPARATION",
      seasonText:
        "Preparing for dinosaur battlefield warfare and large-scale combat.",
      seasonSub:
        "Recruitment focused on active, long-term competitive players.",
      application: "MIGRATION APPLICATION",
      name: "Nickname",
      server: "Current Server",
      power: "Power",
      alliance: "Current Alliance",
      grade: "Select Migration Grade",
      message: "Introduce yourself",
      submit: "SUBMIT APPLICATION",
      submitting: "SUBMITTING...",
      success: "Application submitted successfully!",
      failed: "Submission failed.",
    },
    ko: {
      why: "왜 서버 198인가?",
      intro:
        "서버 198은 시즌4의 치열한 전장을 준비하고 있습니다.",
      intro2:
        "강력한 연맹, 체계적인 지휘, 활발한 글로벌 유저, 조직적인 전쟁 시스템이 준비되어 있습니다.",
      topAlliances: "주요 연맹",
      topText:
        "숙련된 랠리 리더와 활발한 전투 유저들이 함께하는 강력한 연맹들이 있습니다.",
      svs: "SVS 조직력",
      svsText:
        "전투 계획, 수도 운영, 랠리 조율, 전략적인 전쟁 운영을 진행합니다.",
      svsSub:
        "각 연맹은 SVS에서 역할과 목표를 가지고 움직입니다.",
      global: "글로벌 커뮤니티",
      globalText:
        "여러 지역의 활발한 글로벌 유저들이 함께합니다.",
      globalSub:
        "빠른 소통, 일일 활동, 협력적인 플레이 환경을 제공합니다.",
      season: "시즌4 준비",
      seasonText:
        "공룡 전장과 대규모 전투를 준비하고 있습니다.",
      seasonSub:
        "장기적으로 함께할 활발하고 경쟁력 있는 유저를 모집합니다.",
      application: "이민 신청서",
      name: "닉네임",
      server: "현재 서버",
      power: "전투력",
      alliance: "현재 연맹",
      grade: "이민 등급 선택",
      message: "자기소개",
      submit: "신청하기",
      submitting: "신청 중...",
      success: "신청이 완료되었습니다!",
      failed: "신청에 실패했습니다.",
    },
  }[lang];

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
      alert(t.failed);
      return;
    }

    alert(t.success);

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
      <div className="languageBox">
        <button
          className={lang === "en" ? "activeLang" : ""}
          onClick={() => setLang("en")}
        >
          English
        </button>

        <button
          className={lang === "ko" ? "activeLang" : ""}
          onClick={() => setLang("ko")}
        >
          한국어
        </button>
      </div>

      <section className="hero"></section>

      <section className="infoSection">
        <h2>{t.why}</h2>

        <p className="mainText">
          {t.intro}
          <br />
          {t.intro2}
        </p>

        <div className="infoBox">
          <div className="card">
            <h3>{t.topAlliances}</h3>
            <p>ETR / RIS3 / 0KK / PTHD</p>
            <span>{t.topText}</span>
          </div>

          <div className="card">
            <h3>{t.svs}</h3>
            <p>{t.svsText}</p>
            <span>{t.svsSub}</span>
          </div>

          <div className="card">
            <h3>{t.global}</h3>
            <p>{t.globalText}</p>
            <span>{t.globalSub}</span>
          </div>

          <div className="card">
            <h3>{t.season}</h3>
            <p>{t.seasonText}</p>
            <span>{t.seasonSub}</span>
          </div>
        </div>
      </section>

      <section id="apply" className="applySection">
        <h2>{t.application}</h2>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="name"
            placeholder={t.name}
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="server"
            placeholder={t.server}
            value={form.server}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="power"
            placeholder={t.power}
            value={form.power}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="alliance"
            placeholder={t.alliance}
            value={form.alliance}
            onChange={handleChange}
          />

          <select
            name="migration_grade"
            value={form.migration_grade}
            onChange={handleChange}
            required
          >
            <option value="">{t.grade}</option>
            <option value="Elite">Elite (특급)</option>
            <option value="Advanced">Advanced (고급)</option>
            <option value="Medium">Medium (중급)</option>
            <option value="Regular">Regular (일반)</option>
          </select>

          <textarea
            name="message"
            placeholder={t.message}
            value={form.message}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? t.submitting : t.submit}
          </button>
        </form>
      </section>

      <footer>
        © 2026 SERVER 198 MIGRATION
      </footer>

      <style jsx>{`
        .main {
          background: #050505;
          color: white;
          min-height: 100vh;
          font-family: Arial, sans-serif;
          overflow-x: hidden;
        }

        .languageBox {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 999;
          display: flex;
          gap: 8px;
        }

        .languageBox button {
          background: rgba(0, 0, 0, 0.75);
          color: white;
          border: 1px solid #ffd400;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .languageBox .activeLang {
          background: #ffd400;
          color: #000;
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

        .infoSection {
          padding: 60px 20px 100px;
          max-width: 1300px;
          margin: 0 auto;
        }

        h2 {
          text-align: center;
          font-size: 46px;
          margin-bottom: 45px;
          color: #ffd400;
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

        .applySection {
          padding: 30px 20px 100px;
          background: #101010;
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

        footer {
          text-align: center;
          padding: 45px;
          color: #777;
          border-top: 1px solid #222;
        }

        @media (max-width: 768px) {
          .languageBox {
            top: 10px;
            right: 10px;
          }

          .languageBox button {
            padding: 7px 10px;
            font-size: 12px;
          }

          .hero {
            height: 260px;
            background-size: contain;
            background-position: top center;
          }

          .infoSection {
            padding: 50px 16px 70px;
          }

          .applySection {
            padding: 20px 16px 70px;
          }

          h2 {
            font-size: 30px;
            margin-bottom: 30px;
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