import React, { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../firebase/firebase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setRole("user");
      } else {
        setUser(null);
        setRole("guest");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
