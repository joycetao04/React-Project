import StarterPack from "./StarterPack"
import StarterPageHeaderImg from "../../assets/StarterPageHeading.png";
import StarterPageInroImg from "../../assets/StarterIntroPic.jpg"
import LearnMoreImg from "../../assets/LearnMorePic.png"
function StarterPage() {

    return(
        <div>
            <StarterPack 
                Header_Img={StarterPageHeaderImg}
                Intro_P="Art history studies how humans have created, appreciated, and understood art across
                        time and cultures. Art historians study to understand how humans have used visual
                        elements to express ideas, record the world, and shape social values through horizontal,
                        and vertical comparisons"
                Intro_Picture={StarterPageInroImg}
                LearnMoreImg={LearnMoreImg}
                Read_More_Description_Show="To help us understand the story and meaning of art, art historians view it through the lens of art methodology. Each method helps us understand an aspect of the artwork, and methodologies help us develop a comprehensive understanding of the work. There are too many methodologies that have been developed over the years to cover them all here, in the following five of the most commonly used perspectives are presented."
                Read_More_Description_Click2Show="Formal Analysis:
                                                Formalism is the study of the compositional elements of art by analyzing and comparing the colors, lines, shapes, textures, and other purely visual elements of a work. 

                                                Biography:
                                                Biographical interpretations of art focus on the life and times of the artist. Stories about the artist can inform and enrich the work of art itself.

                                                Iconography:
                                                Iconography is an approach to the study of art history that analyzes the visual signs, symbols, and themes of works of art. It aims to understand the meaning of a work of art at the time of its creation. It examines the images, symbols, and stories in works of art and the cultural and historical meanings they carry.

                                                Critical Theory:
                                                Critical theory or “socio-critical theory” is a broad term that refers to the various ways in which artworks are attempted to be understood through the social structures and pressures that affect them. A body of theory that critically analyzes society, culture, and ideology to reveal and challenge power structures, social injustice, and the shaping of human thought by ideology. For example, Marxism, Feminism, Post-colonialism, Queer Theory etc.
                                                
                                                Psychoanalytic Approaches:
                                                The psychoanalytic approach in art history applies ideas from psychology—especially the theories of Sigmund Freud and Jacques Lacan—to interpret artworks, artists, and viewers.
                                                It assumes that art is shaped by unconscious desires, fears, and repressed emotions, and that images can reveal the hidden workings of the mind.
                                                "
            />
        </div>
    );
  
}
export default StarterPage