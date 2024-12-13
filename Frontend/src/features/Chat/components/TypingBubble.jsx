import React from "react";
import '../styles/TypingBubble.css';

export default function TypingBubble(props) {
    const { typingUser } = props;

    return (
        <div className="typing-bubble">
            <div className="typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
        </div>
        // <div className="typing-bubble-container">
        //     <div className="typing-bubble">
        //         {typingUser.map(user => user).join(', ')} {typingUser.length > 1 ? 'are' : 'is'} typing <span
        //         className="dots-chat"><span>.</span><span>.</span><span>.</span></span>
        //     </div>
        // </div>
    )
}