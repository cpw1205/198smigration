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
        "Server 198 is preparing for a new battlefield in Season 5.",
      intro2:
        "Strong alliances, organized leadership, active international players, and coordinated warfare await.",
      topAlliances: "MAIN ALLIANCES",
      topText:
        "Six active alliances working together for Server 198.",
      svs: "SVS ORGANIZATION",
      svsText:
        "Organized battle plans, capital operations, rally coordination, and tactical warfare.",
      svsSub:
        "Every alliance has battlefield roles and strategic objectives during SVS.",
      global: "GLOBAL COMMUNITY",
      globalText:
        "Active international players from multiple regions.",
      globalSub:
        "Daily activity, fast communication, and cooperative gameplay.",
      season: "SEASON 5",
      seasonText:
        "A new vampire-themed season begins.",
      seasonSub:
        "We are recruiting active and competitive players who want to fight and grow together.",
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
        "서버 198은 시즌5의 새로운 전장을 준비하고 있습니다.",
      intro2:
        "강력한 연맹, 체계적인 지휘, 활발한 글로벌 유저들과 함께 새로운 시즌을 준비합니다.",
      topAlliances: "주요 연맹",
      topText:
        "서버 198을 함께 이끌어가는 6개의 주요 연맹입니다.",
      svs: "SVS 조직력",
      svsText:
        "체계적인 전투 계획, 수도 운영, 랠리 조율 및 전략적인 전쟁 운영을 진행합니다.",
      svsSub:
        "각 연맹은 SVS에서 역할과 목표를 가지고 움직입니다.",
      global: "글로벌 커뮤니티",
      globalText:
        "여러 지역의 활발한 글로벌 유저들이 함께합니다.",
      globalSub:
        "빠른 소통과 협력적인 플레이 환경을 제공합니다.",
      season: "시즌5",
      seasonText:
        "뱀파이어 테마의 새로운 시즌이 시작됩니다.",
      seasonSub:
        "함께 전투하고 성장할 활발하고 경쟁력 있는 유저를 모집합니다.",
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

      {/* 언어 선택 */}
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

      {/* 메인 배경 */}
      <section className="hero" />

      {/* 서버 소개 */}
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

            <p className="alliances">
              ETR / NXTT / PTHD
              <br />
              FATL / ICC / Ady
            </p>

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

      {/* 신청서 */}
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

        * {
          box-sizing: border-box;
        }

        .main {
          background: #050507;
          color: white;
          min-height: 100vh;
          font-family: Arial, sans-serif;
          overflow-x: hidden;
        }


        /* ==============================
           LANGUAGE
        ============================== */

        .languageBox {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 999;
          display: flex;
          gap: 8px;
        }

        .languageBox button {
          background: rgba(5, 0, 8, 0.82);
          color: white;
          border: 1px solid #9d2439;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          backdrop-filter: blur(6px);
          box-shadow: none;
        }

        .languageBox .activeLang {
          background: #8f142b;
          border-color: #c7334d;
          color: white;
        }


        /* ==============================
           HERO - PC
        ============================== */

        .hero {
          width: 100%;

          /*
            PC에서는 기존처럼
            넓은 이미지를 최대한 크게 보여줌
          */
          height: min(820px, 56.25vw);

          background-image: url("/season5-bg.png");

          background-size: contain;

          background-position: top center;

          background-repeat: no-repeat;

          background-color: #050507;
        }


        /* ==============================
           INFORMATION
        ============================== */

        .infoSection {
          padding: 70px 20px 100px;
          max-width: 1300px;
          margin: 0 auto;
        }

        h2 {
          text-align: center;
          font-size: 46px;
          margin: 0 0 45px;
          color: #c7334d;
          letter-spacing: 1px;
          text-shadow:
            0 0 10px rgba(150, 20, 45, 0.55),
            0 0 25px rgba(110, 0, 20, 0.3);
        }

        .mainText {
          text-align: center;
          color: #d2ced3;
          line-height: 1.9;
          font-size: 21px;
          max-width: 900px;
          margin: 0 auto 70px;
        }

        .infoBox {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(280px, 1fr));

          gap: 28px;
        }

        .card {
          background:
            linear-gradient(
              145deg,
              rgba(27, 19, 28, 0.98),
              rgba(12, 10, 14, 0.98)
            );

          padding: 38px;

          border-radius: 18px;

          border: 1px solid rgba(160, 35, 60, 0.45);

          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.5),
            inset 0 0 25px rgba(110, 0, 30, 0.08);
        }

        .card h3 {
          color: #d54a60;
          margin: 0 0 18px;
          font-size: 24px;
        }

        .card p {
          font-size: 18px;
          line-height: 1.8;
          margin: 0 0 20px;
          color: white;
        }

        .card .alliances {
          font-weight: bold;
          line-height: 2;
          color: #ffffff;
        }

        .card span {
          color: #aaa5ab;
          line-height: 1.7;
          font-size: 15px;
        }


        /* ==============================
           APPLICATION
        ============================== */

        .applySection {
          padding: 45px 20px 100px;

          background:
            linear-gradient(
              180deg,
              #0b090c 0%,
              #11090d 100%
            );

          border-top:
            1px solid rgba(120, 25, 45, 0.3);
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
          width: 100%;

          padding: 17px;

          border-radius: 12px;

          border:
            1px solid rgba(130, 45, 60, 0.45);

          background: #181217;

          color: white;

          font-size: 16px;

          outline: none;

          transition: 0.2s;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #bd324b;

          box-shadow:
            0 0 0 2px rgba(165, 35, 60, 0.16);
        }

        input::placeholder,
        textarea::placeholder {
          color: #817981;
        }

        textarea {
          min-height: 160px;
          resize: vertical;
        }

        .form button {
          background:
            linear-gradient(
              135deg,
              #841329,
              #c02e47
            );

          color: white;

          padding: 17px;

          border: 1px solid #d34b61;

          border-radius: 12px;

          font-weight: bold;

          font-size: 17px;

          cursor: pointer;

          transition: 0.2s;

          box-shadow:
            0 7px 25px rgba(115, 0, 25, 0.35);
        }

        .form button:hover {
          transform: translateY(-1px);

          box-shadow:
            0 9px 28px rgba(150, 0, 35, 0.45);
        }

        .form button:disabled {
          opacity: 0.6;
          cursor: default;
        }


        /* ==============================
           FOOTER
        ============================== */

        footer {
          text-align: center;

          padding: 45px 20px;

          color: #686168;

          border-top:
            1px solid rgba(100, 30, 45, 0.2);

          background: #070608;
        }


        /* =====================================
           TABLET
        ===================================== */

        @media (max-width: 1024px) {

          .hero {
            height: 57vw;

            background-size: contain;

            background-position:
              center top;
          }

        }


        /* =====================================
           MOBILE
           ★ 이번에 중요한 수정 부분
        ===================================== */

        @media (max-width: 768px) {

          .languageBox {
            top: 10px;
            right: 10px;
          }

          .languageBox button {
            padding: 7px 10px;
            font-size: 12px;
          }


          /*
            기존 260px 고정 높이를 없앰.

            휴대폰 화면 폭에 따라
            이미지 비율이 자동으로 유지됨.
          */

          .hero {

            width: 100%;

            height: 72vw;

            min-height: 290px;

            max-height: 430px;

            background-image:
              url("/season5-bg.png");

            background-size:
              contain;

            background-repeat:
              no-repeat;

            background-position:
              center top;

            background-color:
              #050507;
          }


          .infoSection {
            padding:
              45px 16px 70px;
          }

          .applySection {
            padding:
              30px 16px 70px;
          }

          h2 {
            font-size: 30px;

            margin-bottom:
              30px;
          }

          .mainText {
            font-size: 16px;

            line-height: 1.8;

            margin-bottom:
              45px;
          }

          .infoBox {
            grid-template-columns:
              1fr;

            gap: 18px;
          }

          .card {
            padding: 27px 24px;
          }

          .card h3 {
            font-size: 21px;
          }

          .card p {
            font-size: 16px;
          }

          input,
          select,
          textarea {
            font-size: 16px;
          }

        }


        /* =====================================
           SMALL PHONE
        ===================================== */

        @media (max-width: 480px) {

          .hero {

            height: 78vw;

            min-height: 280px;

            max-height: 360px;

            background-size:
              contain;

            background-position:
              center top;
          }

          .infoSection {
            padding-top: 35px;
          }

          h2 {
            font-size: 27px;
          }

          .card {
            padding:
              24px 20px;
          }

        }

      `}</style>

    </main>
  );
}
