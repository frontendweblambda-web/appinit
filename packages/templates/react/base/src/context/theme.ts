import {useState,createContext,useMemo} from 'react'
import type {ReactNode} from 'react'
type Theme="light"|"dark";
type ThemeState={
    theme:Theme,
    toggleTheme:(theme:Theme)=>void
}
const ThemeContext = createContext<ThemeState|undefined>(undefined)

export default function ThemeProvider({children}:{children:ReactNode}){
    const [theme,setTheme]=useState<Theme>("light")

    const toggleTheme=()=>{

    }
    const value = useMemo(()=>({theme,toggleTheme}),[theme,toggleTheme])
    return(
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}