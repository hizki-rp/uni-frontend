import { createContext, useState, useContext, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../apiConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginUser = useCallback(
    async (username, password) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/token/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          setAuthTokens(data);
          const decodedUser = jwtDecode(data.access);
          setUser(decodedUser);
          localStorage.setItem("authTokens", JSON.stringify(data));

          if (decodedUser.groups.includes("admin") || decodedUser.is_staff) {
            navigate("/admin/users");
          } else {
            navigate("/universities");
          }
          return null; // Indicate success
        } else {
          const errorData = await response.json().catch(() => ({}));
          return errorData.detail || `Login failed: ${response.statusText}`;
        }
      } catch (error) {
        return "A network error occurred. Please try again.";
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const logoutUser = useCallback(() => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  }, [navigate]);

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    loading,
  };

  // NOTE: A robust implementation would also handle token refreshing.

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
