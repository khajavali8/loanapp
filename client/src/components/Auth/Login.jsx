// import { useState, useContext } from "react";
// import { useNavigate , Link  } from "react-router-dom";
// import AuthContext from "../../context/AuthContext";
// import api from "../../services/api";

// const Login = () => {
//     const navigate = useNavigate();
//     const { login } = useContext(AuthContext);
//     const [formData, setFormData] = useState({ email: "", password: "" });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await api.post("/auth/login", formData);
//             const { token, user } = response.data; 
//             if (!user.isVerified) {
//                 alert("Your account is not verified. Please wait for admin approval.");
//                 return;
//             }
//             login(user, token);
//             alert("Login successful!");
//             navigate("/dashboard");
//         } catch (error) {
//             console.error("Login Error:", error);
//             alert(error.response?.data?.message || "Login failed.");
//         }
//     };
    

//     return (
//         <div className="auth-container">
//             <div className="auth-card">
//                 <div className="auth-header">Login</div>

//                 <form onSubmit={handleLogin}>
//     <div className="input-group">
//         <input type="email" name="email" required placeholder="Enter your email" onChange={handleChange} />
//     </div>

//     <div className="input-group">
//         <input type="password" name="password" required placeholder="Enter your password" onChange={handleChange} />
//     </div>

//     <button type="submit" className="auth-button">Login</button>
// </form>

                    
//                 <div className="auth-footer">
//                     Don't have an account? <Link to="/register">Register</Link>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default Login;


// import { useState, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import AuthContext from "../../context/AuthContext";
// import api from "../../services/api";
// import "../../styles/AuthStyles.css";

// const Login = () => {
//     const navigate = useNavigate();
//     const { login } = useContext(AuthContext);
//     const [formData, setFormData] = useState({ email: "", password: "" });
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError("");
//         setSuccess("");
//         try {
//             const response = await api.post("/auth/login", formData);
//             const { token, user } = response.data;
//             if (!user.isVerified) {
//                 setError("Your account is not verified. Please wait for admin approval.");
//                 return;
//             }
//             login(user, token);
//             setSuccess("Login successful!");
//             setTimeout(() => navigate("/dashboard"), 1000);
//         } catch (error) {
//             console.error("Login Error:", error);
//             setError(error.response?.data?.message || "Login failed.");
//         }
//     };

//     return (
//         <div className="auth-container">
//             <div className="auth-card login">
//             {error && <div className="error-message">{error}</div>}
//             {success && <div className="success-message">{success}</div>}
//                 <div className="auth-header">Login</div>
//                 <form onSubmit={handleLogin}>
//                     <div className="input-group">
//                         <input type="email" name="email" required placeholder="Enter your email" onChange={handleChange} />
//                     </div>
//                     <div className="input-group">
//                         <input type="password" name="password" required placeholder="Enter your password" onChange={handleChange} />
//                     </div>

//                     <button type="submit" className="auth-button">Login</button>
//                 </form>
//                 <div className="auth-footer">
//                     Don't have an account? <Link to="/register">Register</Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;


import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import AuthContext from "../../context/AuthContext";
import api from "../../services/api";
import "../../styles/AuthStyles.css";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const response = await api.post("/auth/login", formData);
            const { token, user } = response.data;
            
            if (!user.isVerified) {
                setError("⚠️ Your account is not verified. Please wait for admin approval.");
                return;
            }
            
            login(user, token);
            setSuccess("🎉 Login successful!");
            
            setTimeout(() => navigate("/dashboard"), 2000);
                   } catch (error) {
                            console.error("Login Error:", error);
                            setError(error.response?.data?.message || "Login failed.");
                        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card login floating">
                {error && (
                    <div className="error-message shake">
                        <Player 
                            autoplay 
                            loop 
                            src="https://assets2.lottiefiles.com/packages/lf20_jtbfg2nb.json"  
                            style={{ height: "70px", width: "70px" }} 
                        />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        <Player 
                            autoplay 
                            loop 
                            src="https://assets6.lottiefiles.com/packages/lf20_ydo1amjm.json" 
                            style={{ height: "80px", width: "80px" }} 
                        />
                        {success}
                    </div>
                )}

                <div className="auth-header">🔑 Login</div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input 
                            type="email" 
                            name="email" 
                            required 
                            placeholder="📧 Enter your email" 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            name="password" 
                            required 
                            placeholder="🔒 Enter your password" 
                            onChange={handleChange} 
                        />
                    </div>

                    <button type="submit" className="auth-button"> Login</button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
