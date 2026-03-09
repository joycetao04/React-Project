import { useState, useRef } from "react";
import "./uploadFile.css";

function uploadFile() {
    const [showModal, setShowModal] = useState(false);

    const fileInputRef = useRef(null);

    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState("");

    const clearFile = () => {
        setFileName("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadshetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
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

    const handleClick = () => {
        fileInputRef.current.click();
    }
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (validateFile(file)) {
            setFileName(file.name);
        }
    }
    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);

        const file = event.dataTransfer.files[0];
        if (!file) return;

        if (validateFile(file)) {
            setFileName(file.name);
        }
    }
    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    }
    const handleDragLeave = () => {
        setDragging(false);
    }

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
                                onClick={() => {
                                    setShowModal(false); clearFile();
                                }}
                                aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="upload-divider" />

                            <div className={`upload-drop-zone ${dragging ? "drag-active" : ""}`}
                                onClick={handleClick}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}>

                                <div className="upload-icon-circle">
                                    <div className="upload-arrow">↥</div>
                                </div>

                                <div className="upload-main-text">Click to browse or drag and drop</div>

                                <div className="upload-sub-text">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Max 10MB)</div>

                                {fileName && (
                                    <div className="upload-file-name">Selected file: {fileName}</div>
                                )}
                            </div>

                            <div className="upload-footer">
                                <button
                                className="upload-cancel-btn"
                                onClick={() => {
                                    setShowModal(false); clearFile();
                                }}
                                >
                                    Cancel
                                </button>

                                <button className="upload-done-btn">Done</button>
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
            )}
        </div>
    );
}

export default uploadFile;