import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    const themeStyles = {
        light: {
            background: "#FFFFFF",
            background2: "#f9f9f9",
            text: "#000000",
            subText: "#666666",
            cardBackground: "#F8F8F8",
            primary: "#4B0082",
        },
        dark: {
            background: "#000000",
            background2: "#111",
            text: "#FFFFFF",
            subText: "#AAAAAA",
            cardBackground: "#222222",
            primary: "#4B0082",
        },
    };


    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, themeStyles }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
