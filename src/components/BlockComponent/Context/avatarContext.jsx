import { useAuthStore } from "@/store/authStore";
import { createContext, useContext } from "react";

const AvatarContext = createContext({
  avatar: `https://api.dicebear.com/7.x/initials/svg?seed=User`
});

export const useAvatar = () => useContext(AvatarContext);

export const AvatarProvider = ({ children }) => {
  const { user } = useAuthStore();
  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`;

  return (
    <AvatarContext.Provider value={{ avatar }}>
      {children}
    </AvatarContext.Provider>
  );
};