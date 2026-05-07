import React from "react";
import "./Header.css";

function Header(){
    const Title = "NEXO";
    const Slogan = "Make thinking visible. Let ideas grow freely.";
    const ButtonText = "🗪 Share";
    return (
        <header className="Canvas_Header">
            <div className="Canvas_Text">
                <h1>{Title}</h1>
                <p>{Slogan}</p>
            </div>
            <button className="Canvas_Button">{ButtonText}</button>
        </header>
    );
}

export default Header;