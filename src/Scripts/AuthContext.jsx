import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        const data = localStorage.getItem("user") || sessionStorage.getItem("user")
        if (data !== null) {
            setIsAuth(true)
            // get_Favorite_by_user(JSON.parse(data).User_KEY)
            // All_Favorite_by_user(JSON.parse(data).User_KEY)
        } else {
            setIsAuth(false)
        }
    }, [])

    return <AuthContext.Provider
        value={{
            isAuth,
            setIsAuth,
        }}
    >
        {children}
    </AuthContext.Provider>

}
