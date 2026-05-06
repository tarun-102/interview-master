import { createContext, useState  } from "react";
import { getMe } from "./services/auth.api";

export const AuthCOntext = createContext()

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    

    
    return(
        <AuthCOntext.Provider value={{user,setUser, loading, setLoading}}>
            {children}
        </AuthCOntext.Provider>
    )
}

