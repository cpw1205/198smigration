"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [sortType, setSortType] = useState("newest");

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
      alert("Delete failed.");
      return;
    }

    setData((prev) => prev.filter((item) => item.id !== id));
    alert("Deleted successfully.");
  }

  function parsePower(power: string) {
    if (!power) return 0;

    const cleaned = String(power)
      .toLowerCase()
      .replace(/,/g, "")
      .replace(/ /g, "");

    if (cleaned.includes("b")) return parseFloat(cleaned) * 1000000000;
    if (cleaned.includes("m")) return parseFloat(cleaned) * 1000000;
    if (cleaned.includes("k")) return parseFloat(cleaned) * 1000;

    return Number(cleaned) || 0;
  }

  const filteredData = data
    .filter((item) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        item.name?.toLowerCase().includes(keyword) ||
        item.server?.toLowerCase().includes(keyword) ||
        item.power?.toLowerCase().includes(keyword) ||
        item.alliance?.toLowerCase().includes(keyword) ||
        item.migration_grade?.toLowerCase().includes(keyword) ||
        item.message?.toLowerCase().includes(keyword);

      const matchesGrade =
        gradeFilter === "" || item.migration_grade === gradeFilter;

      return matchesSearch && matchesGrade;
    })
    .sort((a, b) => {
      if (sortType === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }

      if (sortType === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }

      if (sortType === "power_high") {
        return parsePower(b.power) - parsePower(a.power);
      }

      if (sortType === "power_low") {
        return parsePower(a.power) - parsePower(b.power);
      }

      if (sortType === "name_asc") {
        return String(a.name).localeCompare(String(b.name));
      }

      if (sortType === "name_desc") {
        return String(b.name).localeCompare(String(a.name));
      }

      return 0;
    });

  if (!authorized) {
    return (
      <main style={mainStyle}>
        <div style={loginBoxStyle}>
          <h1 style={loginTitleStyle}>Admin Login</h1>

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

      <div style={topBarStyle}>
        <input
          type="text"
          placeholder="Search name, server, alliance, power..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="">All Grades</option>
          <option value="Elite">Elite (특급)</option>
          <option value="Advanced">Advanced (고급)</option>
          <option value="Medium">Medium (중급)</option>
          <option value="Regular">Regular (일반)</option>
        </select>

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          style={inputStyle}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="power_high">Power High → Low</option>
          <option value="power_low">Power Low → High</option>
          <option value="name_asc">Name A → Z</option>
          <option value="name_desc">Name Z → A</option>
        </select>
      </div>

      <p style={countStyle}>
        Showing {filteredData.length} / {data.length}
      </p>

      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Server</th>
              <th style={thStyle}>Power</th>
              <th style={thStyle}>Alliance</th>
              <th style={thStyle}>Grade</th>
              <th style={thStyle}>Message</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>{item.server}</td>
                <td style={tdStyle}>{item.power}</td>
                <td style={tdStyle}>{item.alliance}</td>
                <td style={tdStyle}>{item.migration_grade}</td>
                <td style={messageTdStyle}>{item.message}</td>
                <td style={tdStyle}>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : ""}
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={deleteButtonStyle}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan={8} style={emptyStyle}>
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const mainStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#0b0b0b",
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

const loginTitleStyle: React.CSSProperties = {
  color: "lime",
};

const titleStyle: React.CSSProperties = {
  color: "lime",
  marginBottom: "25px",
};

const topBarStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr",
  gap: "12px",
  marginBottom: "15px",
};

const inputStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: "8px",
  border: "1px solid #333",
  backgroundColor: "#111",
  color: "white",
  fontSize: "15px",
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

const countStyle: React.CSSProperties = {
  color: "#aaa",
  marginBottom: "15px",
};

const tableWrapStyle: React.CSSProperties = {
  width: "100%",
  overflowX: "auto",
  border: "1px solid #333",
  borderRadius: "12px",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1000px",
  backgroundColor: "#111",
};

const thStyle: React.CSSProperties = {
  borderBottom: "2px solid lime",
  padding: "14px",
  textAlign: "left",
  color: "lime",
  backgroundColor: "#161616",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  borderBottom: "1px solid #333",
  padding: "14px",
  color: "white",
  whiteSpace: "nowrap",
};

const messageTdStyle: React.CSSProperties = {
  borderBottom: "1px solid #333",
  padding: "14px",
  color: "white",
  minWidth: "250px",
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: "#ff3333",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

const emptyStyle: React.CSSProperties = {
  padding: "30px",
  textAlign: "center",
  color: "#aaa",
};