import axios from "axios";
import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [foundClient, setfoundClient] = useState(false);

  useEffect(() => {
    const recoveredUser = localStorage.getItem("user");
    if (recoveredUser) {
      setUser(JSON.parse(recoveredUser));
    }
    setLoading(false);
  }, []);

  function refreshPage() {
    window.location.reload(false);
  }

  const login = async (user, email, pass) => {
    const loggedUser = {
      user,
      email,
    };
    localStorage.setItem("user", JSON.stringify(loggedUser));
    do {
      const { data } = await axios.get(`http://localhost:3001/selectCliente`);
      {
        let md5Pass = CryptoJS.MD5(pass).toString();
        data.map((usuario) => {
          if (
            email === usuario.email_cliente &&
            md5Pass === usuario.senha_cliente
          ) {
            setfoundClient(true);
            setUser(loggedUser);
            localStorage.setItem("userID", usuario.id_cliente);
            navigate("/");
            refreshPage();
          }
        });
      }
    } while (foundClient === false);
  };

  const loginWithRedirect = async (user, email, pass) => {
    const loggedUser = {
      user,
      email,
    };
    localStorage.setItem("user", JSON.stringify(loggedUser));
    do {
      const { data } = await axios.get(`http://localhost:3001/selectCliente`);
      {
        data.map((usuario) => {
          if (
            email === usuario.email_cliente &&
            pass === usuario.senha_cliente
          ) {
            setfoundClient(true);
            setUser(loggedUser);
            localStorage.setItem("userID", usuario.id_cliente);
            navigate("/conferirEndereco");
            refreshPage();
          }
        });
      }
    } while (foundClient === false);
  };

  const logout = () => {
    localStorage.removeItem("userID");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated: !!user,
        user,
        loading,
        login,
        logout,
        loginWithRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
