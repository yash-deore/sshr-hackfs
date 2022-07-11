import { createContext, useContext, useState } from "react";

const Context = createContext();

export function GlobalContextProvider({ children }) {
  const [globalStore, setGlobalStore] = useState({
    authenticated: false, // Authentication status
    patientBasic: null, // Patient Basic Information
    patientPersonal: null, // Patient Personal Information
    patientMedical: null, // Patient Medical Information
  });

  return (
    <Context.Provider value={[globalStore, setGlobalStore]}>
      {children}
    </Context.Provider>
  );
}

export function useGlobalContext() {
  return useContext(Context);
}
