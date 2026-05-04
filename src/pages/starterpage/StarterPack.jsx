import './StarterCSS.css';
import { useCollapse } from 'react-collapsed';
import { useNavigate } from 'react-router-dom';

function StarterPack(props) {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

    const navigate = useNavigate();
    const handleArtThread = () => {
        navigate('/ArtThreadsPage');
    };

    return (
        <div>
            <div className='StarterHeader'>
                <img className="StarterHeaderImg" src={props.Header_Img}></img>
                <h1 id='StarterHeaderH1'>Starter Pack</h1>
                <h4 id='StarterHeaderH4'>Start smart. Research with confidence.</h4>
            </div>

            <div className='StarterIntor'>
                <h1 id="StarterIntorH1">
                    <span id="smallIntro">What is </span>
                    <span id="mainTitle">ART HISTORY?</span>
                </h1>
                <p id="StarterIntorP">{props.Intro_P}</p>
                <img id="StarterIntorImg" src={props.Intro_Picture}></img>
            </div>

            <div className='Learn_More_Description'>
                <h1 id="LearnMoreH1">
                    <span className="SmallLearnMoreTitile">Categorization & Core Themes in </span>
                    <span className="MainLearnMoreTitile">ART HISTORY</span>
                </h1>
                <p id="LearnMoreP">
                    <span className="GreyLearnMoreP">
                        Art history is a vast discipline that spans from prehistory to the future, covering cultures
                        and regions across the globe. It encompasses nearly all forms of human visual creation.
                        Art history is not limited to what people often consider as traditional art like, painting and
                        sculpture, but also includes architecture, photography, film, fashion, digital art, even
                        advertising, street art, and game design. Art history is not an isolated subject; it is a
                        multidisciplinary field that intersects with history, philosophy, politics, religion,
                        technology, psychology, etc., making its scope highly complex. 
                    </span>
                    <span className="BrownLearnMoreP"> As a result, it is difficult for art historians to master the 
                        entirety of art history, and they typically focus on a
                        specific subfield for in-depth research.
                    </span>
                </p>
                <button id="LearnMoreButton" onClick={handleArtThread}>
                    Learn more at Art Threads
                </button>
                <img id="LearnMoreImg" src={props.LearnMoreImg}></img>
            </div>

            <div className='Read_More_Description'>
                <h1 id='LearnMoreTitle'>
                    <span className='Read_More_Header1'>ART HISTORY </span>
                    <span className='Read_More_Header2'>Methodologies</span>
                </h1>
                <p className="ReadMoreP" id="ReadMoreBeforeClcikP">{props.Read_More_Description_Show}</p>

                <section {...getCollapseProps()}>
                    <p className="ReadMoreP" id="ReadMoreClickP">{props.Read_More_Description_Click2Show}</p>
                </section>

                <button className="ReadMoreButton" {...getToggleProps()}>
                    {isExpanded ? 'Read Less' : 'Read More'}
                </button>
            </div>

            <div className='Resources_Flex_Box'>
                <div className="Curated_Resources">
                    <h2 className="ResourceLeftH2">Curated Resources</h2>
                    <ul id="ResourceListLeft">
                        <li><a href=''>Finding Images</a></li>
                        <li><a href=''>Art Dietionaries</a></li>
                        <li><a href=''>Art Encyclopedias</a></li>
                        <li><a href=''>Primary Sources for Art History</a></li>
                        <li><a href=''>Secondary Sources</a></li>
                        <li><a href=''>Exhibition Catalogues</a></li>
                        <li><a href=''>Articles in Scholarly Journals</a></li>
                        <li><a href=''>Online Resources</a></li>
                        <li><a href=''>Digital Humanities</a></li>
                        <li><a href=''>Podcasts in Art History</a></li>
                        <li><a href=''>Important Libraries for Art History</a></li>
                        <li><a href=''>Other Guides useful for Art History research</a></li>
                    </ul>
                </div>

                <div className="Cite_Right">
                    <h2 className="ResourceRightH2">Cite Right</h2>
                    <ul id="ResourceListRight">
                        <li><a href=''>MLA</a></li>
                        <li><a href=''>APA</a></li>
                        <li><a href=''>Chieago</a></li>
                        <li><a href=''>National Library of Medicine</a></li>
                        <li><a href=''>(NLM)</a></li>
                        <li><a href=''>ASA</a></li>
                        <li><a href=''>Vancouver</a></li>
                        <li><a href=''>CSE</a></li>
                        <li><a href=''>EEE</a></li>
                        <li><a href=''>Citing Artificial Intelligence</a></li>
                        <li><a href=''>Manage Citations</a></li>
                    </ul>
                </div>
            </div>
        </div>
        
    );
}

export default StarterPack;
