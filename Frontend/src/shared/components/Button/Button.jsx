import React from 'react'
import './Button.css'

export default function Button(props){
    const {label,onClick,type="button"} = props;

    return(
        <button className='button' type={type} onClick={onClick}>
            {label}
        </button>
    )
};