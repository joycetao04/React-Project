import React, { useEffect, useRef, useState } from "react";
import Header from "./Header.jsx";
import UploadFile from "../Upload_Section/uploadFile.jsx";
import "./Canvas_Board.css"

import { TfiAlignJustify } from "react-icons/tfi";
import { VscArrowUp } from "react-icons/vsc";
import { AiOutlineDoubleRight } from "react-icons/ai";
import { AiOutlineDoubleLeft } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { TiArrowBack } from "react-icons/ti";
import { TiArrowForward } from "react-icons/ti";
import { IoLinkSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import { FaListOl } from "react-icons/fa";


function CanvasBoard(){
    const [files, setFiles] = useState([
        {
            id: 1,
            title: "The Document Name",
            date: "2026.05.04",
            size: "1KTB",
        },
        {
            id: 2,
            title: "The Document Name2",
            date: "2026.05.04",
            size: "1KTB",
        },
        {
            id: 3,
            title: "The Document Name3",
            date: "2026.05.04",
            size: "1KTB",
        },
        {
            id: 4,
            title: "The Document Name4",
            date: "2026.05.04",
            size: "1KTB",
        },
        {
            id: 5,
            title: "The Document Name5",
            date: "2026.05.04",
            size: "1KTB",
        },
        {
            id: 6,
            title: "The Document Name6",
            date: "2026.05.04",
            size: "1KTB",
        },
        {
            id: 7,
            title: "The Document Name7",
            date: "2026.05.04",
            size: "1KTB",
        },
        {
            id: 8,
            title: "The Document Name8",
            date: "2026.05.04",
            size: "1KTB",
        }
    ]);

    const [notes, setNotes] = useState([
        /** x and y are the position of the note on the canvas */
        /** selected we will know if the note get selected or not if did change color to darker color */
        {
            id: 1,
            title: "Document1",
            body: "Some text here that will talk about the document.",
            x: 260,
            y: 120,
            selected: true,
        },
        {
            id: 2,
            title: "Document2",
            body: "Some text here that will talk about the document.",
            x: 520,
            y: 260,
            selected: false,
        },
    ]);

    const [links, setLinks] = useState([]);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [isCabinetOpen, setIsCabinetOpen] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [draggingNoteId, setDraggingNoteId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [hasDraggedNote, setHasDraggedNote] = useState(false);
    const [boardOffset, setBoardOffset] = useState({ x: 0, y: 0 });
    const [isPanningBoard, setIsPanningBoard] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0});
    const [boardScale, setBoardScale] = useState(1);
    const [hoveredNoteId, setHoveredNoteId] = useState(null);
    const [openedNoteId, setOpenedNoteId] = useState(null);
    const [noteDraft, setNoteDraft] = useState("");
    const editorRef = useRef(null);

    const NOTE_WIDTH = 185; /** Currently I set the width of the note to be 185px */
    const NOTE_HEIGHT = 160; /** Currently I set the Height of the note to be 160px */
    /** When file upload success it will be package in the way we want so later can put into the PGSQL*/
    const handleUploadSuccess = (uploadedFile) => {
        const newFile = {
            id: Date.now(),
            title: uploadedFile.name,
            date: new Date().toISOString().slice(0,10),
            size: `${Math.round(uploadedFile.size / 1024)} KB`,
        };

        setFiles((prevFiles) => [newFile, ...prevFiles]);
    };
    /***************************************************************************/
    /** When click the Note if the current note is selected then change back to light color else change to darker color */
    const handleNoteClick = (noteId) => {
        setNotes((prevNotes) => 
            prevNotes.map((note) => 
                note.id === noteId ? { ...note, selected: !note.selected } : note
            )
        );
    };
    /***************************************************************************/
    /** When click the File on the left it will show up on the Canvas (x and y in the function I set it this way so it will keep shift buttom right a bit so it wont overlap) */
    const handleFileClick = (file) => {
        const newNote = {
            id: Date.now(),
            title: file.title,
            body: "Note from the source.",
            x: 300 + notes.length * 30,
            y: 120 + notes.length * 30,
            selected: false,
        };

        setNotes((prevNotes) => [...prevNotes, newNote]);
    };
    /***************************************************************************/
    /** This function will count the number of note been selected */
    const selectedNotesCount = notes.filter((note) => note.selected).length;
    /***************************************************************************/
    const zoomPercentage = Math.round(boardScale * 100);
    /***************************************************************************/
    const hoveredNote = notes.find((note) => note.id === hoveredNoteId);
    /***************************************************************************/
    const openedNote = notes.find((note) => note.id === openedNoteId);
    /***************************************************************************/
    const handleSendMessage = () => {
        if (!chatInput.trim()) {
            return;
        };

        const userMessage = {
            id: Date.now(),
            role: "user",
            text: chatInput,
        };

        setChatMessages((prevMessages) => [...prevMessages, userMessage]);
        setChatInput("");
        setIsAiThinking(true);

        setTimeout(() => {
            const aiMessage = {
                id: Date.now()+1,
                role: "ai",
                text: selectedNotesCount > 0 ? `This answer is based on ${selectedNotesCount} selected note(s).` : "This is a general answer. Later, if no note is selected, this can call a general AI endpoint.",
            };
            setChatMessages((prevMessages) => [...prevMessages, aiMessage]);
            setIsAiThinking(false);
        }, 900);

    };
    const handleChatKeyDown = (event) => {
        if (event.key == "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    }
    /***************************************************************************/
    const handleFileDragStart = (event, file) => {
        event.dataTransfer.setData("application/json", JSON.stringify(file));
        event.dataTransfer.effectAllowed = "copy";
    };
    /***************************************************************************/
    const handleCanvasDragOver = (event) => {
        event.preventDefault();
    };
    /***************************************************************************/
    const handleCanvasDrop = (event) => {
        event.preventDefault();

        const fileData = event.dataTransfer.getData("application/json");

        if(!fileData){
            return;
        }

        const file = JSON.parse(fileData);

        const canvasRect = event.currentTarget.getBoundingClientRect();

        const x = (event.clientX - canvasRect.left - boardOffset.x) / boardScale;
        const y = (event.clientY - canvasRect.top - boardOffset.y) / boardScale;

        const newNote = {
            id: Date.now(),
            title: file.title,
            body: "Note or AI summary from the source",
            x,
            y,
            selected: false,
        };

        setNotes((prevNotes) => [...prevNotes, newNote]);
    };
    /***************************************************************************/
    const handleNoteMouseDown = (event, note) => {
        event.stopPropagation();

        const canvasRect = event.currentTarget.closest(".Canvas_Center").getBoundingClientRect();

        setDraggingNoteId(note.id);
        setHasDraggedNote(false);

        setDragOffset({
            x: (event.clientX - canvasRect.left - boardOffset.x) / boardScale - note.x,
            y: (event.clientY - canvasRect.top - boardOffset.y) / boardScale - note.y,
        });
    };
    /***************************************************************************/
    const handleCanvasMouseMove = (event) => {
        if (draggingNoteId !== null) {
            setHasDraggedNote(true);

            const canvasRect = event.currentTarget.getBoundingClientRect();

            const newX = (event.clientX - canvasRect.left - boardOffset.x) / boardScale - dragOffset.x;
            const newY = (event.clientY - canvasRect.top - boardOffset.y) / boardScale - dragOffset.y;

            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === draggingNoteId
                        ? { ...note, x: newX, y: newY }
                        : note
                )
            );
            return;
        }

        if (isPanningBoard) {
            setBoardOffset({
                x: event.clientX - panStart.x,
                y: event.clientY - panStart.y,
            });
        }
    };
    /***************************************************************************/
    const handleCanvasMouseUp = () => {
        setDraggingNoteId(null);
        setIsPanningBoard(false);
    };
    /***************************************************************************/
    const handleCanvasWheel = (event) => {
        event.preventDefault();

        const zoomSpeed = 0.0015;
        const minScale = 0.4;
        const maxScale = 2.5;

        const canvasRect = event.currentTarget.getBoundingClientRect();

        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;

        const worldX = (mouseX - boardOffset.x) / boardScale;
        const worldY = (mouseY - boardOffset.y) / boardScale;

        const nextScale = Math.min(
            maxScale,
            Math.max(minScale, boardScale - event.deltaY * zoomSpeed)
        );

        const nextOffsetX = mouseX - worldX * nextScale;
        const nextOffsetY = mouseY - worldY * nextScale;

        setBoardScale(nextScale);
        setBoardOffset({
            x: nextOffsetX,
            y: nextOffsetY,
        });
    };
    const handleBoardMouseDown = (event) => {
        const isCanvasBackground = event.target.classList.contains("Canvas_Center") || event.target.classList.contains("Canvas_World");

        if (!isCanvasBackground) {
            return;
        }

        setIsPanningBoard(true);
        setPanStart({
            x: event.clientX - boardOffset.x,
            y: event.clientY - boardOffset.y,
        });
    };
    /***************************************************************************/
    const handleResetView = () => {
        setBoardOffset({ x: 0, y: 0 });
        setBoardScale(1);
    };
    /***************************************************************************/
    const handleLinkSelectedNotes = () => {
        const selectedNotes = notes.filter((note) => note.selected);

        if (selectedNotes.length < 2) {
            alert("Please select at least 2 notes to link");
            return;
        }

        const newLinks = [];

        for (let i = 0; i < selectedNotes.length - 1; i++) {
            const fromNoteId = selectedNotes[i].id;
            const toNoteId = selectedNotes[i + 1].id;

            if (!linkAlreadyExists(fromNoteId,toNoteId)) {
                newLinks.push({
                    id: Date.now() + i,
                    fromNoteId: selectedNotes[i].id,
                    toNoteId: selectedNotes[i + 1].id,
                });
            }
        }

        setLinks((prevLinks) => [...prevLinks, ...newLinks]);
    };
    /***************************************************************************/
    const getNoteById = (noteId) => {
        return notes.find((note) => note.id === noteId);
    };
    /***************************************************************************/
    const handleDeleteSelectedNote = () => {
        const selectedNoteId = notes.filter((note) => note.selected).map((note) => note.id);

        if (selectedNoteId.length === 0) {
            return;
        }

        setNotes((prevNotes) => 
            prevNotes.filter((note) => !selectedNoteId.includes(note.id))
        );

        setLinks((prevLinks) => 
            prevLinks.filter(
                (link) => !selectedNoteId.includes(link.fromNoteId) && !selectedNoteId.includes(link.toNoteId)
            )
        );
    };
    /***************************************************************************/
    const linkAlreadyExists = (fromNoteId, toNoteId) => {
        return links.some((link) => {
            const sameDirection = link.fromNoteId === fromNoteId && link.toNoteId === toNoteId;
            const oppositeDirection = link.fromNoteId === toNoteId && link.toNoteId === fromNoteId;
            return sameDirection || oppositeDirection;
        });
    }
    /***************************************************************************/
    const handleOpenNote = (note) => {
        setOpenedNoteId(note.id);
        setNoteDraft(note.userNote || "");
    };
    /***************************************************************************/
    const handleCloseNote = () => {
        setOpenedNoteId(null);
        setNoteDraft("");
    };
    /***************************************************************************/
    const handleSaveNote = () => {
        const editorHtml = editorRef.current ? editorRef.current.innerHTML : "";

        setNotes((prevNotes) => 
            prevNotes.map((note) =>
                note.id === openedNoteId ? {...note, userNote: editorHtml} : note
            )
        );

        setNoteDraft(editorHtml);
        handleCloseNote();
    }
    /***************************************************************************/
    const handleEditorCommand = (command, value = null) => {
        if (editorRef.current) {
            editorRef.current.focus();
        }

        document.execCommand(command, false, value);

        if (editorRef.current) {
            setNoteDraft(editorRef.current.innerHTML);
        }
    };
    /***************************************************************************/
    useEffect(() => {
        if (openedNote && editorRef.current) {
            editorRef.current.innerHTML = openedNote.userNote || "";
            setNoteDraft(openedNote.userNote || "");
        }
    }, [openedNoteId]);
    /***************************************************************************/
    /** When click "Delete" or "Backspace" it will delete the selected note */
    useEffect(() => {
        const handleKeyDown = (event) => {
            const target = event.target;

            const isTyping =
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable;

            if (isTyping) {
                return;
            }

            if (openedNote) {
                return;
            }

            if (event.key === "Delete" || event.key === "Backspace") {
                handleDeleteSelectedNote();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [notes, links, openedNote]);
    /***************************************************************************/
    return (
        <div className="Canvas_Page">
            <Header/>
            <main className="Canvas_Main">
                <button className="Database_Button">Open Database Search</button>

                <aside className={`Canvas_Left ${isCabinetOpen ? "Canvas_Left_Open" : "Canvas_Left_Closed"}`}>
                    <button className="Cabinet_Toggle_Button" onClick={() => setIsCabinetOpen((prev) => !prev)}>{isCabinetOpen ? <AiOutlineDoubleLeft className="DoubleLeft" /> : <AiOutlineDoubleRight className="DoubleRight"/>}</button>
                    {isCabinetOpen && (
                        <>
                            <div className="Cabinet_Header">
                                <h2>CABINTE</h2>
                                <button className="Cabinet_Add_Button" onClick={()=>setShowUploadModal(true)}>+</button>
                            </div>

                            <div className="Cabinet_File_List">

                                {files.map((file) => (
                                    <div className="Cabinet_File_Row" key={file.id} draggable onClick={() => handleFileClick(file)} onDragStart={(event) => handleFileDragStart(event, file)}>
                                        <div className="Cabinet_File_Icon">📑</div>
                                        <div className="Cabinet_File_Info">
                                            <p className="Cabinet_File_Title">{file.title}</p>
                                            <div className="Cabinet_File_Meta">
                                                <span>{file.date}</span>
                                                <span className="Cabinet_File_Size">{file.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    

                </aside>
                
                <section className="Canvas_Center" style={{backgroundPosition: `${boardOffset.x}px ${boardOffset.y}px` , backgroundSize: `${14 * boardScale}px ${14 * boardScale}px`}} onMouseDown={handleBoardMouseDown} onWheel={handleCanvasWheel} onDragOver={handleCanvasDragOver} onDrop={handleCanvasDrop} onMouseMove={handleCanvasMouseMove} onMouseUp={handleCanvasMouseUp} onMouseLeave={handleCanvasMouseUp}>
                    
                    <div className="Canvas_World" style={{transform: `translate(${boardOffset.x}px, ${boardOffset.y}px) scale(${boardScale})`,}}>
                        <svg className="Canvas_Link_Layer">
                            {links.map((link) => {
                                const fromNote = getNoteById(link.fromNoteId);
                                const toNote = getNoteById(link.toNoteId);

                                if (!fromNote || !toNote) {
                                    return null;
                                }

                                const x1 = fromNote.x + NOTE_WIDTH / 2;
                                const y1 = fromNote.y + NOTE_HEIGHT / 2;
                                const x2 = toNote.x + NOTE_WIDTH / 2;
                                const y2 = toNote.y + NOTE_HEIGHT / 2;

                                return (
                                    <line key={link.id} x1={x1} y1={y1} x2={x2} y2={y2} className="Canvas_Link_Line" />
                                );
                            })}
                        </svg>

                        {notes.map((note) => (
                        /** If the note is selected then we will add a new class ("Canvas_Note_Selected") to it, in this way we can change the color of the note to darker */
                            <div className={`Canvas_Note_Card ${note.selected ? "Canvas_Note_Selected" : ""}`} 
                                key={note.id} 
                                onMouseEnter={() => setHoveredNoteId(note.id)}
                                onMouseLeave={() => setHoveredNoteId(null)}  
                                onClick={() => {
                                    if (!hasDraggedNote) {
                                        handleNoteClick(note.id);
                                    }
                                }} 
                                onMouseDown={(event) => handleNoteMouseDown(event,note)} 
                                style={{left: `${note.x}px`, top: `${note.y}px`,}}
                            > 
                                <p className="Canvas_Note_Title">{note.title}</p>
                                <p className="Canvas_Note_Body">{note.body}</p>
                                <div className="Canvas_Note_Dot"></div>
                            </div>
                        ))}

                        {hoveredNote && (
                            <div className="Note_Preview_Card" style={{left: `${hoveredNote.x + NOTE_WIDTH + 8}px`, top: `${hoveredNote.y}px`}} onMouseEnter={() => setHoveredNoteId(hoveredNote.id)} onMouseLeave={() => setHoveredNoteId(null)}>
                                <p className="Note_Preview_Label">PAPER</p>
                                <h3>{hoveredNote.title}</h3>
                                <p className="Note_Preview_Label">ABSTRACT</p>
                                <p className="Note_Preview_Text">{hoveredNote.body}</p>
                                <p className="Note_Preview_Label">CONNECTIONS</p>
                                <p className="Note_Preview_Number">
                                    {
                                        links.filter(
                                            (link) => link.fromNoteId === hoveredNote.id || link.toNoteId === hoveredNote.id
                                        ).length
                                    }
                                </p>

                                <button className="Note_Preview_Button" onClick={() => handleOpenNote(hoveredNote)}>
                                    OPEN NOTE
                                </button>
                            </div>
                        )}

                    </div>
                    
                    <div className="Canvas_Bottom_Toolbar">
                        <span className="Canvas_Toolbar_Selected_Text">{selectedNotesCount} notes selected</span>
                        <span className="Canvas_Zoom_Text">{zoomPercentage}%</span>
                        <span className="Canvas_Link_Count_Text">{links.length} links</span>
                        <button className="Canvas_Toolbar_Button" onClick={handleResetView}><FaHome /></button>
                        <button className="Canvas_Toolbar_Button" onClick={handleLinkSelectedNotes}><FaLink /></button>
                        <button className="Canvas_Toolbar_Button"><TfiAlignJustify /></button>
                    </div>

                </section>

                <aside className={`Canvas_Right ${isChatOpen ? "Canvas_Right_Open" : "Canvas_Right_Closed"}`}>
                    <button
                        className="Chat_Toggle_Button"
                        onClick={() => setIsChatOpen((prev) => !prev)}
                    >
                        {isChatOpen ? <AiOutlineDoubleRight className="DoubleLeft"/> : <AiOutlineDoubleLeft className="DoubleRight"/>}
                    </button>

                    {isChatOpen && (
                        <>
                        <div className="Chat_Header">
                            <h2>Start Chatting</h2>
                        </div>

                        <div className="Chat_Body">
                            {chatMessages.length === 0 ? (
                            selectedNotesCount === 0 ? (
                                <p className="Chat_Empty_Text">
                                Ask a general question, or select a note to ask based on sources.
                                </p>
                            ) : (
                                <div className="Chat_Active_State">
                                <p className="Chat_Context_Text">
                                    AI will answer based on {selectedNotesCount} selected note(s).
                                </p>

                                <div className="Chat_Message Chat_Message_AI">
                                    Ask a grounded question about the selected source notes.
                                </div>
                                </div>
                            )
                            ) : (
                            <div className="Chat_Message_List">
                                {chatMessages.map((message) => (
                                <div
                                    className={`Chat_Message_Row ${
                                    message.role === "user"
                                        ? "Chat_Message_Row_User"
                                        : "Chat_Message_Row_AI"
                                    }`}
                                    key={message.id}
                                >
                                    <div className="Chat_Message_Label">
                                    {message.role === "user" ? "User" : "AI"}
                                    </div>

                                    <div
                                    className={`Chat_Message ${
                                        message.role === "user"
                                        ? "Chat_Message_User"
                                        : "Chat_Message_AI"
                                    }`}
                                    >
                                    {message.text}
                                    </div>
                                </div>
                                ))}

                                {isAiThinking && (
                                <div className="Chat_Message_Row Chat_Message_Row_AI">
                                    <div className="Chat_Message_Label">AI</div>
                                    <div className="Chat_Message Chat_Message_AI">
                                    AI is thinking...
                                    </div>
                                </div>
                                )}
                            </div>
                            )}
                        </div>

                        <div className="Chat_Input_Bar">
                            <input
                            className="Chat_Input"
                            placeholder={
                                selectedNotesCount > 0
                                ? "Ask about selected notes..."
                                : "Ask a general question..."
                            }
                            value={chatInput}
                            onChange={(event) => setChatInput(event.target.value)}
                            onKeyDown={handleChatKeyDown}
                            disabled={isAiThinking}
                            />

                            <button
                            className="Chat_Send_Button"
                            onClick={handleSendMessage}
                            disabled={isAiThinking || !chatInput.trim()}
                            >
                            <VscArrowUp />
                            </button>
                        </div>
                        </>
                    )}
                </aside>
            </main>
            <UploadFile showModal={showUploadModal} onClose={() => setShowUploadModal(false)} onUploadSuccess={handleUploadSuccess}/>
            {openedNote && (
                <div className="Note_Modal_Overlay">
                    <div className="Note_Modal">
                        <div className="Note_Modal_Header">
                            <div>
                                <h2>{openedNote.title}</h2>
                                <p>Created</p>
                                <p>2026.5.6</p>
                            </div>

                            <button className="Note_Modal_Close_Button" onClick={handleCloseNote}>
                                ×
                            </button>
                        </div>

                        <div className="Note_Modal_Body">
                            <div className="Note_Source_Column">
                                <p className="Note_Modal_Label">SOURCE TEXT</p>

                                <p className="Note_Source_Text">{openedNote.body}</p>

                                <p className="Note_Source_Text">Later, this area will show extracted PDF text, OCR results, VLM description, or selected source chunks from PgSQPL.</p>
                            </div>

                            <div className="Note_User_Column">
                                <div className="Note_Editor">
                                    <div className="Note_Editor_Header">
                                        <input className="Note_Editor_Title_Input" value={openedNote.title} readOnly/>

                                        <button className="Note_Editor_Delete_Button"><MdDelete /></button>
                                    </div>

                                    <div className="Note_Editor_Toolbar">
                                        <button type="button"><TiArrowBack /></button>
                                        <button type="button"><TiArrowForward /></button>

                                        <select onChange={(event) => handleEditorCommand("formatBlock", event.target.value)} defaultValue="p">
                                            <option value="p">Normal</option>
                                            <option value="h1">Heading 1</option>
                                            <option value="h2">Heading 2</option>
                                            <option value="blockquote">Quote</option>
                                        </select>

                                        <button type="button" onClick={() => handleEditorCommand("bold")}><b>B</b></button>
                                        <button type="button" onClick={() => handleEditorCommand("italic")}><i>I</i></button>
                                        <button type="button" onClick={() => {const url = prompt("Enter link URL:"); if (url) {handleEditorCommand("createLink", url)}}}><IoLinkSharp /></button>
                                        <button type="button" onClick={() => handleEditorCommand("formatBlock", "pre")}>&lt;&gt;</button>
                                        <button type="button" onClick={() => handleEditorCommand("insertUnorderedList")}><FaListUl /></button>
                                        <button type="button" onClick={() => handleEditorCommand("insertOrderedList")}><FaListOl /></button>
                                        <button type="button" onClick={() => handleEditorCommand("formatBlock", "blockquote")}>❝</button>
                                        <button type="button">—</button>
                                    </div>
                                    <div ref={editorRef} className="Note_Editor_Content" contentEditable suppressContentEditableWarning suppressHydrationWarning onInput={(event) => setNoteDraft(event.currentTarget.innerHTML)}/>
                                </div>
                            </div>

                        </div>

                        <div className="Note_Modal_Footer">
                            <span>{noteDraft.length} characters</span>

                            <div className="Note_Modal_Footer_Actions">
                                <button className="Note_Modal_Cancel_Button" onClick={handleCloseNote}>CANCEL</button>
                                <button className="Note_Modal_Save_Button" onClick={handleSaveNote}>SAVE</button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default CanvasBoard;