"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [lang, setLang] = useState<"en" | "ko">("en");

  const [form, setForm] = useState({
    name: "",
    server: "",
    power: "",
    alliance: "",
    migration_grade: "",
    t10: false,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  // Anti-bot protection
  const [formToken, setFormToken] = useState("");
  const [honeypot, setHoneypot] = useState("");

  async function loadFormToken() {
    try {
      const response = await fetch("/api/form-token", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.token) {
        console.error("Failed to load form token:", result);
        setFormToken("");
        return;
      }

      setFormToken(result.token);
    } catch (error) {
      console.error("Form token error:", error);
      setFormToken("");
    }
  }

  useEffect(() => {
    loadFormToken();
  }, []);
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  return () => {
    document.head.removeChild(script);
  };
}, []);
  
  const [popup, setPopup] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  const t = {
    en: {
      why: "WHY SERVER 198?",

      intro:
        "Server 198 is preparing for the darkness of Season 5.",

      intro2:
        "Powerful alliances, organized leadership, active global players, and coordinated warfare await you.",

      topAlliances: "MAIN ALLIANCES",

      topText:
        "ETR, NXTT, PTHD, FATL, ICC and Ady stand together as the main forces of Server 198.",

      svs: "SVS ORGANIZATION",

      svsText:
        "Organized battle plans, capital warfare, rally coordination, and strategic combat.",

      svsSub:
        "Our alliances cooperate with clear battlefield roles and coordinated objectives.",

      global: "GLOBAL COMMUNITY",

      globalText:
        "An active international community with players from multiple regions.",

      globalSub:
        "Fast communication, daily activity, teamwork, and long-term growth.",

      season: "SEASON 5 — VAMPIRE AWAKENING",

      seasonText:
        "When darkness falls, Server 198 rises.",

      seasonSub:
        "Prepare for the vampire battlefield and fight together with Server 198.",

      application: "MIGRATION APPLICATION",

      name: "Nickname",

      server: "Current Server",

      power: "1st Army Power",

      alliance: "Current Alliance",

      grade: "Select Migration Grade",

      t10: "T10 Available",

      message: "Introduce yourself",

      submit: "SUBMIT APPLICATION",

      submitting: "SUBMITTING...",

      success: "SUCCESS!",

      failed: "SUBMISSION FAILED",
    },

    ko: {
      why: "왜 서버 198인가?",

      intro:
        "서버 198은 어둠이 지배하는 시즌5의 전장을 준비하고 있습니다.",

      intro2:
        "강력한 연맹, 체계적인 지휘, 활발한 글로벌 유저와 조직적인 전쟁 시스템이 여러분을 기다리고 있습니다.",

      topAlliances: "주요 연맹",

      topText:
        "ETR, NXTT, PTHD, FATL, ICC, Ady가 서버 198의 주요 전력으로 함께하고 있습니다.",

      svs: "SVS 조직력",

      svsText:
        "체계적인 전투 계획, 수도전, 랠리 조율과 전략적인 전쟁 운영을 진행합니다.",

      svsSub:
        "각 연맹은 명확한 역할과 목표를 가지고 하나의 서버로 움직입니다.",

      global: "글로벌 커뮤니티",

      globalText:
        "여러 지역의 활발한 글로벌 유저들이 함께하고 있습니다.",

      globalSub:
        "빠른 소통과 높은 활동률, 협력적인 플레이 환경을 제공합니다.",

      season: "시즌5 — 뱀파이어의 각성",

      seasonText:
        "어둠이 내려오면, 서버 198이 깨어납니다.",

      seasonSub:
        "뱀파이어의 전장을 준비하고 서버 198과 함께 시즌5를 싸워나가세요.",

      application: "이민 신청서",

      name: "닉네임",

      server: "현재 서버",

      power: "1군 전투력",

      alliance: "현재 연맹",

      grade: "이민 등급 선택",

      t10: "T10 여부",

      message: "자기소개",

      submit: "신청하기",

      submitting: "신청 중...",

      success: "신청 완료!",

      failed: "신청 실패",
    },
  }[lang];

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const target = e.target;

    setForm({
      ...form,
      [target.name]:
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : target.value,
    });
  }

  function showPopup(
    type: "success" | "error",
    message: string
  ) {
    setPopup({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setPopup((prev) => ({
        ...prev,
        show: false,
      }));
    }, 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    if (!formToken) {
      showPopup("error", t.failed);
      await loadFormToken();
      return;
    }
if (!turnstileToken) {
  showPopup(
    "error",
    lang === "ko"
      ? "사람 인증을 완료해주세요."
      : "Please complete the human verification."
  );
  return;
}
    setLoading(true);

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          server: form.server,
          power: form.power,
          alliance: form.alliance,
          migration_grade: form.migration_grade,
          t10: form.t10,
          message: form.message,
          form_token: formToken,
          website: honeypot,
          turnstile_token: turnstileToken,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Application submission failed:", result);
        showPopup("error", t.failed);
        return;
      }

      showPopup("success", t.success);

      setForm({
        name: "",
        server: "",
        power: "",
        alliance: "",
        migration_grade: "",
        t10: false,
        message: "",
      });

      setHoneypot("");
      await loadFormToken();
    } catch (error) {
      console.error("Application submission error:", error);
      showPopup("error", t.failed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main">

      {popup.show && (
        <div className="popupOverlay">
          <div
            className={`customPopup ${
              popup.type === "success"
                ? "successPopup"
                : "errorPopup"
            }`}
          >
            <div className="popupIcon">
              {popup.type === "success" ? "✓" : "!"}
            </div>

            <div className="popupMessage">
              {popup.message}
            </div>
          </div>
        </div>
      )}

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

      <section className="hero">
        <div className="heroShade"></div>

        <div className="heroContent">
          <div className="seasonLabel">
            SEASON 5
          </div>

          <h1>
            SERVER 198
          </h1>

          <div className="heroDivider"></div>

          <h3>
            VAMPIRE AWAKENING
          </h3>

          <p>
            {lang === "en"
              ? "THE NIGHT AWAKENS"
              : "어둠이 깨어난다"}
          </p>

          <a href="#apply" className="heroButton">
            {lang === "en"
              ? "JOIN SERVER 198"
              : "서버 198 합류하기"}
          </a>
        </div>
      </section>

      <section className="infoSection">

        <div className="sectionSymbol">
          ◆
        </div>

        <h2>
          {t.why}
        </h2>

        <p className="mainText">
          {t.intro}
          <br />
          {t.intro2}
        </p>

        <div className="infoBox">

          <div className="card allianceCard">
            <div className="cardIcon">
              ♛
            </div>

            <h3>
              {t.topAlliances}
            </h3>

            <p className="allianceNames">
              ETR
              <span className="separator"> / </span>
              NXTT
              <span className="separator"> / </span>
              PTHD
              <span className="separator"> / </span>
              FATL
              <span className="separator"> / </span>
              ICC
              <span className="separator"> / </span>
              Ady
            </p>

            <span>
              {t.topText}
            </span>
          </div>

          <div className="card">
            <div className="cardIcon">
              ⚔
            </div>

            <h3>
              {t.svs}
            </h3>

            <p>
              {t.svsText}
            </p>

            <span>
              {t.svsSub}
            </span>
          </div>

          <div className="card">
            <div className="cardIcon">
              ◉
            </div>

            <h3>
              {t.global}
            </h3>

            <p>
              {t.globalText}
            </p>

            <span>
              {t.globalSub}
            </span>
          </div>

          <div className="card seasonCard">
            <div className="cardIcon vampireIcon">
              ◆
            </div>

            <h3>
              {t.season}
            </h3>

            <p>
              {t.seasonText}
            </p>

            <span>
              {t.seasonSub}
            </span>
          </div>

        </div>
      </section>

      <section className="allianceSection">

        <div className="sectionSymbol">
          ◆
        </div>

        <h2>
          {lang === "en"
            ? "MAIN ALLIANCES OF SERVER 198"
            : "서버 198 주요 연맹"}
        </h2>

        <p className="allianceIntro">
          {lang === "en"
            ? "Six alliances. One battlefield. One Server."
            : "여섯 개의 연맹, 하나의 전장, 하나의 서버."}
        </p>

        <div className="allianceGrid">

          <div className="allianceBox">
            <div className="allianceLogo">
              E
            </div>

            <h3>
              ETR
            </h3>

            <p>
              {lang === "en"
                ? "MAIN ALLIANCE"
                : "주요 연맹"}
            </p>
          </div>

          <div className="allianceBox">
            <div className="allianceLogo">
              N
            </div>

            <h3>
              NXTT
            </h3>

            <p>
              {lang === "en"
                ? "MAIN ALLIANCE"
                : "주요 연맹"}
            </p>
          </div>

          <div className="allianceBox">
            <div className="allianceLogo">
              P
            </div>

            <h3>
              PTHD
            </h3>

            <p>
              {lang === "en"
                ? "MAIN ALLIANCE"
                : "주요 연맹"}
            </p>
          </div>

          <div className="allianceBox">
            <div className="allianceLogo">
              F
            </div>

            <h3>
              FATL
            </h3>

            <p>
              {lang === "en"
                ? "MAIN ALLIANCE"
                : "주요 연맹"}
            </p>
          </div>

          <div className="allianceBox">
            <div className="allianceLogo">
              I
            </div>

            <h3>
              ICC
            </h3>

            <p>
              {lang === "en"
                ? "MAIN ALLIANCE"
                : "주요 연맹"}
            </p>
          </div>

          <div className="allianceBox">
            <div className="allianceLogo">
              A
            </div>

            <h3>
              Ady
            </h3>

            <p>
              {lang === "en"
                ? "MAIN ALLIANCE"
                : "주요 연맹"}
            </p>
          </div>

        </div>
      </section>

      <section
        id="apply"
        className="applySection"
      >

        <div className="sectionSymbol">
          ◆
        </div>

        <h2>
          {t.application}
        </h2>

        <p className="applicationIntro">
          {lang === "en"
            ? "Enter the darkness. Join Server 198."
            : "어둠 속 새로운 전장, 서버 198과 함께하세요."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="form"
        >

          {/* Anti-bot honeypot: real users never see or fill this field */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-10000px",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

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
            <option value="">
              {t.grade}
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

          <label className="checkboxRow">
            <input
              type="checkbox"
              name="t10"
              checked={form.t10}
              onChange={handleChange}
            />

            <span>{t.t10}</span>
          </label>

          <textarea
            name="message"
            placeholder={t.message}
            value={form.message}
            onChange={handleChange}
          />
<div
  className="cf-turnstile"
  data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
  data-callback={(token: string) => setTurnstileToken(token)}
  data-expired-callback={() => setTurnstileToken("")}
  data-error-callback={() => setTurnstileToken("")}
/>
          <button
            type="submit"
            disabled={loading}
            className="submitButton"
          >
            {loading
              ? t.submitting
              : t.submit}
          </button>

        </form>
      </section>

      <footer>

        <div className="footerTitle">
          SERVER 198
        </div>

        <div className="footerSeason">
          SEASON 5 — VAMPIRE AWAKENING
        </div>

        <div className="footerAlliances">
          ETR • NXTT • PTHD • FATL • ICC • Ady
        </div>

        <div className="copyright">
          © 2026 SERVER 198 MIGRATION
        </div>

      </footer>

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        .main {
          background:
            radial-gradient(
              circle at top,
              #200309 0%,
              #090204 38%,
              #030102 100%
            );

          color: #f8eeee;
          min-height: 100vh;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          overflow-x: hidden;
        }

        .popupOverlay {
          position: fixed;
          top: 0;
          left: 0;

          width: 100%;
          height: 100%;

          background:
            rgba(0, 0, 0, 0.78);

          display: flex;
          justify-content: center;
          align-items: center;

          z-index: 99999;

          backdrop-filter:
            blur(5px);

          animation:
            fadeIn 0.2s ease;
        }

        .customPopup {
          width: 320px;

          padding:
            38px 30px;

          background:
            linear-gradient(
              145deg,
              #18060a,
              #080203
            );

          border-radius: 20px;
          text-align: center;

          box-shadow:
            0 0 35px
            rgba(190, 20, 45, 0.4);

          animation:
            popupIn 0.25s ease;
        }

        .successPopup {
          border:
            2px solid
            #b51632;
        }

        .errorPopup {
          border:
            2px solid
            #ff435a;
        }

        .popupIcon {
          width: 70px;
          height: 70px;

          margin:
            0 auto 20px;

          border-radius:
            50%;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 42px;
          font-weight: bold;

          color:
            white;

          background:
            linear-gradient(
              135deg,
              #700716,
              #c71c38
            );

          box-shadow:
            0 0 25px
            rgba(190, 25, 50, 0.6);
        }

        .errorPopup .popupIcon {
          background:
            #ff435a;

          color:
            white;
        }

        .popupMessage {
          color:
            #ef3451;

          font-size:
            23px;

          font-weight:
            bold;

          letter-spacing:
            1px;
        }

        .errorPopup .popupMessage {
          color:
            #ff6577;
        }

        @keyframes fadeIn {

          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }

        }

        @keyframes popupIn {

          from {
            opacity: 0;

            transform:
              scale(0.8);
          }

          to {
            opacity: 1;

            transform:
              scale(1);
          }

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
          background:
            rgba(5, 0, 2, 0.8);

          color:
            #e8d9dc;

          border:
            1px solid
            #761222;

          padding:
            8px 14px;

          border-radius:
            8px;

          cursor:
            pointer;

          font-weight:
            bold;

          box-shadow:
            none;
        }

        .languageBox button:hover {
          border-color:
            #d92746;
        }

        .languageBox .activeLang {
          background:
            linear-gradient(
              135deg,
              #700716,
              #b81430
            );

          border-color:
            #d72a47;

          color:
            white;

          box-shadow:
            0 0 15px
            rgba(190, 20, 45, 0.4);
        }

        .hero {
          width: 100%;
          height: 820px;

          position: relative;

          display: flex;
          justify-content: center;
          align-items: center;

          text-align: center;

          background-image:
            url("/season5-bg.png");

          background-size:
            contain;

          background-position:
            top center;

          background-repeat:
            no-repeat;

          background-color:
            #030102;

          overflow:
            hidden;
        }

        .heroShade {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.05) 0%,
              rgba(5, 0, 2, 0.12) 55%,
              rgba(3, 1, 2, 0.95) 100%
            );

          pointer-events:
            none;
        }

        .heroContent {
          position: relative;

          z-index: 2;

          margin-top:
            60px;

          padding:
            30px;

          text-shadow:
            0 3px 15px
            rgba(0, 0, 0, 1);
        }

        .seasonLabel {
          display:
            inline-block;

          color:
            #ef3956;

          border-top:
            1px solid
            #a61a32;

          border-bottom:
            1px solid
            #a61a32;

          padding:
            8px 30px;

          letter-spacing:
            8px;

          font-size:
            18px;

          font-weight:
            bold;

          margin-bottom:
            20px;
        }

        .hero h1 {
          margin: 0;

          font-size:
            82px;

          letter-spacing:
            8px;

          font-weight:
            900;

          color:
            #ffffff;

          text-shadow:
            0 0 15px
            rgba(0, 0, 0, 1),
            0 0 30px
            rgba(130, 0, 20, 0.5);
        }

        .heroDivider {
          height:
            2px;

          width:
            150px;

          margin:
            22px auto;

          background:
            linear-gradient(
              90deg,
              transparent,
              #c81737,
              transparent
            );

          box-shadow:
            0 0 12px
            rgba(200, 20, 55, 0.7);
        }

        .hero h3 {
          margin:
            0 0 15px;

          color:
            #df2948;

          font-size:
            29px;

          letter-spacing:
            7px;

          font-weight:
            700;
        }

        .heroContent p {
          color:
            #e7d5d8;

          font-size:
            19px;

          letter-spacing:
            4px;

          margin:
            0 0 35px;
        }

        .heroButton {
          display:
            inline-block;

          color:
            white;

          text-decoration:
            none;

          padding:
            15px 32px;

          border:
            1px solid
            #b51b35;

          background:
            linear-gradient(
              135deg,
              rgba(80, 5, 18, 0.9),
              rgba(160, 15, 42, 0.9)
            );

          border-radius:
            8px;

          font-size:
            15px;

          font-weight:
            bold;

          letter-spacing:
            2px;

          box-shadow:
            0 0 20px
            rgba(180, 15, 45, 0.35);

          transition:
            0.25s;
        }

        .heroButton:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 0 30px
            rgba(210, 25, 55, 0.55);
        }

        .sectionSymbol {
          text-align:
            center;

          color:
            #a91531;

          margin-bottom:
            13px;

          font-size:
            18px;

          text-shadow:
            0 0 12px
            rgba(200, 20, 50, 0.8);
        }

        h2 {
          text-align:
            center;

          font-size:
            43px;

          margin-top:
            0;

          margin-bottom:
            35px;

          color:
            #e5314e;

          letter-spacing:
            2px;

          text-shadow:
            0 0 18px
            rgba(150, 15, 40, 0.3);
        }

        .infoSection {
          padding:
            75px 20px 110px;

          max-width:
            1300px;

          margin:
            0 auto;
        }

        .mainText {
          text-align:
            center;

          color:
            #c9b9bc;

          line-height:
            1.9;

          font-size:
            20px;

          max-width:
            920px;

          margin:
            0 auto 70px;
        }

        .infoBox {
          display:
            grid;

          grid-template-columns:
            repeat(
              auto-fit,
              minmax(260px, 1fr)
            );

          gap:
            25px;
        }

        .card {
          position:
            relative;

          background:
            linear-gradient(
              145deg,
              #130608,
              #090304
            );

          padding:
            35px;

          border-radius:
            15px;

          border:
            1px solid
            #351017;

          box-shadow:
            0 8px 30px
            rgba(0, 0, 0, 0.35);

          overflow:
            hidden;

          transition:
            transform 0.25s,
            border-color 0.25s,
            box-shadow 0.25s;
        }

        .card:before {
          content:
            "";

          position:
            absolute;

          top: 0;
          left: 0;

          height:
            2px;

          width:
            100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              #9c1029,
              transparent
            );
        }

        .card:hover {
          transform:
            translateY(-5px);

          border-color:
            #711629;

          box-shadow:
            0 12px 35px
            rgba(130, 0, 25, 0.2);
        }

        .cardIcon {
          color:
            #a91d35;

          font-size:
            30px;

          margin-bottom:
            18px;

          text-shadow:
            0 0 15px
            rgba(190, 20, 50, 0.6);
        }

        .card h3 {
          color:
            #e32d4b;

          margin:
            0 0 18px;

          font-size:
            22px;
        }

        .card p {
          font-size:
            17px;

          line-height:
            1.8;

          margin-bottom:
            18px;

          color:
            #f1e5e7;
        }

        .card span {
          color:
            #a9999c;

          line-height:
            1.7;

          font-size:
            15px;
        }

        .allianceNames {
          font-size:
            22px !important;

          font-weight:
            800;

          letter-spacing:
            1px;

          color:
            white !important;
        }

        .separator {
          color:
            #8d1b2d !important;
        }

        .allianceSection {
          padding:
            90px 20px 110px;

          background:
            linear-gradient(
              to bottom,
              #070203,
              #100407,
              #070203
            );

          border-top:
            1px solid
            #21080e;

          border-bottom:
            1px solid
            #21080e;
        }

        .allianceIntro {
          text-align:
            center;

          color:
            #aa979b;

          font-size:
            18px;

          margin:
            -10px auto 55px;
        }

        .allianceGrid {
          max-width:
            1000px;

          margin:
            0 auto;

          display:
            grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap:
            28px;
        }

        .allianceBox {
          text-align:
            center;

          padding:
            38px 20px;

          border:
            1px solid
            #3b111b;

          border-radius:
            15px;

          background:
            linear-gradient(
              145deg,
              rgba(25, 6, 10, 0.95),
              rgba(8, 2, 4, 0.95)
            );

          box-shadow:
            0 0 25px
            rgba(90, 0, 20, 0.15);

          transition:
            0.25s;
        }

        .allianceBox:hover {
          transform:
            translateY(-6px);

          border-color:
            #971a31;

          box-shadow:
            0 0 30px
            rgba(140, 10, 35, 0.25);
        }

        .allianceLogo {
          width:
            75px;

          height:
            75px;

          margin:
            0 auto 20px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            50%;

          border:
            2px solid
            #8f1930;

          color:
            #f5dfe3;

          font-weight:
            900;

          font-size:
            30px;

          background:
            radial-gradient(
              circle,
              #4f0715,
              #100306
            );

          box-shadow:
            0 0 25px
            rgba(150, 10, 35, 0.35);
        }

        .allianceBox h3 {
          margin:
            0 0 8px;

          color:
            #eb3854;

          font-size:
            29px;

          letter-spacing:
            3px;
        }

        .allianceBox p {
          margin:
            0;

          color:
            #9b8b8e;

          font-size:
            14px;

          text-transform:
            uppercase;

          letter-spacing:
            2px;
        }

        .applySection {
          padding:
            85px 20px 110px;

          background:
            radial-gradient(
              circle at top,
              #150408,
              #050203 55%
            );
        }

        .applicationIntro {
          text-align:
            center;

          color:
            #aa969a;

          font-size:
            17px;

          margin:
            -10px 0 45px;
        }

        .form {
          max-width:
            720px;

          margin:
            0 auto;

          display:
            flex;

          flex-direction:
            column;

          gap:
            19px;

          padding:
            38px;

          background:
            rgba(13, 4, 6, 0.85);

          border:
            1px solid
            #351019;

          border-radius:
            18px;

          box-shadow:
            0 15px 45px
            rgba(0, 0, 0, 0.45);
        }

        input,
        select,
        textarea {
          width:
            100%;

          padding:
            17px;

          border-radius:
            9px;

          border:
            1px solid
            #351218;

          background:
            #10070a;

          color:
            #f8eeee;

          font-size:
            16px;

          outline:
            none;

          transition:
            border-color 0.2s,
            box-shadow 0.2s;
        }

        input::placeholder,
        textarea::placeholder {
          color:
            #79696d;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color:
            #a11b33;

          box-shadow:
            0 0 12px
            rgba(170, 20, 45, 0.18);
        }

        select {
          color:
            #bbaaac;
        }

        .checkboxRow {
          display: flex;
          align-items: center;
          gap: 12px;

          padding: 14px 16px;

          border:
            1px solid
            #351218;

          background:
            #10070a;

          border-radius:
            9px;

          color:
            #d8c5c9;

          font-size:
            15px;

          cursor:
            pointer;
        }

        .checkboxRow input {
          width: 19px;
          height: 19px;
          margin: 0;

          accent-color:
            #b81734;

          cursor:
            pointer;
        }

        .checkboxRow span {
          font-weight:
            700;

          letter-spacing:
            0.5px;
        }

        textarea {
          min-height:
            160px;

          resize:
            vertical;
        }

        .submitButton {
          background:
            linear-gradient(
              135deg,
              #650613,
              #bd1835
            );

          color:
            white;

          padding:
            17px;

          border:
            1px solid
            #d02947;

          border-radius:
            9px;

          font-weight:
            800;

          font-size:
            16px;

          letter-spacing:
            1.5px;

          cursor:
            pointer;

          box-shadow:
            0 0 20px
            rgba(165, 15, 40, 0.32);

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .submitButton:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 0 28px
            rgba(200, 20, 50, 0.45);
        }

        .submitButton:disabled {
          opacity:
            0.65;

          cursor:
            default;

          transform:
            none;
        }

        footer {
          text-align:
            center;

          padding:
            55px 20px;

          background:
            #030102;

          border-top:
            1px solid
            #260910;
        }

        .footerTitle {
          color:
            #e33250;

          font-size:
            23px;

          font-weight:
            900;

          letter-spacing:
            5px;

          margin-bottom:
            8px;
        }

        .footerSeason {
          color:
            #8d747a;

          font-size:
            12px;

          letter-spacing:
            2px;

          margin-bottom:
            16px;
        }

        .footerAlliances {
          color:
            #c29ca4;

          font-size:
            14px;

          letter-spacing:
            2px;

          margin-bottom:
            28px;
        }

        .copyright {
          color:
            #55494c;

          font-size:
            12px;
        }

        @media (max-width: 768px) {

          .languageBox {
            top: 10px;
            right: 10px;
            gap: 6px;
          }

          .languageBox button {
            padding: 7px 11px;
            font-size: 12px;
            border-radius: 7px;
          }

          .hero {
            width: 100%;
            height: auto;
            aspect-ratio: 1.47 / 1;

            background-size: cover;
            background-position: center top;
            background-repeat: no-repeat;

            align-items: center;
            overflow: hidden;
          }

          .heroShade {
            background:
              linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.03) 0%,
                rgba(5, 0, 2, 0.08) 55%,
                rgba(3, 1, 2, 0.42) 100%
              );
          }

          .heroContent {
            display: block;
            width: 100%;
            margin-top: 34px;
            padding: 16px 12px 10px;

            transform: scale(0.82);
            transform-origin: center center;
          }

          .seasonLabel {
            padding: 5px 18px;
            letter-spacing: 5px;
            font-size: 11px;
            margin-bottom: 10px;
          }

          .hero h1 {
            font-size: clamp(34px, 10vw, 46px);
            letter-spacing: 4px;
          }

          .heroDivider {
            width: 95px;
            margin: 12px auto;
          }

          .hero h3 {
            margin: 0 0 8px;
            font-size: clamp(14px, 4.1vw, 18px);
            letter-spacing: 3px;
          }

          .heroContent p {
            font-size: 10px;
            letter-spacing: 2px;
            margin: 0 0 14px;
          }

          .heroButton {
            padding: 10px 18px;
            border-radius: 7px;
            font-size: 10px;
            letter-spacing: 1px;
          }

          .infoSection {
            padding: 45px 16px 70px;
          }

          h2 {
            font-size: 29px;
            margin-bottom: 28px;
          }

          .mainText {
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 45px;
          }

          .infoBox {
            grid-template-columns: 1fr;
          }

          .card {
            padding: 28px;
          }

          .card h3 {
            font-size: 20px;
          }

          .card p {
            font-size: 16px;
          }

          .allianceNames {
            font-size: 19px !important;
          }

          .allianceSection {
            padding: 65px 16px 75px;
          }

          .allianceGrid {
            grid-template-columns: 1fr;
            max-width: 420px;
          }

          .allianceBox {
            padding: 28px 20px;
          }

          .allianceLogo {
            width: 65px;
            height: 65px;
            font-size: 25px;
          }

          .applySection {
            padding: 60px 16px 75px;
          }

          .form {
            padding: 25px 18px;
            gap: 16px;
          }

          .customPopup {
            width: 260px;
            padding: 32px 20px;
          }

          .popupIcon {
            width: 60px;
            height: 60px;
            font-size: 36px;
          }

          .popupMessage {
            font-size: 20px;
          }
        }

        @media (
          min-width: 769px
        ) and (
          max-width: 1200px
        ) {

          .hero {
            height:
              650px;
          }

          .hero h1 {
            font-size:
              65px;
          }

          .allianceGrid {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

      `}</style>

    </main>
  );
}
