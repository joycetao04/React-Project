import "./databaseSearch.css";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function DatabaseSearch({ showModal, onClose }) {

    const [docs, setDocs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchDocuments();
    }, []);

    async function fetchDocuments(search = "") {

        let query = supabase
            .from("documents")
            .select("*")
            .order("created_at", { ascending: false });
    
        if (search.trim() !== "") {
    
            query = query.ilike(
                "title",
                `%${search}%`
            );
        }
    
        const { data, error } = await query;
    
        console.log(data);
        console.log(error);
    
        if (error) {
            console.error(error);
            return;
        }
    
        setDocs(data || []);
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

                                onChange={(e) => {

                                    const value = e.target.value;

                                    setSearchTerm(value);

                                    fetchDocuments(value);
                                }}
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
                                <button className="filter-tag active">
                                    All
                                </button>

                                <button className="filter-tag">
                                    JSTOR
                                </button>

                                <button className="filter-tag">
                                    Local Archive
                                </button>

                                <button className="filter-tag">
                                    Artstor
                                </button>

                                <button className="filter-tag">
                                    Artsy
                                </button>

                                <button className="filter-tag">
                                    Custom...
                                </button>
                            </div>
                        </div>

                        <div className="database-filter-section">
                            <p className="filter-title">Content type</p>

                            <label><input type="checkbox" /> Article</label>
                            <label><input type="checkbox" /> Book / Catalog</label>
                            <label><input type="checkbox" /> Image / Artwork</label>
                            <label><input type="checkbox" /> Thesis / Report</label>
                        </div>

                        <div className="database-filter-section">
                            <p className="filter-title">Year</p>

                            <div className="year-inputs">
                                <input placeholder="FROM" />
                                <input placeholder="TO" />
                            </div>
                        </div>

                        <div className="database-filter-section">
                            <p className="filter-title">Language</p>

                            <div className="filter-tags">
                                <button className="filter-tag">
                                    English
                                </button>

                                <button className="filter-tag">
                                    Chinese
                                </button>

                                <button className="filter-tag">
                                    Other
                                </button>
                            </div>
                        </div>

                        <div className="database-filter-section">
                            <p className="filter-title">Access</p>

                            <div className="filter-tags">
                                <button className="filter-tag">
                                    Full text
                                </button>

                                <button className="filter-tag">
                                    Abstract only
                                </button>

                                <button className="filter-tag">
                                    Open access
                                </button>
                            </div>
                        </div>

                        <div className="database-filter-section">
                            <p className="filter-title">Tags</p>

                            <div className="filter-tags">
                                <button className="filter-tag">
                                    photography
                                </button>

                                <button className="filter-tag">
                                    spectral
                                </button>

                                <button className="filter-tag">
                                    archive
                                </button>

                                <button className="filter-tag">
                                    gender
                                </button>

                                <button className="filter-tag">
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