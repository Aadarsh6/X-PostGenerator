import { createContext, useContext, useState } from "react";
const avatar1 = "/new.png"


const AvatarContext = createContext();

export const AvatarProvider = ({children}) => {
    const [avatar, setAvatar] = useState(avatar1);
    return (
        <AvatarContext.Provider value={{avatar, setAvatar}}>
            {children}
        </AvatarContext.Provider>
    )
}

export const useAvatar = () => useContext(AvatarContext)