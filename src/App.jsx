import { useState } from "react";

const METRICS = {
  baseline: [
    {
      id: "revenueGrowth",
      label: "Revenue Growth",
      unit: "%",
      direction: "high",
      weight: 8,
      group: "baseline",
      tip: "YoY revenue increase. Look for >20% in NGX growth stocks. Sustained growth over 3 quarters is a stronger signal than a one-off spike.",
      benchmark: { poor: 5, fair: 15, good: 25, great: 40 },
    },
    {
      id: "earningsGrowth",
      label: "Earnings (PAT) Growth",
      unit: "%",
      direction: "high",
      weight: 9,
      group: "baseline",
      tip: "Year-on-year growth in profit after tax. >30% is strong on the NGX. Cross-check that it's not a one-time gain from FX revaluation or asset sales.",
      benchmark: { poor: 0, fair: 15, good: 30, great: 50 },
    },
    {
      id: "operatingMargin",
      label: "Operating Margin",
      unit: "%",
      direction: "high",
      weight: 8,
      group: "baseline",
      tip: "Operating profit as % of revenue. Dangote Cement runs ~40%+. Higher = more pricing power and cost discipline. Declining margins despite revenue growth is a red flag.",
      benchmark: { poor: 5, fair: 15, good: 25, great: 40 },
    },
    {
      id: "pe",
      label: "Price-to-Earnings (P/E)",
      unit: "x",
      direction: "low",
      weight: 7,
      group: "baseline",
      tip: "NGX banks trade at 1–3x, telecoms at 4–8x, consumer goods at 8–15x. Context matters — a low P/E in a declining sector is a value trap. Compare within the same sector.",
      benchmark: { poor: 25, fair: 15, good: 8, great: 3 },
    },
    {
      id: "pb",
      label: "Price-to-Book (P/B)",
      unit: "x",
      direction: "low",
      weight: 6,
      group: "baseline",
      tip: "P/B < 1 means the market values the company below its net assets — deep value territory. Access Holdings traded at 0.31x in early 2026. Best used for asset-heavy sectors (banks, cement).",
      benchmark: { poor: 5, fair: 2.5, good: 1.2, great: 0.5 },
    },
    {
      id: "ps",
      label: "Price-to-Sales (P/S)",
      unit: "x",
      direction: "low",
      weight: 5,
      group: "baseline",
      tip: "Useful when earnings are negative or distorted. P/S < 1 is generally cheap. Great for early-stage or turnaround NGX companies where earnings haven't caught up to revenue yet.",
      benchmark: { poor: 4, fair: 2, good: 1, great: 0.4 },
    },
  ],
  edge: [
    {
      id: "peg",
      label: "PEG Ratio",
      unit: "x",
      direction: "low",
      weight: 9,
      group: "edge",
      tip: "P/E divided by earnings growth rate. PEG < 1 = undervalued relative to growth. This is the single most powerful combo metric. PEG of 0.5x on a 40% grower is elite. Stanbic IBTC ~0.04x in Q1 2026.",
      benchmark: { poor: 3, fair: 1.5, good: 0.8, great: 0.3 },
    },
    {
      id: "evEbitda",
      label: "EV / EBITDA",
      unit: "x",
      direction: "low",
      weight: 8,
      group: "edge",
      tip: "Enterprise Value to EBITDA. Better than P/E for capital-intensive sectors (cement, telecoms, oil & gas). Strips out debt and tax distortions. < 5x is attractive on the NGX.",
      benchmark: { poor: 15, fair: 10, good: 6, great: 3 },
    },
    {
      id: "fcfYield",
      label: "Free Cash Flow Yield",
      unit: "%",
      direction: "high",
      weight: 9,
      group: "edge",
      tip: "FCF / Market Cap. High FCF yield = the company is generating real cash, not just accounting profit. This is your protection against earnings manipulation. >8% is compelling.",
      benchmark: { poor: 1, fair: 4, good: 8, great: 15 },
    },
    {
      id: "roe",
      label: "Return on Equity (ROE)",
      unit: "%",
      direction: "high",
      weight: 8,
      group: "edge",
      tip: "Net income / Shareholders equity. Measures management's efficiency with your capital. Look for >20% sustained over 3+ years — that's a durable competitive advantage (moat signal).",
      benchmark: { poor: 5, fair: 12, good: 20, great: 30 },
    },
    {
      id: "roic",
      label: "Return on Invested Capital (ROIC)",
      unit: "%",
      direction: "high",
      weight: 8,
      group: "edge",
      tip: "ROIC > WACC = value creation. The best NGX compounders (MTN, Dangote) consistently earn ROIC > 20%. This is Warren Buffett's favourite metric — it reveals true economic moats.",
      benchmark: { poor: 5, fair: 10, good: 18, great: 28 },
    },
    {
      id: "debtEquity",
      label: "Debt-to-Equity (D/E)",
      unit: "x",
      direction: "low",
      weight: 7,
      group: "edge",
      tip: "Critical in Nigeria's high-interest-rate environment (CBN rates 26%+). D/E > 2x is dangerous when borrowing costs are high. Low-debt companies survive rate shocks that destroy over-leveraged peers.",
      benchmark: { poor: 3, fair: 1.5, good: 0.8, great: 0.2 },
    },
    {
      id: "interestCoverage",
      label: "Interest Coverage Ratio",
      unit: "x",
      direction: "high",
      weight: 7,
      group: "edge",
      tip: "EBIT / Interest expense. Tells you how comfortably a company can service its debt. < 2x is danger zone. > 5x is safe. With CBN rates elevated, this separates survivors from casualties.",
      benchmark: { poor: 1.5, fair: 3, good: 6, great: 12 },
    },
    {
      id: "earningsQuality",
      label: "Earnings Quality (CFO/NI)",
      unit: "x",
      direction: "high",
      weight: 8,
      group: "edge",
      tip: "Operating Cash Flow divided by Net Income. Ratio > 1 means earnings are backed by real cash. < 0.7 is a red flag — earnings may be inflated by accruals or FX translation gains common in Nigerian financials.",
      benchmark: { poor: 0.4, fair: 0.7, good: 1.0, great: 1.5 },
    },
    {
      id: "fxRevenueExposure",
      label: "FX / Hard Currency Revenue %",
      unit: "%",
      direction: "high",
      weight: 7,
      group: "edge",
      tip: "% of revenue in USD, GBP, or other hard currencies. A naira devaluation HEDGE. Companies like Seplat (oil in USD), MTN (some dollar revenues), and exporters benefit when CBN devalues. Critical NGX edge.",
      benchmark: { poor: 0, fair: 10, good: 30, great: 60 },
    },
    {
      id: "insiderOwnership",
      label: "Insider / Promoter Ownership",
      unit: "%",
      direction: "high",
      weight: 6,
      group: "edge",
      tip: "% of shares held by founders, directors, or major shareholders. High ownership = skin in the game. Dangote's concentrated ownership aligns management with shareholders. Watch for insider SELLING as a red flag.",
      benchmark: { poor: 2, fair: 10, good: 25, great: 45 },
    },
    {
      id: "dividendYield",
      label: "Dividend Yield",
      unit: "%",
      direction: "high",
      weight: 5,
      group: "edge",
      tip: "Annual dividend / share price. On the NGX, Zenith Bank, GTCO consistently yield 8–12%. A high yield from a growing company = double compounding. Avoid chasing yield from declining earnings.",
      benchmark: { poor: 0, fair: 3, good: 7, great: 12 },
    },
    {
      id: "revenueConcentration",
      label: "Revenue Diversification Score",
      unit: "/10",
      direction: "high",
      weight: 4,
      group: "edge",
      tip: "Rate 1–10 how diversified the company's revenue is (products, geographies, customers). Monolines like a single-product company score low. Pan-African banks like Access Holdings score high.",
      benchmark: { poor: 2, fair: 4, good: 7, great: 9 },
    },
  ],
};

const ALL_METRICS = [...METRICS.baseline, ...METRICS.edge];

function scoreMetric(metric, value) {
  if (value === "" || value === null || isNaN(parseFloat(value))) return null;
  const v = parseFloat(value);
  const { benchmark, direction } = metric;
  const { poor, fair, good, great } = benchmark;

  let score;
  if (direction === "high") {
    if (v >= great) score = 100;
    else if (v >= good) score = 70 + ((v - good) / (great - good)) * 30;
    else if (v >= fair) score = 40 + ((v - fair) / (good - fair)) * 30;
    else if (v >= poor) score = 10 + ((v - poor) / (fair - poor)) * 30;
    else score = 0;
  } else {
    if (v <= great) score = 100;
    else if (v <= good) score = 70 + ((good - v) / (good - great)) * 30;
    else if (v <= fair) score = 40 + ((fair - v) / (fair - good)) * 30;
    else if (v <= poor) score = 10 + ((poor - v) / (poor - fair)) * 30;
    else score = 0;
  }
  return Math.max(0, Math.min(100, score));
}

function getGrade(score) {
  if (score >= 80) return { label: "STRONG BUY", color: "#00ff88", bg: "rgba(0,255,136,0.12)" };
  if (score >= 65) return { label: "BUY", color: "#7aff5e", bg: "rgba(122,255,94,0.1)" };
  if (score >= 50) return { label: "WATCH", color: "#ffd84d", bg: "rgba(255,216,77,0.1)" };
  if (score >= 35) return { label: "CAUTION", color: "#ff9f40", bg: "rgba(255,159,64,0.1)" };
  return { label: "AVOID", color: "#ff4d6d", bg: "rgba(255,77,109,0.1)" };
}

function ScoreBar({ score, color }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6, width: "100%", overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${score}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 4,
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}

export default function NGXScorer() {
  const [values, setValues] = useState({});
  const [activeMetric, setActiveMetric] = useState(null);
  const [stockName, setStockName] = useState("");
  const [tab, setTab] = useState("input");

  const updateValue = (id, val) => setValues((v) => ({ ...v, [id]: val }));

  const computedScores = ALL_METRICS.map((m) => {
    const s = scoreMetric(m, values[m.id]);
    return { ...m, score: s };
  });

  const baselineScores = computedScores.filter((m) => m.group === "baseline" && m.score !== null);
  const edgeScores = computedScores.filter((m) => m.group === "edge" && m.score !== null);

  function weightedAvg(arr) {
    if (!arr.length) return null;
    const totalW = arr.reduce((s, m) => s + m.weight, 0);
    const totalS = arr.reduce((s, m) => s + m.score * m.weight, 0);
    return totalS / totalW;
  }

  const baselineAvg = weightedAvg(baselineScores);
  const edgeAvg = weightedAvg(edgeScores);
  const allFilled = computedScores.filter((m) => m.score !== null);
  const overallScore = weightedAvg(allFilled);

  const grade = overallScore !== null ? getGrade(overallScore) : null;

  const inputCount = Object.values(values).filter((v) => v !== "" && v !== undefined).length;

  return (
    <div style={{
      fontFamily: "'Courier New', monospace",
      background: "#080c14",
      minHeight: "100vh",
      color: "#c8d8f0",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0d1826 0%, #091422 100%)",
        borderBottom: "1px solid rgba(0,200,255,0.15)",
        padding: "24px 20px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#00c8ff",
            boxShadow: "0 0 10px #00c8ff",
            animation: "pulse 2s infinite",
          }} />
          <span style={{ color: "#00c8ff", fontSize: 11, letterSpacing: 3, fontWeight: 700 }}>NGX EDGE SCANNER</span>
        </div>
        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#e8f4ff",
          margin: "0 0 4px",
          letterSpacing: -0.5,
        }}>Stock Intelligence Framework</h1>
        <p style={{ margin: 0, fontSize: 11, color: "#5a7a9a", letterSpacing: 1 }}>
          6 BASELINE METRICS + 12 EDGE METRICS · NIGERIAN EXCHANGE LIMITED
        </p>
      </div>

      {/* Stock Name Input */}
      <div style={{ padding: "16px 20px 0" }}>
        <input
          value={stockName}
          onChange={(e) => setStockName(e.target.value)}
          placeholder="Enter stock name (e.g. MTN NIGERIA, ZENITH BANK...)"
          style={{
            width: "100%",
            background: "rgba(0,200,255,0.05)",
            border: "1px solid rgba(0,200,255,0.2)",
            borderRadius: 6,
            color: "#e8f4ff",
            padding: "10px 14px",
            fontSize: 13,
            fontFamily: "inherit",
            letterSpacing: 1,
            boxSizing: "border-box",
            outline: "none",
          }}
        />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", padding: "16px 20px 0", gap: 4 }}>
        {["input", "results"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 18px",
              borderRadius: 4,
              border: tab === t ? "1px solid rgba(0,200,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
              background: tab === t ? "rgba(0,200,255,0.1)" : "transparent",
              color: tab === t ? "#00c8ff" : "#5a7a9a",
              fontSize: 11,
              fontFamily: "inherit",
              letterSpacing: 2,
              cursor: "pointer",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {t === "input" ? `◎ INPUT (${inputCount}/${ALL_METRICS.length})` : `▸ RESULTS`}
          </button>
        ))}
      </div>

      {tab === "input" && (
        <div style={{ padding: "16px 20px" }}>
          {/* Baseline Section */}
          <SectionHeader label="BASELINE METRICS" color="#00c8ff" subtitle="Your mentor's core 6" />
          {METRICS.baseline.map((m) => (
            <MetricRow
              key={m.id}
              metric={m}
              value={values[m.id] || ""}
              onChange={(v) => updateValue(m.id, v)}
              score={scoreMetric(m, values[m.id])}
              active={activeMetric === m.id}
              onFocus={() => setActiveMetric(m.id)}
              onBlur={() => setActiveMetric(null)}
            />
          ))}

          {/* Edge Section */}
          <div style={{ marginTop: 24 }}>
            <SectionHeader label="EDGE METRICS" color="#ffd84d" subtitle="Your competitive advantage over retail traders" />
            {METRICS.edge.map((m) => (
              <MetricRow
                key={m.id}
                metric={m}
                value={values[m.id] || ""}
                onChange={(v) => updateValue(m.id, v)}
                score={scoreMetric(m, values[m.id])}
                active={activeMetric === m.id}
                onFocus={() => setActiveMetric(m.id)}
                onBlur={() => setActiveMetric(null)}
              />
            ))}
          </div>

          <button
            onClick={() => setTab("results")}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #00c8ff22, #00c8ff11)",
              border: "1px solid rgba(0,200,255,0.4)",
              borderRadius: 8,
              color: "#00c8ff",
              fontSize: 12,
              fontFamily: "inherit",
              letterSpacing: 3,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ANALYZE STOCK ▸
          </button>
        </div>
      )}

      {tab === "results" && (
        <div style={{ padding: "16px 20px" }}>
          {overallScore === null ? (
            <div style={{
              textAlign: "center", padding: "40px 20px",
              color: "#3a5a7a", fontSize: 13, letterSpacing: 1,
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
              Enter at least one metric to see results.
            </div>
          ) : (
            <>
              {/* Overall Score */}
              <div style={{
                background: grade.bg,
                border: `1px solid ${grade.color}44`,
                borderRadius: 12,
                padding: "20px",
                marginBottom: 20,
                textAlign: "center",
              }}>
                {stockName && (
                  <div style={{ fontSize: 11, color: "#5a7a9a", letterSpacing: 3, marginBottom: 8 }}>
                    {stockName.toUpperCase()}
                  </div>
                )}
                <div style={{ fontSize: 52, fontWeight: 900, color: grade.color, lineHeight: 1 }}>
                  {overallScore.toFixed(0)}
                </div>
                <div style={{ fontSize: 10, color: "#5a7a9a", marginBottom: 8 }}>COMPOSITE SCORE / 100</div>
                <div style={{
                  display: "inline-block",
                  padding: "4px 16px",
                  background: grade.bg,
                  border: `1px solid ${grade.color}66`,
                  borderRadius: 20,
                  color: grade.color,
                  fontSize: 12,
                  letterSpacing: 3,
                  fontWeight: 700,
                }}>
                  {grade.label}
                </div>
                <div style={{ marginTop: 12, fontSize: 10, color: "#3a5a7a" }}>
                  Based on {inputCount} of {ALL_METRICS.length} metrics entered
                </div>
              </div>

              {/* Sub-scores */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <ScoreTile label="BASELINE" score={baselineAvg} color="#00c8ff" count={baselineScores.length} total={6} />
                <ScoreTile label="EDGE" score={edgeAvg} color="#ffd84d" count={edgeScores.length} total={12} />
              </div>

              {/* Individual Scores */}
              <SectionHeader label="METRIC BREAKDOWN" color="#00c8ff" />
              {computedScores.filter((m) => m.score !== null).map((m) => (
                <div key={m.id} style={{
                  marginBottom: 12,
                  padding: "12px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "#8ab0d0", letterSpacing: 0.5 }}>{m.label}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "#3a5a7a" }}>
                        {values[m.id]}{m.unit}
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: m.score >= 70 ? "#00ff88" : m.score >= 40 ? "#ffd84d" : "#ff4d6d",
                      }}>
                        {m.score.toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <ScoreBar
                    score={m.score}
                    color={m.score >= 70 ? "#00ff88" : m.score >= 40 ? "#ffd84d" : "#ff4d6d"}
                  />
                </div>
              ))}

              {/* Key Insights */}
              {allFilled.length > 0 && (
                <InsightsPanel scores={computedScores} values={values} />
              )}

              <button
                onClick={() => setTab("input")}
                style={{
                  marginTop: 16,
                  width: "100%",
                  padding: "12px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#5a7a9a",
                  fontSize: 11,
                  fontFamily: "inherit",
                  letterSpacing: 2,
                  cursor: "pointer",
                }}
              >
                ◂ EDIT INPUTS
              </button>
            </>
          )}
        </div>
      )}

      {/* Glossary always visible at bottom of input tab */}
      {tab === "input" && activeMetric && (
        <div style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          background: "#0d1826",
          borderTop: "1px solid rgba(0,200,255,0.2)",
          padding: "14px 20px",
          zIndex: 100,
        }}>
          <div style={{ fontSize: 10, color: "#00c8ff", letterSpacing: 2, marginBottom: 4 }}>
            {ALL_METRICS.find((m) => m.id === activeMetric)?.label.toUpperCase()}
          </div>
          <div style={{ fontSize: 12, color: "#8ab0d0", lineHeight: 1.5 }}>
            {ALL_METRICS.find((m) => m.id === activeMetric)?.tip}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        input::placeholder { color: #2a4a6a; }
        input:focus { border-color: rgba(0,200,255,0.4) !important; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: #080c14; }
        ::-webkit-scrollbar-thumb { background: #1a3050; border-radius: 2px; }
      `}</style>
    </div>
  );
}

function SectionHeader({ label, color, subtitle }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 3, height: 14, background: color, borderRadius: 2 }} />
        <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: 3 }}>{label}</span>
      </div>
      {subtitle && (
        <div style={{ fontSize: 10, color: "#3a5a7a", marginTop: 2, paddingLeft: 11, letterSpacing: 0.5 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function MetricRow({ metric, value, onChange, score, active, onFocus, onBlur }) {
  const color = score === null ? "#3a5a7a" : score >= 70 ? "#00ff88" : score >= 40 ? "#ffd84d" : "#ff4d6d";

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
      padding: "10px 12px",
      background: active ? "rgba(0,200,255,0.06)" : "rgba(255,255,255,0.02)",
      border: active ? "1px solid rgba(0,200,255,0.2)" : "1px solid rgba(255,255,255,0.04)",
      borderRadius: 8,
      transition: "all 0.2s",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "#8ab0d0", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {metric.label}
          <span style={{ color: "#2a4a6a", fontSize: 9, marginLeft: 4 }}>({metric.unit})</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, color: metric.direction === "high" ? "#00c8ff88" : "#ff4d6d88" }}>
            {metric.direction === "high" ? "▲ higher" : "▼ lower"}
          </span>
          <span style={{ fontSize: 9, color: "#2a4a6a" }}>W:{metric.weight}</span>
        </div>
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="—"
        style={{
          width: 70,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 4,
          color: "#e8f4ff",
          padding: "6px 8px",
          fontSize: 13,
          fontFamily: "inherit",
          textAlign: "right",
          outline: "none",
        }}
      />
      <div style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: score !== null ? `${color}15` : "rgba(255,255,255,0.03)",
        border: `1px solid ${score !== null ? color + "44" : "rgba(255,255,255,0.06)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
        color: score !== null ? color : "#2a4a6a",
        flexShrink: 0,
      }}>
        {score !== null ? score.toFixed(0) : "?"}
      </div>
    </div>
  );
}

function ScoreTile({ label, score, color, count, total }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${color}22`,
      borderRadius: 10,
      padding: "14px 12px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 9, color: color, letterSpacing: 3, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 900, color: score !== null ? color : "#2a4a6a" }}>
        {score !== null ? score.toFixed(0) : "—"}
      </div>
      <div style={{ fontSize: 9, color: "#2a4a6a", marginTop: 4 }}>
        {count}/{total} filled
      </div>
    </div>
  );
}

function InsightsPanel({ scores, values }) {
  const filled = scores.filter((m) => m.score !== null);
  const weak = filled.filter((m) => m.score < 35).sort((a, b) => a.score - b.score).slice(0, 3);
  const strong = filled.filter((m) => m.score >= 75).sort((a, b) => b.score - a.score).slice(0, 3);

  const insights = [];

  // PEG insight
  const pe = parseFloat(values.pe);
  const eg = parseFloat(values.earningsGrowth);
  if (!isNaN(pe) && !isNaN(eg) && eg > 0) {
    const peg = pe / eg;
    if (peg < 0.5) insights.push({ type: "bullish", text: `PEG of ${peg.toFixed(2)}x — deeply undervalued relative to growth. Rare on any exchange.` });
    else if (peg > 2) insights.push({ type: "bearish", text: `PEG of ${peg.toFixed(2)}x — you're overpaying for this growth rate. Wait for a pullback.` });
  }

  // D/E + Interest rate warning
  const de = parseFloat(values.debtEquity);
  if (!isNaN(de) && de > 2) {
    insights.push({ type: "bearish", text: `D/E of ${de}x is dangerous with CBN rates elevated above 26%. Interest burden could crush earnings.` });
  }

  // Earnings quality warning
  const eq = parseFloat(values.earningsQuality);
  if (!isNaN(eq) && eq < 0.7) {
    insights.push({ type: "bearish", text: `CFO/NI ratio of ${eq}x — earnings may be inflated by non-cash items or FX translation. Verify cash flow statement.` });
  }

  // FX hedge positive
  const fx = parseFloat(values.fxRevenueExposure);
  if (!isNaN(fx) && fx > 30) {
    insights.push({ type: "bullish", text: `${fx}% hard-currency revenue. This stock is a naira devaluation hedge — a structural edge in the Nigerian market.` });
  }

  // ROE + ROIC combo
  const roe = parseFloat(values.roe);
  const roic = parseFloat(values.roic);
  if (!isNaN(roe) && !isNaN(roic) && roe > 20 && roic > 18) {
    insights.push({ type: "bullish", text: `ROE ${roe}% + ROIC ${roic}% combo signals a genuine economic moat. These companies compound capital over cycles.` });
  }

  if (!insights.length && !weak.length && !strong.length) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <SectionHeader label="SMART INSIGHTS" color="#a78bfa" />

      {insights.map((ins, i) => (
        <div key={i} style={{
          padding: "10px 12px",
          marginBottom: 8,
          background: ins.type === "bullish" ? "rgba(0,255,136,0.05)" : "rgba(255,77,109,0.05)",
          border: `1px solid ${ins.type === "bullish" ? "rgba(0,255,136,0.2)" : "rgba(255,77,109,0.2)"}`,
          borderRadius: 8,
          fontSize: 11,
          color: "#8ab0d0",
          lineHeight: 1.5,
        }}>
          <span style={{ color: ins.type === "bullish" ? "#00ff88" : "#ff4d6d", marginRight: 6 }}>
            {ins.type === "bullish" ? "▲" : "▼"}
          </span>
          {ins.text}
        </div>
      ))}

      {strong.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 9, color: "#00ff88", letterSpacing: 2, marginBottom: 6 }}>STRENGTHS</div>
          {strong.map((m) => (
            <div key={m.id} style={{ fontSize: 11, color: "#5a8a6a", marginBottom: 3 }}>
              ✓ {m.label} ({m.score.toFixed(0)}/100)
            </div>
          ))}
        </div>
      )}

      {weak.length > 0 && (
        <div>
          <div style={{ fontSize: 9, color: "#ff4d6d", letterSpacing: 2, marginBottom: 6 }}>RISK FLAGS</div>
          {weak.map((m) => (
            <div key={m.id} style={{ fontSize: 11, color: "#8a4a5a", marginBottom: 3 }}>
              ✗ {m.label} ({m.score.toFixed(0)}/100) — review before buying
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
