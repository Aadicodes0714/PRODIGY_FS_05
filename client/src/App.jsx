import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import EditProfile from "./pages/editProfile";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* =========================
                    HOME
                ========================= */}

<Route
    path="/notifications"
    element={
        <ProtectedRoute>
            <Layout>
                <Notifications />
            </Layout>
        </ProtectedRoute>
    }
/>




                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Home />
                            </Layout>
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    LOGIN
                ========================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =========================
                    REGISTER
                ========================= */}

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =========================
                    PROFILE
                ========================= */}

                <Route
                    path="/profile/:username"
                    element={<Profile />}
                />


                {/* =========================
                    EDIT PROFILE
                ========================= */}

                <Route
                    path="/edit-profile"
                    element={
                        <ProtectedRoute>
                            <EditProfile />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    EXPLORE
                ========================= */}

                <Route
                    path="/explore"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Explore />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;