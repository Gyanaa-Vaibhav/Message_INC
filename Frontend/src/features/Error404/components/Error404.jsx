import React from "react";
import '../styles/Error404.css'

export default function Error404(){
    return(
        <div className="error-block">
            <h1>404</h1>
            <p>Oops! The page you're looking for doesn't exist.</p>
            <a className='err' href="/login">Go Back to Home</a>
        </div>
    )
}