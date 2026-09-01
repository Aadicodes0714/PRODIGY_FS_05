import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        const getCurrentUser = async () => {

            try {

                const response = await API.get("/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(response.data.user);

            } catch (error) {

                console.log("Authentication failed");

                localStorage.removeItem("token");
                setUser(null);

            } finally {

                setLoading(false);

            }
        };

        getCurrentUser();

    }, []);


    const login = (userData, token) => {

        localStorage.setItem("token", token);

        setUser(userData);
    };


    const logout = () => {

        localStorage.removeItem("token");

        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
};