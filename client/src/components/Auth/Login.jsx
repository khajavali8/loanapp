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
    const [otp, setOtp] = useState("");
    const [useOtp, setUseOtp] = useState(false);
    const [otpRequested, setOtpRequested] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const requestOtp = async () => {
        setError("");
        setSuccess("");
        try {
            await api.post("/auth/send-otp", { email: formData.email });
            setSuccess("📩 OTP sent to your email.");
            setOtpRequested(true);
        } catch (error) {
            setError("❌ Failed to send OTP.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            let payload = useOtp ? { email: formData.email, otp } : formData;
            let endpoint = useOtp ? "/auth/verify-otp" : "/auth/login";

            const response = await api.post(endpoint, payload);
            const { token, user } = response.data;

            login(user, token);
            setSuccess("🎉 Login successful!");
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (error) {
            setError("❌ Login failed.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card login">
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="auth-header">🔑 Login</div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input type="email" name="email" required placeholder="📧 Enter email" onChange={handleChange} />
                    </div>

                    {!useOtp && (
                        <div className="input-group">
                            <input type="password" name="password" required placeholder="🔒 Enter password" onChange={handleChange} />
                        </div>
                    )}

                    {useOtp && otpRequested && (
                        <div className="input-group">
                            <input type="text" name="otp" required placeholder="🔢 Enter OTP" onChange={handleOtpChange} />
                        </div>
                    )}

                    <button type="submit" className="auth-button">{useOtp ? "✅ Verify OTP" : "🔓 Login"}</button>
                </form>

                {!useOtp ? (
                    <button className="auth-button" onClick={() => setUseOtp(true)}>🔄 Login with OTP</button>
                ) : (
                    <button className="auth-button" onClick={requestOtp}>📩 Request OTP</button>
                )}

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
