import React, { useState } from 'react'
import { useAsyncDebounce } from 'react-table';


const GlobalFilter = ({filter,setFilter}) => {
    const [value,setValue]= useState(filter);

    const onChange = useAsyncDebounce(value=>{
        setFilter(value || undefined)
    },1000)
    
  return (
    <span>
      Search :{" "}
      <input 
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        style={{width:'20%', height:'25px',borderRadius:'3px',border:'1.5px solid black'}}
      />
    </span>
  );
}

export default GlobalFilter
