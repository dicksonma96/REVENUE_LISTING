import { useState, useEffect, createContext, useContext } from "react";
import { getData } from './api'

const GlobalContext = createContext();

export function useGlobalState() {
  return useContext(GlobalContext);
}

export function GlobalProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(()=>{
    setLoading(true)
    getData().then((res)=>{
      console.log(res)
      if(res.status=='ok')
      setData(res.data)
    })
    .finally(()=>{
      setLoading(false)
    })
  },[])


  return (
    <GlobalContext.Provider value={{loading,setLoading, data, setData}}>
      {children}
    </GlobalContext.Provider>
  );
}
