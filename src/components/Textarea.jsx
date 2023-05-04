import {useRef} from 'react'

function Textarea(props) {
    return (
    <div className='custom_textarea col'>
        <textarea placeholder={props.placeholder} value={props.value} maxLength={props.maxLength} onChange={(e)=>{
            props.setValue(e.target.value)
        }}/>
        <span className="maxlength">{props.value.length} / {props.maxLength}</span>
    </div>
  )
}

export default Textarea