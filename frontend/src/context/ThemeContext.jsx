import { createContext, useContext, useEffect, useMemo, useState } from "react";
const ThemeContext = createContext(null);
const darkTheme={black:"#080a0b",blue:"#06304d",blueLight:"#0b4265",gold:"#e9a91a",red:"#d83b32",cream:"#f2e8d5",white:"#ffffff",muted:"#aaa69b",border:"#c88b12",surface:"#111820"};
const lightTheme={black:"#f7f3ea",blue:"#fffdf8",blueLight:"#f0e5cf",gold:"#b86b00",red:"#b42318",cream:"#17130d",white:"#ffffff",muted:"#665f55",border:"#c88b12",surface:"#ffffff"};
export function ThemeProvider({children}){const [mode,setMode]=useState(()=>localStorage.getItem("vv-theme")||"dark"); const theme=useMemo(()=>mode==="light"?lightTheme:darkTheme,[mode]); useEffect(()=>{Object.entries(theme).forEach(([k,v])=>document.documentElement.style.setProperty(`--${k}`,v));document.documentElement.dataset.theme=mode;document.body.style.background=theme.black;document.body.style.color=theme.cream;localStorage.setItem("vv-theme",mode)},[theme,mode]); const toggleTheme=()=>setMode(m=>m==="dark"?"light":"dark"); return <ThemeContext.Provider value={{theme,mode,setMode,toggleTheme}}>{children}</ThemeContext.Provider>}
export function useTheme(){return useContext(ThemeContext)}
