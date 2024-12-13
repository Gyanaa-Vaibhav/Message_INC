import React, {useEffect} from "react";
import ProfileImage from "./ProfileImage.jsx";
import '../styles/Message.css'

export default function Message(prop) {

    const { msg, currentUser } = prop;

    const userName = msg.username.split('_')[1] ? msg.username.split('_')[0]+'_'+msg.username.split('_')[1] : msg.username
    let result = null;
    msg.username.length > 50 ? result = userName + ' ' + msg.username.replace(/^[^\s]+\s/, '') : result = userName;

    return (
        <>
            {msg.username !== currentUser && <ProfileImage msg={msg}/>}

            <div className='info'>
                <div className="message-header">
                    {result}
                    {!msg.system &&
                        <span className="message-time">
                                    {new Date(msg.time).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                    }
                </div>
                <div className="message-text">{msg.message}</div>
            </div>

            {msg.username === currentUser && <ProfileImage msg={msg}/>}
        </>
    )
}