import "./databaseSearch.css";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { CiShare1 } from "react-icons/ci";

function DatabaseSearch({ showModal, onClose, onSendToBoard }) {

    const [docs, setDocs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [yearFrom, setYearFrom] = useState("");
    const [yearTo, setYearTo] = useState("");
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [sentDocId, setSentDocId] = useState(null);

    const [sourceOptions, setSourceOptions] = useState([]);
    const [contentTypeOptions, setContentTypeOptions] = useState([]);
    const [languageOptions, setLanguageOptions] = useState([]);
    const [accessTypeOptions, setAccessTypeOptions] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);

    const [selectedSources, setSelectedSources] = useState([
    /*    
        "JSTOR",
        "Local Archive",
        "Artstor",
        "Artsy",
        "Custom"
    */
    ]);
    
    const [selectedContentTypes, setSelectedContentTypes] = useState([
    /*
        "article",
        "book_catalog",
        "image_artwork",
        "thesis_report"
    */
    ]);
    
    const [selectedLanguages, setSelectedLanguages] = useState([
    /*
        "English",
        "Chinese",
        "Other"
    */
    ]);
    
    const [selectedAccessTypes, setSelectedAccessTypes] = useState([
    /*
        "full_text",
        "abstract_only",
        "open_access"
    */
    ]);

    const [selectedTags, setSelectedTags] = useState([
    /*
        "photography",
        "spectral",
        "archive",
        "gender",
        "coloniality"
    */
    ]);

    /***************************************************************************/
    /** This function loads all available filter options from the documents table */
    async function fetchFilterOptions() {
        const { data, error } = await supabase
            .from("documents")
            .select("source, content_type, language, access_type, tags");

        if (error) {
            console.error("Failed to fetch filter options:", error);
            return;
        }

        setSourceOptions([
            ...new Set(data.map((doc) => doc.source).filter(Boolean)),
        ]);

        setContentTypeOptions([
            ...new Set(data.map((doc) => doc.content_type).filter(Boolean)),
        ]);

        setLanguageOptions([
            ...new Set(data.map((doc) => doc.language).filter(Boolean)),
        ]);

        setAccessTypeOptions([
            ...new Set(data.map((doc) => doc.access_type).filter(Boolean)),
        ]);

        const allTags = data.flatMap((doc) => doc.tags || []);

        setTagOptions([
            ...new Set(allTags.filter(Boolean)),
        ]);
    }

    /***************************************************************************/
    /** This effect loads filter options from database when the popup opens */
    useEffect(() => {
        if (showModal) {
            fetchFilterOptions();
        }
    }, [showModal]);

    async function fetchDocuments(search = searchTerm) {
        let query = supabase
            .from("documents")
            .select("*")
            .order("created_at", { ascending: false });
    
        if (search.trim() !== "") {
            query = query.ilike("title", `%${search}%`);
        }
    
        if (selectedSources.length > 0) {
            query = query.in("source", selectedSources);
        }
    
        if (selectedContentTypes.length > 0) {
            query = query.in("content_type", selectedContentTypes);
        }
    
        if (selectedLanguages.length > 0) {
            query = query.in("language", selectedLanguages);
        }
    
        if (selectedAccessTypes.length > 0) {
            query = query.in("access_type", selectedAccessTypes);
        }

        if (selectedTags.length > 0) {
            query = query.overlaps("tags", selectedTags);
        }

        if (yearFrom.trim() !== "") {
            query = query.gte("publication_year", Number(yearFrom));
        }
        
        if (yearTo.trim() !== "") {
            query = query.lte("publication_year", Number(yearTo));
        }
    
        const { data, error } = await query;
    
        if (error) {
            console.error(error);
            return;
        }
    
        setDocs(data || []);
    }

    useEffect(() => {
        fetchDocuments();
    }, [
        searchTerm,
        selectedSources,
        selectedContentTypes,
        selectedLanguages,
        selectedAccessTypes,
        selectedTags,
        yearFrom,
        yearTo
    ]);

    function toggleFilter(value, selectedList, setSelectedList) {
        if (selectedList.includes(value)) {
            setSelectedList(selectedList.filter((item) => item !== value));
        } else {
            setSelectedList([...selectedList, value]);
        }
    }

    /***************************************************************************/
    /** This function converts database-style labels into readable UI text */
    function formatLabel(text) {
        return text
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    if (!showModal) {
        return null;
    }

    return (
        <div className="database-overlay">
            <div className="database-modal">

                <div className="database-topbar">

                    <div className="database-tabs">
                        <button className="database-tab active">
                            ALL
                        </button>

                        <button className="database-tab">
                            LOCAL ARCHIVE
                        </button>

                        <button className="database-tab">
                            EXTERNAL DATABASES
                        </button>
                    </div>

                    <div className="database-topbar-right">

                        <div className="database-searchbar">
                            <FiSearch className="database-search-icon" />

                            <input
                                type="text"
                                placeholder="Search articles, books, images..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            className="database-close-btn"
                            onClick={onClose}
                        >
                            ×
                        </button>

                    </div>

                </div>

                <div className="database-content">

                    <aside className="database-filter-panel">

                        <h3>FILTERS</h3>

                        <div className="database-filter-section">
                            <p className="filter-title">Source</p>

                            <div className="filter-tags">
                                {sourceOptions.map((source) => (
                                    <button
                                        key={source}
                                        className={`filter-tag ${selectedSources.includes(source) ? "active" : ""}`}
                                        onClick={() => toggleFilter(source, selectedSources, setSelectedSources)}
                                    >
                                        {formatLabel(source)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="database-filter-section">
                            <p className="filter-title">Content type</p>

                            <div className="filter-tags">
                                {contentTypeOptions.map((type) => (
                                    <button
                                        key={type}
                                        className={`filter-tag ${selectedContentTypes.includes(type) ? "active" : ""}`}
                                        onClick={() => toggleFilter(type, selectedContentTypes, setSelectedContentTypes)}
                                    >
                                        {formatLabel(type)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="database-filter-section">
                            <p className="filter-title">Year</p>

                            <div className="year-inputs">
                                <input
                                    placeholder="FROM"
                                    value={yearFrom}
                                    onChange={(e) => setYearFrom(e.target.value)}
                                />

                                <input
                                    placeholder="TO"
                                    value={yearTo}
                                    onChange={(e) => setYearTo(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="database-filter-section">
                            <p className="filter-title">Language</p>

                            <div className="filter-tags">
                                {languageOptions.map((language) => (
                                    <button
                                        key={language}
                                        className={`filter-tag ${selectedLanguages.includes(language) ? "active" : ""}`}
                                        onClick={() => toggleFilter(language, selectedLanguages, setSelectedLanguages)}
                                    >
                                        {formatLabel(language)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="database-filter-section">
                            <p className="filter-title">Access</p>

                            <div className="filter-tags">
                                {accessTypeOptions.map((access) => (
                                    <button
                                        key={access}
                                        className={`filter-tag ${selectedAccessTypes.includes(access) ? "active" : ""}`}
                                        onClick={() => toggleFilter(access, selectedAccessTypes, setSelectedAccessTypes)}
                                    >
                                        {formatLabel(access)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="database-filter-section">
                            <p className="filter-title">Tags</p>

                            <div className="filter-tags">
                                {tagOptions.map((tag) => (
                                    <button
                                        key={tag}
                                        className={`filter-tag ${selectedTags.includes(tag) ? "active" : ""}`}
                                        onClick={() => toggleFilter(tag, selectedTags, setSelectedTags)}
                                    >
                                        {formatLabel(tag)}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </aside>

                    <section className="database-results-panel">
                        <div className="database-results-header">
                            {docs.length} results • Sorted by relevance
                        </div>

                        <div className="database-results-scroll">
                            {docs.map((doc, index) => (
                                <div
                                className={`database-result-card ${
                                    selectedDoc?.id === doc.id ? "selected-card" : ""
                                }`}
                                key={index}
                                onClick={() => setSelectedDoc(doc)}
                                >
                                    <h2>{doc.title}</h2>

                                    <p className="database-meta">
                                        {doc.authors} •
                                        {" "}
                                        {doc.journal_or_platform} •
                                        {" "}
                                        {doc.publication_year} •
                                        {" "}
                                        {doc.source}
                                    </p>

                                    <p className="database-description">
                                        {doc.description}
                                    </p>

                                    <div className="database-keywords">
                                        {doc.tags && doc.tags.length > 0 ? (
                                            doc.tags.map((tag) => (
                                                <span key={tag}>{formatLabel(tag)}</span>
                                            ))
                                        ) : (
                                            <span>Other</span>
                                        )}
                                    </div>

                                    <div className="database-actions">
                                        <button>Add to Archive</button>
                                        <button
                                            className={sentDocId === doc.id ? "send-board-btn sent" : "send-board-btn"}
                                            onClick={(event) => {
                                                event.stopPropagation();

                                                if (onSendToBoard) {
                                                    onSendToBoard(doc);
                                                }

                                                setSentDocId(doc.id);

                                                setTimeout(() => {
                                                    setSentDocId(null);
                                                }, 1200);
                                            }}
                                        >
                                            {sentDocId === doc.id ? "Added ✓" : "Send to Board"}
                                        </button>
                                        <a 
                                            href={doc.source_url} 
                                            className="database-open-source"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <CiShare1 />
                                            Open source
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="database-preview-panel">

                        {selectedDoc ? (

                            <div className="preview-content">

                                <div className="preview-header">
                                    <h2>{selectedDoc.title}</h2>

                                    <p>
                                        {selectedDoc.authors} •
                                        {" "}
                                        {selectedDoc.journal_or_platform} •
                                        {" "}
                                        {selectedDoc.publication_year}
                                    </p>
                                </div>

                                <iframe
                                    src={selectedDoc.file_url || selectedDoc.source_url}
                                    title={selectedDoc.title}
                                    className="document-preview"
                                />

                            </div>

                        ) : (

                            <div className="preview-placeholder">
                                Select a result to preview
                            </div>

                        )}

                    </section>

                </div>

            </div>
        </div>
    );
}

export default DatabaseSearch;