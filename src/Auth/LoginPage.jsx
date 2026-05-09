import React, {useState} from "react";
import "./LoginPage.css";

import { FcGoogle } from "react-icons/fc";


function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginSubmit = async(event) => {
        event.preventDefault();

        setErrorMessage("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.error || "Login failed.");
                return;
            }

            localStorage.setItem("nexo_token", data.token);
            localStorage.setItem("nexo_user", JSON.stringify(data.user));

            window.location.href = "/";
        } catch (error) {
            console.error("Login request error:", error);
            setErrorMessage("Cannot connect to server/ Please try again.")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="Login_Page">
            <form className="Login_Card" onSubmit={handleLoginSubmit}>
                <p className="Login_Brand">NEXO</p>

                <h1>Sign in</h1>
                <p className="Login_Subtitle">Enter your credentials to continue</p>

                <label className="Login_Label">EMAIL</label>
                <input className="Login_Input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

                <div className="Login_Row">
                    <label className="Login_Label">PASSWORD</label>
                    <button type="button" className="Login_Forgot_Button">Forgot?</button>
                </div>

                <input className="Login_Input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />

                {errorMessage && (
                    <p className="Login_Error_Message">{errorMessage}</p>
                )}

                <button className="Login_Continue_Button" type="submit" disabled={isLoading}>{isLoading ? "SIGNING IN..." : "CONTINUE"}</button>

                <div className="Login_Divider">
                    <span></span>
                    <p>OR</p>
                    <span></span>
                </div>

                <button type="button" className="Login_Google_Button">
                    <span className="Login_Google_Icon"><FcGoogle /></span>
                    Continue with Google
                </button>

                <p className="Login_Signup_Text">
                    No account? <button type="button">Sign up</button>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;