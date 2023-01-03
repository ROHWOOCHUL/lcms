import React, { createContext, useContext, useRef, useState } from "react";

const UserContext = createContext(null);
const StartContext = createContext(null);
const ClientContext = createContext(null);
const LoadingContext = createContext(null);

export const useUsers = (): any => {
  return useContext(UserContext);
};

export const useStart = (): any => {
  return useContext(StartContext);
};

export const useClient = (): any => {
  return useContext(ClientContext);
};
export const useLoading = (): any => {
  return useContext(LoadingContext);
};

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const rtc = useRef({
    // For the local client.
    client: null,
    // For the local audio and video tracks.
    localAudioTrack: null,
    localVideoTrack: null,
  });

  return (
    <ClientContext.Provider value={rtc}>
      <UserContext.Provider value={[users, setUsers]}>
        <StartContext.Provider value={[start, setStart]}>
          <LoadingContext.Provider value={[isLoading, setIsLoading]}>
            {children}
          </LoadingContext.Provider>
        </StartContext.Provider>
      </UserContext.Provider>
    </ClientContext.Provider>
  );
};
