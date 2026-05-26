"use client" ;

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ToggleTheme() {

    const { theme, setTheme } = useTheme();

    return (

        <button onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
        }} className="">

            {
                theme === "dark" ? (
                    <Sun size={18} />
                ) : (
                    <Moon size={18} />
                )
            }

        </button>

    )


};