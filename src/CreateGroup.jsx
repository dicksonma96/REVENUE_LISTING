import { useState } from "react";
import Textarea from "./components/Textarea";
import {insertData} from './api'
import { useGlobalState } from "./GlobalContext";

function CreateGroup() {
  const {setLoading, setData} = useGlobalState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [special, setSpecial] = useState(false);
  const ruleSample = {
    field: "",
    operator: "",
    params: [""],
    revenue: 0,
  };
  const [rules, setRules] = useState([
    {
      field: "",
      operator: "",
      params: ["param1", "param2", "param3"],
      revenue: 0,
    },
    {
      field: "",
      operator: "",
      params: [""],
      revenue: 0,
    },
  ]);

  const addRule = () => {
    setRules((prevState) => {
      return [...prevState, ruleSample];
    });
  };

  const handleSubmit = () => {
    let data = {
      name,
      description,
      special,
      rules
    }
    setLoading(true);
    insertData(data).then((res)=>{
      setData(res.data)
      handleReset()
    })
    .catch((e)=>{
      alert(e.msg)
    })
    .finally(()=>{
      setLoading(false)
    })
    
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setSpecial(false);
    setRules([ruleSample])
  };

  return (
    <div className="create_group col">
      <h1>Create Revenue Group</h1>
      <br />
      <label className="input col">
        <div className="label">Group Name</div>
        <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/>
      </label>
      <br />
      <label className="input col">
        <div className="label">Group Description</div>
        <Textarea
          setValue={(x) => setDescription(x)}
          value={description}
          placeholder="Add description"
          maxLength={200}
        />
      </label>
      <br />
      <label className="row checkbox">
        <input
          type="checkbox"
          checked={special}
          onChange={(e) => setSpecial(!special)}
        />
        <strong>Special group</strong>
      </label>
      <br />
      <br />
      {/* -------------------------------------------------------------- */}

      <div className="row" style={{ width: "100%", alignItems: "center" }}>
        <h1>Rules</h1>
        <button className="add_rule_btn" onClick={addRule}>
          + Add
        </button>
      </div>
      <br />
      <div className="rules_listing">
        {rules.map((rule, index) => {
          return (
            <Rule info={rule} key={index} index={index} updateRule={setRules} />
          );
        })}
      </div>
      <div className="btns w100 row">
        <button className="btn2" onClick={handleReset}>
          Reset
        </button>
        <button className="btn1" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default CreateGroup;

function Rule({ info, index, updateRule }) {

  const updateInfo = (property, value, nth) => {
    updateRule((prevState) => {
      return prevState.map((rule, i) => {
        if (i == index) {
          if (property == "params") {
            if(rule.params.length){
              rule.params[nth] = value;
            }
            else{
              rule.params.push(value)
            }
            return rule;
          }

          return { ...rule, [property]: value };
        }

        return rule;
      });
    });
  };

  const addParam = ()=>{
    if(info.params.length >= 5)
    alert("Maximum 5 parameters per rule")

    else
    updateRule(prevState=>{
      return prevState.map((rule,i)=>{
        if(index == i){
          rule.params.push("")
        }

        return rule
      })
    })
  }
  
  const removeParam = (nth)=>{
    updateRule(prevState=>{
      return prevState.map((rule,i)=>{
        if(index == i){
          rule.params = rule.params.filter((param,i)=>i!=nth)
        }

        return rule
      })
    })
  }

  return (
    <div className="rule_item col">
      <div className="row w100">
        <span>Rule {index + 1}</span>
        <div
          className="remove_item"
          onClick={() => {
            updateRule((prevState) => {
              return prevState.filter((rule, i) => {
              if (i != index) {
                  return rule;
                }
              });
            });
          }}
        >
          &#10006;
        </div>
      </div>
      <div className="info col w100">
        <div className="info_row rowc w100">
          <span>If</span>
          <select
            name="field"
            value={info.field}
            onChange={(e) => updateInfo("field", e.target.value)}
          >
            <option value="" disabled>
              Select field
            </option>
            <option value="field_1">field 1</option>
            <option value="field_2">field 2</option>
          </select>
          <select
            name="operator"
            value={info.operator}
            onChange={(e) => updateInfo("operator", e.target.value)}
          >
            <option value="" disabled>
              Select operator
            </option>
            <option value="is not">is not</option>
            <option value="is">is</option>
            <option value="starts with">starts with</option>
            <option value="ends with">ends with</option>
          </select>

          <input
            type="text"
            placeholder="Enter Parameter"
            value={info.params[0] || ""}
            onChange={(e) => {
              updateInfo("params", e.target.value, 0);
            }}
          />
          <img src="/add_circle_outline.svg" onClick={addParam} alt="" />
        </div>

        {info.params.map((param, i) => {
          if (i != 0)
            return (
              <div className="info_row rowc w100" key={i}>
                <input
                  type="text"
                  placeholder="Enter Parameter"
                  value={param}
                  onChange={(e) => {
                    updateInfo("params", e.target.value, i);
                  }}
                />
                <img src="/remove_circle_outline.svg" onClick={()=>removeParam(i)} alt="" />
              </div>
            );
        })}
      </div>
      <div className="rowc">
        <span>then revenue is</span>
        <input
          style={{ width: "130px", margin: "0 5px", textAlign: "center" }}
          type="number"
          max="100"
          min="1"
          placeholder="Enter amount"
          value={info.revenue}
          onChange={(e) => {
            updateInfo("revenue", e.target.value, 0);
          }}
        />
        <span>%</span>
      </div>
    </div>
  );
}
