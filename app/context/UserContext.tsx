"use client";

import { ReactNode, createContext, useState } from "react";

interface UserType {
  name: string;
  email: string;
  image?: string;
  token: string;
}

interface UserContextProps {
  userData: UserType | null;
  setUserData: (userData: UserType | null) => void;
  getUserData: () => void;
}

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [userData, setUserData] = useState<UserType | null>(null);

  const getUserData = async () => {
    try {
      const response = await fetch("/api/auth/user", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, getUserData }}>
      {children}
    </UserContext.Provider>
  );
}
