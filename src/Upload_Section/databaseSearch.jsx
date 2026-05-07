import "./databaseSearch.css";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function DatabaseSearch({ showModal, onClose }) {

    const [docs, setDocs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [yearFrom, setYearFrom] = useState("");
    const [yearTo, setYearTo] = useState("");

    const [selectedSources, setSelectedSources] = useState([
        "JSTOR",
        "Local Archive",
        "Artstor",
        "Artsy",
        "Custom"
    ]);
    
    const [selectedContentTypes, setSelectedContentTypes] = useState([
        "article",
        "book_catalog",
        "image_artwork",
        "thesis_report"
    ]);
    
    const [selectedLanguages, setSelectedLanguages] = useState([
        "English",
        "Chinese",
        "Other"
    ]);
    
    const [selectedAccessTypes, setSelectedAccessTypes] = useState([
        "full_text",
        "abstract_only",
        "open_access"
    ]);

    const [selectedTags, setSelectedTags] = useState([
        "photography",
        "spectral",
        "archive",
        "gender",
        "coloniality"
    ]);

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

    function toggleFilter(value, selectedList, setSelectedList) {
        if (selectedList.includes(value)) {
            setSelectedList(selectedList.filter((item) => item !== value));
        } else {
            setSelectedList([...selectedList, value]);
        }
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
                                <button
                                    className={`filter-tag ${selectedSources.includes("JSTOR") ? "active" : ""}`}
                                    onClick={() => toggleFilter("JSTOR", selectedSources, setSelectedSources)}
                                >
                                    JSTOR
                                </button>

                                <button
                                    className={`filter-tag ${selectedSources.includes("Local Archive") ? "active" : ""}`}
                                    onClick={() => toggleFilter("Local Archive", selectedSources, setSelectedSources)}
                                >
                                    Local Archive
                                </button>

                                <button
                                    className={`filter-tag ${selectedSources.includes("Artstor") ? "active" : ""}`}
                                    onClick={() => toggleFilter("Artstor", selectedSources, setSelectedSources)}
                                >
                                    Artstor
                                </button>

                                <button
                                    className={`filter-tag ${selectedSources.includes("Artsy") ? "active" : ""}`}
                                    onClick={() => toggleFilter("Artsy", selectedSources, setSelectedSources)}
                                >
                                    Artsy
                                </button>

                                <button
                                    className={`filter-tag ${selectedSources.includes("Custom...") ? "active" : ""}`}
                                    onClick={() => toggleFilter("Custom...", selectedSources, setSelectedSources)}
                                >
                                    Custom...
                                </button>
                            </div>
                        </div>

                        <div className="database-filter-section">
                            <p className="filter-title">Content type</p>

                            <div className="filter-tags">
                                <button
                                    className={`filter-tag ${selectedContentTypes.includes("article") ? "active" : ""}`}
                                    onClick={() => toggleFilter("article", selectedContentTypes, setSelectedContentTypes)}
                                >
                                    Article
                                </button>

                                <button
                                    className={`filter-tag ${selectedContentTypes.includes("book_catalog") ? "active" : ""}`}
                                    onClick={() => toggleFilter("book_catalog", selectedContentTypes, setSelectedContentTypes)}
                                >
                                    Book / Catalog
                                </button>

                                <button
                                    className={`filter-tag ${selectedContentTypes.includes("image_artwork") ? "active" : ""}`}
                                    onClick={() => toggleFilter("image_artwork", selectedContentTypes, setSelectedContentTypes)}
                                >
                                    Image / Artwork
                                </button>

                                <button
                                    className={`filter-tag ${selectedContentTypes.includes("thesis_report") ? "active" : ""}`}
                                    onClick={() => toggleFilter("thesis_report", selectedContentTypes, setSelectedContentTypes)}
                                >
                                    Thesis / Report
                                </button>
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

                                <button
                                    className={`filter-tag ${selectedLanguages.includes("English") ? "active" : ""}`}
                                    onClick={() => toggleFilter("English", selectedLanguages, setSelectedLanguages)}
                                >
                                    English
                                </button>

                                <button
                                    className={`filter-tag ${selectedLanguages.includes("Chinese") ? "active" : ""}`}
                                    onClick={() => toggleFilter("Chinese", selectedLanguages, setSelectedLanguages)}
                                >
                                    Chinese
                                </button>

                                <button
                                    className={`filter-tag ${selectedLanguages.includes("Other") ? "active" : ""}`}
                                    onClick={() => toggleFilter("Other", selectedLanguages, setSelectedLanguages)}
                                >
                                    Other
                                </button>

                                </div>
                        </div>

                        <div className="database-filter-section">
                            <p className="filter-title">Access</p>

                            <div className="filter-tags">

                                <button
                                    className={`filter-tag ${selectedAccessTypes.includes("full_text") ? "active" : ""}`}
                                    onClick={() => toggleFilter("full_text", selectedAccessTypes, setSelectedAccessTypes)}
                                >
                                    Full text
                                </button>

                                <button
                                    className={`filter-tag ${selectedAccessTypes.includes("abstract_only") ? "active" : ""}`}
                                    onClick={() => toggleFilter("abstract_only", selectedAccessTypes, setSelectedAccessTypes)}
                                >
                                    Abstract only
                                </button>

                                <button
                                    className={`filter-tag ${selectedAccessTypes.includes("open_access") ? "active" : ""}`}
                                    onClick={() => toggleFilter("open_access", selectedAccessTypes, setSelectedAccessTypes)}
                                >
                                    Open access
                                </button>

                                </div>
                        </div>

                        <div className="database-filter-section">
                            <p className="filter-title">Tags</p>

                            <div className="filter-tags">

                                <button
                                    className={`filter-tag ${selectedTags.includes("photography") ? "active" : ""}`}
                                    onClick={() => toggleFilter("photography", selectedTags, setSelectedTags)}
                                >
                                    photography
                                </button>

                                <button
                                    className={`filter-tag ${selectedTags.includes("spectral") ? "active" : ""}`}
                                    onClick={() => toggleFilter("spectral", selectedTags, setSelectedTags)}
                                >
                                    spectral
                                </button>

                                <button
                                    className={`filter-tag ${selectedTags.includes("archive") ? "active" : ""}`}
                                    onClick={() => toggleFilter("archive", selectedTags, setSelectedTags)}
                                >
                                    archive
                                </button>

                                <button
                                    className={`filter-tag ${selectedTags.includes("gender") ? "active" : ""}`}
                                    onClick={() => toggleFilter("gender", selectedTags, setSelectedTags)}
                                >
                                    gender
                                </button>

                                <button
                                    className={`filter-tag ${selectedTags.includes("coloniality") ? "active" : ""}`}
                                    onClick={() => toggleFilter("coloniality", selectedTags, setSelectedTags)}
                                >
                                    coloniality
                                </button>

                            </div>
                        </div>

                    </aside>

                    <section className="database-results-panel">
                        <div className="database-results-header">
                            {docs.length} results • Sorted by relevance
                        </div>

                        <div className="database-results-scroll">
                            {docs.map((doc, index) => (
                                <div className="database-result-card" key={index}>
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

                                    <div className="database-actions">
                                        <button>Add to Archive</button>
                                        <button>Send to Board</button>
                                        <a href={doc.source_url}>Open source</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="database-preview-panel">

                        <div className="preview-placeholder">
                            Select a result to preview
                        </div>

                    </section>

                </div>

            </div>
        </div>
    );
}

export default DatabaseSearch;