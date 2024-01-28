import React from 'react'
import './style.css'

function Input({ label, state, setState, placeholder, type }) {
  return (
    <div className='input_wrapper'>
      <p>{label}</p>
      <input
        type={type}
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Input