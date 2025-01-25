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
            background3: "#f0f0f0",
            background4: "#f0f0f0",
            text: "#000000",
            text1: "#CCCCCC",
            subText: "#666666",
            cardBackground: "#F8F8F8",
            primary: "#4B0082",
            secondary: "#FFA500",
            accent: "#FF4500",
            border: "#E0E0E0",
            shadow: "#000000",
            line: "#5F5959"
        },
        dark: {
            background: "#000000",
            background2: "#111",
            background3: "#2A2A2A",
            background4: "#2E2E2E",
            text: "#FFFFFF",
            text1: "#333",
            subText: "#AAAAAA",
            cardBackground: "#222222",
            primary: "#4B0082",
            secondary: "#FF6347",
            accent: "#FFA07A",
            border: "#444444",
            shadow: "#FFFFFF",
            line: "#4B0082"
        },
    };


    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, themeStyles }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
