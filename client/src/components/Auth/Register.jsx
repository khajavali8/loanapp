// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../../services/api";
// import "../../styles/AuthStyles.css";

// const Register = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({ 
//         firstName: "", 
//         lastName: "", 
//         email: "", 
//         password: "", 
//         role: "" 
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleRegister = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await api.post("/auth/register", formData);
//             alert("Registration successful! Please login.");
//             console.log("Response:", response.data);
//             navigate("/login");  
//         } catch (error) {
//             console.error("Registration Error:", error);
//             alert(error.response?.data?.message || "Registration failed.");
//         }
//     };

//     return (
//         <div className="auth-container">
//             <div className="auth-card">
//                 <div className="auth-header">Register</div>

//                 <form onSubmit={handleRegister}>
//     <div className="input-group">
//         <input type="text" name="firstName" required placeholder="Enter your first name" onChange={handleChange} />
//     </div>

//     <div className="input-group">
//         <input type="text" name="lastName" required placeholder="Enter your last name" onChange={handleChange} />
//     </div>

//     <div className="input-group">
//         <input type="email" name="email" required placeholder="Enter your email" onChange={handleChange} />
//     </div>

//     <div className="input-group">
//         <input type="password" name="password" required placeholder="Enter your password" onChange={handleChange} />
//     </div>

//     <div className="input-group">
//         <select name="role" required onChange={handleChange}>
//             <option value="">Select Role</option>
//             <option value="farmer">Farmer</option>
//             <option value="investor">Investor</option>
//         </select>
//     </div>

//     <button type="submit" className="auth-button">Register</button>
// </form>


//                 <div className="auth-footer">
//                     Already have an account? <Link to="/login">Login</Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Register;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import "../../styles/AuthStyles.css";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
    });
    const [profilePic, setProfilePic] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0]); // Store the uploaded file
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        const formDataWithFile = new FormData();
        for (let key in formData) {
            formDataWithFile.append(key, formData[key]);
        }
    
        if (profilePic) {
            formDataWithFile.append("profilePic", profilePic);
        }
    
        try {
            const response = await api.post("/auth/register", formDataWithFile, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccess("Registration successful! Please login.");
            setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            console.error("Registration Error:", error);
            setError(error.response?.data?.message || "Registration failed.");
        }
    };
    
    return (
        <div className="auth-container">
            <div className="auth-card register">
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <div className="auth-header">Register</div>
                <form onSubmit={handleRegister} encType="multipart/form-data">
                    <div className="input-group">
                        <input type="text" name="firstName" required placeholder="Enter your first name" onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <input type="text" name="lastName" required placeholder="Enter your last name" onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <input type="email" name="email" required placeholder="Enter your email" onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <input type="password" name="password" required placeholder="Enter your password" onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <select name="role" required onChange={handleChange}>
                            <option value="">Select Role</option>
                            <option value="farmer">Farmer</option>
                            <option value="investor">Investor</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <input type="file" name="profilePic" accept="image/*" onChange={handleFileChange} />
                    </div>
                    <button type="submit" className="auth-button">Register</button>
                </form>
                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
