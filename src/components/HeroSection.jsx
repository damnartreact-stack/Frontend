import { Download, RotateCcw, ShieldCheck, Upload } from 'lucide-react';

function HeroSection({ onUploadClick, onCheckBackend }) {
  return (
    <section className="hero-grid">
      <div className="hero-copy">
        <div className="eyebrow">
          AI-assisted fire design · CAD review package
        </div>

        <h1>
          Automated FireDesign-style workflow for CAD, sprinkler and alarm packages.
        </h1>

        <p>
          Upload a DXF or clear floor-plan image and generate a practical review package
          with room classification, sprinkler layout, fire alarm devices, MEP route
          allowances, calculation schedules, Ceasefire-style BOM, updated DXF and export ZIP.
        </p>

        <div className="hero-actions">
          <button type="button" onClick={onUploadClick}>
            <Upload size={18} />
            Upload drawing
          </button>

          <button type="button" className="ghost" onClick={onCheckBackend}>
            <RotateCcw size={18} />
            Check backend
          </button>
        </div>
      </div>

      <div className="hero-card">
        <div className="mini-plan">
          <span className="pipe pipe-a">DXF · Rooms</span>
          <span className="pipe pipe-b">Sprinklers · Alarm</span>
          <span className="pipe pipe-c">BOM · DXF · ZIP</span>

          <span className="head h1" />
          <span className="head h2" />
          <span className="head h3" />
          <span className="head h4" />
          <span className="riser" />
        </div>

        <div className="metric-row">
          <div>
            <span>DXF</span>
            <small>best input</small>
          </div>

          <div>
            <span>BOM</span>
            <small>Ceasefire mapped</small>
          </div>

          <div>
            <span>ZIP</span>
            <small>export package</small>
          </div>
        </div>

        <div className="accuracy-note small-note capability-note">
          <strong>
            <ShieldCheck size={14} /> Review-first output
          </strong>
          <span>
            This is a POC review package. Final design must be checked by a competent
            engineer and AHJ before submission.
          </span>
        </div>

        <div className="accuracy-note small-note capability-note">
          <strong>
            <Download size={14} /> Output package
          </strong>
          <span>
            PNG preview, SVG, JSON, report, standard BOM, Ceasefire BOM, updated DXF
            and export ZIP.
          </span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;