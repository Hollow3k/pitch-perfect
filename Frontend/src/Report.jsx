import React, { useState, useEffect } from "react";
import Header from "./Header";
import "./Report.css";

function Report() {
  const [report, setReport] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);

  const url = new URL(window.location.href);
  const investor = url.searchParams.get("investor");

  useEffect(() => {
    generateReport();
  }, []);

  async function generateReport() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/generate-report?investor=${investor}`
      );
      if (!response.ok) throw new Error("Failed to generate report");
      const data = await response.json();
      setReport(data.report);
      setTranscript(data.transcript);
    } catch (err) {
      console.error("Failed to fetch report:", err);
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function ScoreBar({ label, score }) {
    return (
      <div className="score-bar">
        <div className="score-bar-label">
          <span>{label}</span>
          <span>{score}/10</span>
        </div>
        <div className="score-bar-track">
          <div
            className="score-bar-fill"
            style={{ width: `${score * 10}%` }}
          ></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="report-container">
          <div className="report-loading">
            <div className="report-spinner"></div>
            <h2>Generating Your Pitch Report</h2>
            <p>Analyzing your conversation and preparing feedback...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="report-container">
          <div className="report-error">
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button className="report-btn" onClick={generateReport}>
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="report-container">
        <div className="report-header-section">
          <h1>Pitch Report</h1>
          <div className="overall-score">
            <div className="score-circle">
              <span className="score-number">{report.overallScore}</span>
              <span className="score-label">/10</span>
            </div>
          </div>
          <p className="report-summary">{report.summary}</p>
        </div>

        <div className="report-grid">
          <div className="report-card">
            <h3>Strengths</h3>
            <ul className="report-list strengths-list">
              {report.strengths.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="report-card">
            <h3>Areas for Improvement</h3>
            <ul className="report-list improvements-list">
              {report.improvements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="report-card full-width">
          <h3>Performance Metrics</h3>
          <div className="metrics-grid">
            <ScoreBar label="Clarity" score={report.keyMetrics.clarity} />
            <ScoreBar label="Persuasiveness" score={report.keyMetrics.persuasiveness} />
            <ScoreBar label="Preparedness" score={report.keyMetrics.preparedness} />
            <ScoreBar label="Response Quality" score={report.keyMetrics.responseQuality} />
          </div>
        </div>

        <div className="report-card full-width">
          <h3>Investor Fit</h3>
          <p>{report.investorFit}</p>
        </div>

        <div className="report-card full-width">
          <h3>Detailed Feedback</h3>
          <p>{report.detailedFeedback}</p>
        </div>

        <div className="report-card full-width">
          <button
            className="report-btn"
            onClick={() => setShowTranscript(!showTranscript)}
          >
            {showTranscript ? "Hide Transcript" : "View Transcript"}
          </button>
          {showTranscript && (
            <pre className="transcript-text">{transcript}</pre>
          )}
        </div>
      </div>
    </>
  );
}

export default Report;
