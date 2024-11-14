import { createContext, useContext, useState } from "react";

const AuthContext = createContext();


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isSignin, setIsSignin] = useState(false);

    const setAuth = authUser => {
        setUser(authUser);
        setIsSignin(true);
    }

    const SetUserData = userData => {
        setUser({...userData});
    }

    const signOut = async () => {
        try {
            setUser(null);
            setIsSignin(false);
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    return (
        <AuthContext.Provider value={{isSignin, user, setAuth, SetUserData, signOut}}>
            {children}
        </AuthContext.Provider>

    )
}


export const useAuth = () => useContext(AuthContext);

