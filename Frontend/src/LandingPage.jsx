import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import Header from "./Header.jsx";
function LandingPage(){
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/choose");
  };
  
  return(
    <>
      <Header></Header>
      <div className="container">
        <h1 className="main-heading">Own the boardroom.</h1>
        <p className="sub-heading">The boardroom shouldn't be where you discover your biggest <span className="black-text">blind spot</span> <br />
                                   Use our <span className="black-text">AI investors</span> to pressure-test your narrative until it's unshakeable.</p>
        <button onClick={handleGetStarted} className="get-started-button">Get Started</button>
      </div>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-heading">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>The Selection</h3>
            <p>Choose your AI sparring partner from a roster of specialized investors, each with distinct personalities and questioning styles.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>The Interrogation</h3>
            <p>Enter a real-time voice session where AI listens to your pitch, interrupts with tough questions, and challenges your assumptions.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>The Autopsy</h3>
            <p>Receive a detailed report summarizing areas of improvement and what you did best.</p>
          </div>
        </div>
      </section>

      {/* AI Investors Section */}
      <section className="ai-investors">
        <h2 className="section-heading">Meet Your AI Investors</h2>
        <p className="section-subtitle">Each persona prepares you for different boardroom scenarios</p>
        <div className="investors-grid">
          <div className="investor-card">
            <h3>The Skeptical CFO</h3>
            <p>A risk-averse numbers-hawk who ignores the "vision" to hunt for mathematical flaws, shaky unit economics, and unrealistic burn rates.</p>
          </div>
          <div className="investor-card">
            <h3>The Performative CTO</h3>
            <p>A technical gatekeeper obsessed with jargon; they will grill you on your stack and scalability just to see if you're a true builder or just using APIs.</p>
          </div>
          <div className="investor-card">
            <h3>The Visionary Founder</h3>
            <p>An idealist looking for the next "dent in the universe"; they judge you on your mission, long-term legacy, and the strength of your "Why."</p>
          </div>
          <div className="investor-card">
            <h3>The Nitpicker Analyst</h3>
            <p>A meticulous auditor who zooms in on tiny data inconsistencies and errors to test your precision and composure under a microscope.</p>
          </div>
          <div className="investor-card">
            <h3>The Impatient Billionaire</h3>
            <p>A time-starved high-roller who demands the "bottom line" immediately.</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <h2 className="section-heading">Why <span className="yellow-text">Founders</span> Choose PitchPerfect</h2>
        <div className="benefits-container">
          <div className="benefit-item">
            <h3>Risk-Free Failure</h3>
            <p>Blow a pitch a hundred times with AI before stepping into a real boardroom.</p>
          </div>
          <div className="benefit-item">
            <h3>Persona-Specific Prep</h3>
            <p>Adjust your narrative for growth VCs, technical angels, or any investor type.</p>
          </div>
          <div className="benefit-item">
            <h3>Objective Analytics</h3>
            <p>Get cold, hard performance data without the sugar-coating of friends or mentors.</p>
          </div>
          <div className="benefit-item">
            <h3>Track Progress</h3>
            <p>Watch your confidence score rise and filler word count drop as you train.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="developed-by">Developed by: <span className="developer-name">Angad Bajaj</span></p>
          <p className="tagline">"Give me six hours to chop down a tree and I will spend the first four sharpening the axe." — Abraham Lincoln</p>
        </div>
      </footer>
    </>
  )
}

export default LandingPage;