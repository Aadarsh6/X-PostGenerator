import { useAuthStore } from "@/store/authStore";
import { createContext, useContext } from "react";

const AvatarContext = createContext({ initial: 'U' });

export const useAvatar = () => useContext(AvatarContext);

export const AvatarProvider = ({ children }) => {
  const { user } = useAuthStore();
  const initial = user?.name?.[0]?.toUpperCase() || 'U';

  return (
    <AvatarContext.Provider value={{ initial }}>
      {children}
    </AvatarContext.Provider>
  );
};