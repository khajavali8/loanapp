import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        setTimeout(() => {
            navigate("/");
        },);
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.brand}>
                <h2 style={{color:"lightcyan"}}>FARM-IT</h2>
            </div>
            <div style={styles.navLinks}>
                {/* <Link to="/" style={styles.link}>Home</Link> */}
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                {/* <Link to="/common/report-issue" style={styles.link}>Report Issue</Link>  */}

                {!user ? (
                    <div
                        style={styles.signup}
                        onMouseEnter={() => setShowDropdown(true)}
                        onMouseLeave={() => setShowDropdown(false)}
                    >
                        <span style={styles.link}>Signup </span>
                        {showDropdown && (
                            <div style={styles.dropdown}>
                                <Link to="/login" style={styles.dropdownItem}>Login</Link>
                                <Link to="/register" style={styles.dropdownItem}>Register</Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={handleLogout} style={styles.button}>Logout</button>
                )}
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        background: '#2c3e50',
        color: 'white',
        zIndex: 1000,
    },
    brand: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    link: {
        textDecoration: 'none',
        color: 'white',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    signup: {
        position: 'relative',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        background: 'white',
        color: '#2c3e50',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '5px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    },
    dropdownItem: {
        padding: '8px 15px',
        textDecoration: 'none',
        color: '#2c3e50',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        transition: 'background 0.2s',
    },
    button: {
        backgroundColor: '#d9534f',
        color: 'white',
        padding: '6px 12px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '0.9rem',
        cursor: 'pointer',
    },
};

export default Navbar;
