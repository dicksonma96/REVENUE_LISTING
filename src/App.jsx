import { useState,useEffect } from 'react'
import CreateGroup from './CreateGroup'
import GroupList from './GroupList'
import { useGlobalState } from './GlobalContext'
import Loader from './components/Loader'

function App() {
  const [count, setCount] = useState(0)
  const {loading} = useGlobalState();

  useEffect(()=>console.log(loading),[])

  return (
        <div className="container">
          <CreateGroup />
          <GroupList />
          {loading && (
           <Loader/>
          )}
        </div>
  )
}

export default App
