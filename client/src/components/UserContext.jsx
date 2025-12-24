import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// this is var and it works as a createContext
// bascially createContext is a bow in which you can store all the data and different components can use that data
const UserContext = createContext()

export const UserProvider = ({ children }) => {

    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(
        () => {
            const takeUser = sessionStorage.getItem("user")    // whenever it loads it takes the userInfo from localstorage
            if (takeUser && takeUser !== "undefined") {
                
                try {
                    setUser(JSON.parse(takeUser))           
                } catch (error) {
                    console.error("Failed to fetch the value of user from local storage",error)
                    sessionStorage.removeItem("user")
                }
            }
        }
        , [])


    // this login function will take user's data as args and store the data in local storage, also it sets user var in that current user. 
    const login = (userData) => {
        console.log("Login was called with: ",userData)
        setUser(userData)
        sessionStorage.setItem("user", JSON.stringify(userData))
        console.log("User saved: ",sessionStorage.getItem("user"))
    }

    // this shit for logout, fckin copy of login
    // and right now it's ain't needed 
    const logout = () => {
        setUser(null);
        sessionStorage.removeItem("user");
        navigate('/')
    };

    // here the magic happens
    // the "UserContext" is a createContext which is a box
    // it has 2 param .Provider and .Consumer
    // the provider will provide the values to {children}
    // which means the components that wrapped inside the "UserProvider" 
    // why UserProvider, bcoz that what we r exporting you piece of shit mthafckin nigga
    // the value which are in double curly braces, that's what we giving to everyone
    // why in double curly braces, bcoz it's a object with same name of key & value pair u mothafcker, r u really enjoyin ragebaitin me nigga
    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}

// the useContext() is used to take the value from the UserContext (createContext)
//  instead of UserContext.provider which is really a old fckin shit, man.

export const useUserData = () => useContext(UserContext)
