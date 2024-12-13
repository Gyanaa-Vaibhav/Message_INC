import React from "react";
import '../styles/ProfileImage.css'

export default function ProfileImage(props){
    const { msg } = props

    return(
        <div className="profile-image">{msg.username.slice(0, 1)}</div>
    )
}