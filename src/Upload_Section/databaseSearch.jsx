import "./databaseSearch.css";
import { FiSearch } from "react-icons/fi";

const sampleDocs = [
    {
        title: "When Patriarchy Is a Ghost: Spectral Images in Contemporary Photography",
        meta: "Joyce Li • Journal of Visual Culture • 2023 • JSTOR",
        description: "This article examines how contemporary photographers utilize spectral imagery to interrogate patriarchal structures...",
        tags: ["photography", "spectral", "gender", "article"],
    },
    {
        title: "The Archive as Haunted Space: Memory, Photography, and Colonial Violence",
        meta: "Maria Santos • Photography & Culture • 2022 • JSTOR",
        description: "Exploring the relationship between photographic archives and colonial histories...",
        tags: ["archive", "photography", "coloniality", "article"],
    },
    {
        title: "Spectral Aesthetics: Photography and the Question of Presence",
        meta: "David Chen • October • 2021 • JSTOR",
        description: "An investigation into the ontology of the photographic image through the lens of spectrality...",
        tags: ["photography", "spectral", "article"],
    },
    {
        title: "Museums, Memory, and the Politics of Visual Evidence",
        meta: "Amina Rahman • Museum Studies Review • 2020 • Local Archive",
        description: "This paper considers how museum collections shape public memory through visual documentation...",
        tags: ["museum", "memory", "archive"],
    },
    {
        title: "Colonial Archives and Contemporary Image Practices",
        meta: "Leo Martin • Art History Quarterly • 2019 • Artstor",
        description: "A study of how contemporary artists reuse colonial photographic archives in critical visual practice...",
        tags: ["coloniality", "image", "archive"],
    },
];

function DatabaseSearch({ showModal, onClose }) {
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
                            8 results • Sorted by relevance
                        </div>

                        <div className="database-results-scroll">
                            {sampleDocs.map((doc, index) => (
                                <div className="database-result-card" key={index}>
                                    <h2>{doc.title}</h2>

                                    <p className="database-meta">
                                        {doc.meta}
                                    </p>

                                    <p className="database-description">
                                        {doc.description}
                                    </p>

                                    <div className="database-keywords">
                                        {doc.tags.map((tag) => (
                                            <span key={tag}>{tag}</span>
                                        ))}
                                    </div>

                                    <div className="database-actions">
                                        <button>Add to Archive</button>
                                        <button>Send to Board</button>
                                        <a href="/">Open source</a>
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