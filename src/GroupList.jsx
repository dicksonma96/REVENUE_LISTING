import {useState,useEffect} from 'react'
import { useGlobalState } from './GlobalContext'
import { updateData } from './api';

function GroupList() {

  const {loading, data,setData} = useGlobalState();
  
  return (
    <div className='col browse_group'>
      <h1>Browse Revenue Groups</h1>
      <br />
    {
      (!loading  && data?.length == 0 || !data) && 
      <div className="empty_group rowc w100">
        <em>Not data found</em>
      </div>
    }
      <div className="group_list col">
        {data?.map((info,index)=> <Group info={info} index={index} setGroupData={setData} key={index}/> )}
      </div>

    </div>

  ) 
}

export default GroupList


function Group({info,index,setGroupData}){

  const [maxParams, setMaxParams] = useState(1);
  const {data, setLoading} = useGlobalState();


  useEffect(()=>{
    getLongestParamsRuleNumber();
  },[])

  const getLongestParamsRuleNumber =()=>{
    if(info.rules && info.rules.length){
      let result = info.rules?.reduce((prev, current) => prev.params.length > current.params.length ? prev : current);
      setMaxParams(result.params.length)
    }
    
  }
  
  const deleteRule = (nth) =>{
    setGroupData(prevState=>{
      return prevState.map((info,i)=>{
        if(i == index){
          info.rules = info.rules.filter((rule,j)=>j!=nth)
        }
        return info
      })
    })
    setLoading(true)
    updateData(data).then((res)=>{
      setLoading(false)
    })
  }

  const deleteGroup = () =>{
    setGroupData(prevState=>{
      let tempState = prevState.filter((info,i)=>{
        if(i != index){
          return info
        }
      })
      setLoading(true)
      updateData(tempState).then((res)=>{
        setLoading(false)
      })
      return tempState
    })
    

  }

  return (
    <div className="group col">
      <div className="header col">
        <div className="rowc">
          <strong>{info.name}</strong>
          {info.special && <div className='badge'>Special Group</div>}
          <div className="delete_group rowc">
            <img src="/Iconsdelete.svg" onClick={deleteGroup}/>
          </div>
        </div>
        <p>{info.description}</p>
      </div>
      <div className="table w100">
      <table>
        <thead>
          <tr>
            <th>Rule</th>
            <th>Field</th>
            <th>Operator</th>
            {              
              [...Array(maxParams)].map((x,i)=>(<th key={i}>Parameters {i + 1}</th>))
            }
            <th>Revenue</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            info.rules.map((rule,i)=>{

              return(<tr key={i}>
                <td>{i+1}</td>
                <td>{rule.field}</td>
                <td>{rule.operator}</td>
                {
                  [...Array(maxParams)].map((x,j)=>{   
                      return (rule.params[j]) ? <td key={j}>{rule.params[j]}</td> : <td key={j}></td>
                  })
                }
                <td>{rule.revenue}%</td>
                <td>
                  <img className="delete_btn" src="/Iconsdelete.svg" onClick={()=>deleteRule(i)} alt='delete' />
                </td>
              </tr>)
            })
          }
        </tbody>
      </table>
      </div>
    </div>
  )
}