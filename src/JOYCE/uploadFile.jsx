import { useState } from "react";
import "./uploadFile.css";

function uploadFile() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="upload-demo-page">
      <button className="trigger-btn" onClick={() => setShowModal(true)}>
        Open Upload Modal
      </button>

      {showModal && (
        <div className="upload-overlay">
          <div className="upload-modal">

            <div className="upload-modal-card">
              <div className="upload-modal-header">
                <div className="upload-modal-title-group">
                  <h2>Upload Documents</h2>
                  <p>Select or drag and drop your files here</p>
                </div>

                <button
                  className="upload-close-btn"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="upload-divider" />

              <div className="upload-drop-zone">
                <div className="upload-icon-circle">
                  <div className="upload-arrow">↥</div>
                </div>

                <div className="upload-main-text">
                  Click to browse or drag and drop
                </div>

                <div className="upload-sub-text">
                  PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Max 10MB)
                </div>
              </div>

              <div className="upload-footer">
                <button
                  className="upload-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button className="upload-done-btn">Done</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default uploadFile;