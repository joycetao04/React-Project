import { useState, useRef } from "react";
import "./uploadFile.css";

function UploadFile() {
    const [showModal, setShowModal] = useState(false);

    const fileInputRef = useRef(null);

    const [dragging, setDragging] = useState(false);
    const [progress, setProgress] = useState(0);

    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);

    const clearFile = () => {
        setFileName("");
        setFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
    }
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (validateFile(file)) {
            setFileName(file.name);
            setFile(file);
        }
    }
    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);

        const file = event.dataTransfer.files[0];
        if (!file) return;

        if (validateFile(file)) {
            setFileName(file.name);
            setFile(file);
        }
    }
    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    }
    const handleDragLeave = () => {
        setDragging(false);
    }

    const uploadToBackend = async () => {
        if (!file) {
            alert("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        // XMLHttpRequest for Upload Progress bar
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
        };

        xhr.onerror = () => {
            console.error("Upload failed");
        }

        xhr.send(formData);

        // Fetch for no upload progress
        /* 
        try {
            const response = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            console.log("AI response:", data);
        } catch (error) {
            console.error("Upload failed:", error);
        }
        */
    };

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
                                    <div className="upload-arrow">{getFileIcon()}</div>
                                </div>

                                <div className="upload-main-text">Click to browse or drag and drop</div>

                                <div className="upload-sub-text">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Max 10MB)</div>

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
                                <button
                                className="upload-cancel-btn"
                                onClick={() => {
                                    setShowModal(false); clearFile();
                                }}
                                >
                                    Cancel
                                </button>

                                <button 
                                className="upload-done-btn"
                                onClick={uploadToBackend}
                                >
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
            )}
        </div>
    );
}

export default UploadFile;