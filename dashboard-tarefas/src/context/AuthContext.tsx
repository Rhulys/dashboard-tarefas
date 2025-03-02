"use client"
import { createContext, useState, useEffect, ReactNode } from "react"

interface AuthContextType {
    user: {id: string; name: string; email: string} | null;
    token: string | null;
    login: (token: string, userData: {id: string; name: string; email: string}) => void;
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children}: {children: ReactNode}) {
    const [user, setUser] = useState<{id: string; name: string; email: string;} | null>(null)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if(storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser))
        }
    }, [])

    function login(token: string, userData: {id: string; name: string; email: string;}) {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))
        setToken(token)
        setUser(userData)
    }

    function logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}