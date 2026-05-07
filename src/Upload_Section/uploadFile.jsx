import { useState, useRef } from "react";
import "./uploadFile.css";

function UploadFile({ showModal, onClose, onUploadSuccess}) {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);

  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);

  const clearFile = () => {
    setFileName("");
    setFile(null);
    setProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeModal = () => {
    setClosing(true);

    setTimeout(() => {
      setClosing(false);
      clearFile();
      onClose();
    }, 200);
  };

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  const maxSize = 10 * 1024 * 1024;

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      alert("File type not allowed");
      return false;
    }

    if (file.size > maxSize) {
      alert("File must be under 10MB");
      return false;
    }

    return true;
  };

  const getFileIcon = () => {
    if (!fileName) return "↥";

    const ext = fileName.split(".").pop().toLowerCase();

    if (ext === "pdf") return "📄";
    if (ext === "doc" || ext === "docx") return "📝";
    if (ext === "xls" || ext === "xlsx") return "📊";
    if (ext === "ppt" || ext === "pptx") return "📑";

    return "📁";
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (validateFile(selectedFile)) {
      setFileName(selectedFile.name);
      setFile(selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const droppedFile = event.dataTransfer.files[0];
    if (!droppedFile) return;

    if (validateFile(droppedFile)) {
      setFileName(droppedFile.name);
      setFile(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const uploadToBackend = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }
    

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost:8000/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      console.log("Upload complete");
      if (onUploadSuccess) {
        onUploadSuccess(file);
      }
      closeModal();
    };

    xhr.onerror = () => {
      console.error("Upload failed");
      alert("Upload failed");
    };

    xhr.send(formData);
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="upload-overlay">
      <div className="upload-modal">
        <div className={`upload-modal-card ${closing ? "modal-closing" : ""}`}>
          <div className="upload-modal-header">
            <div className="upload-modal-title-group">
              <h2>Upload Documents</h2>
              <p>Select or drag and drop your files here</p>
            </div>

            <button
              className="upload-close-btn"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="upload-divider" />

          <div
            className={`upload-drop-zone ${dragging ? "drag-active" : ""}`}
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="upload-icon-circle">
              <div className="upload-arrow">{getFileIcon()}</div>
            </div>

            <div className="upload-main-text">
              Click to browse or drag and drop
            </div>

            <div className="upload-sub-text">
              PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Max 10MB)
            </div>

            {fileName && (
              <div className="upload-file-name">Selected file: {fileName}</div>
            )}

            {progress > 0 && (
              <div className="upload-progress">
                <div
                  className="upload-progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          <div className="upload-footer">
            <button className="upload-cancel-btn" onClick={closeModal}>
              Cancel
            </button>

            <button className="upload-done-btn" onClick={uploadToBackend}>
              Done
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </div>
      </div>
    </div>
  );
}

export default UploadFile;