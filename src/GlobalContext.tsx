import { Client, User } from "./types";
import { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-react";
import React, {
  MutableRefObject,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

const UserContext =
  createContext<[User[], React.Dispatch<React.SetStateAction<User[]>>]>();
const StartContext =
  createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>(
    false
  );
const ClientContext = createContext<MutableRefObject<Client>>({});
const LoadingContext = createContext<boolean>(false);
const AdminContext = createContext<boolean>(false);
const LocalScreenTrackContext = createContext(null);

export const useUsers = ():
  | [User[], React.Dispatch<React.SetStateAction<User[]>>] => {
  return useContext(UserContext);
};

export const useStart = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  return useContext(StartContext);
};

export const useClientContext = () => {
  return useContext(ClientContext);
};
export const useAdmin = (): MutableRefObject<boolean> => {
  return useContext(AdminContext);
};
export const useLoading = (): boolean => {
  return useContext(LoadingContext);
};
export const useLocalScreenTack = (): any => {
  return useContext(LocalScreenTrackContext);
};

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [start, setStart] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const client = useRef<Client>({
    rtc: {
      // For the local client.
      client: null,
      // For the local audio and video tracks.
      localAudioTrack: null,
      localVideoTrack: null,
    },
    rtm: {
      client: null,
      channel: null,
    },
  });
  const admin = useRef<boolean>(false);
  const localScreenTracks = useRef<
    ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack] | null | any
  >(null);

  return (
    <ClientContext.Provider value={client}>
      <AdminContext.Provider value={admin}>
        <LocalScreenTrackContext.Provider value={localScreenTracks}>
          <UserContext.Provider value={[users, setUsers]}>
            <StartContext.Provider value={[start, setStart]}>
              <LoadingContext.Provider value={[isLoading, setIsLoading]}>
                {children}
              </LoadingContext.Provider>
            </StartContext.Provider>
          </UserContext.Provider>
        </LocalScreenTrackContext.Provider>
      </AdminContext.Provider>
    </ClientContext.Provider>
  );
};
