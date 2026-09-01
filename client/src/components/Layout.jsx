import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout({ children }) {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="app-layout">

            {/* NAVBAR */}
            <nav className="navbar">

                <Link to="/" className="logo">
                    🌐 SocialSphere
                </Link>

                <div className="nav-right">

                    <Link to={`/profile/${user?.username}`}>
                        👤 {user?.name || "Profile"}
                    </Link>

                    <button onClick={handleLogout}>
                        Logout
                    </button>

                </div>

            </nav>


            {/* MAIN CONTENT */}
            <main className="main-content">

                {children}

            </main>

        </div>
    );
}

export default Layout;