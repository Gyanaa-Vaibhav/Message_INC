import {useState} from 'react'
import './App.css'
import LoginForm from "./features/Auth/components/LoginForm.jsx";

function App() {
    const [showRoomInput, setShowRoomInput] = useState(false);
    const [roomName, setRoomName] = useState('');

    const handleRoomClick = () => {
        setShowRoomInput(!showRoomInput);
    };

    const handleRoomNameChange = (event) => {
        setRoomName(event.target.value);
    };

    const handleJoinRoom = () => {
        if (roomName) {
            window.location.href = `/chat?room=${roomName}`;
        } else {
            window.location.href = '/chat';
        }
    };

    return (
        <div className="landing-container">
            <div className="form-container">
                <h1>Message INC</h1>
                <p className="description">
                    Privacy and Security at Your Fingertips. Experience seamless and secure chatting.
                </p>
                <div className="button-group">
                    <button className="action-button global-chat-btn" onClick={handleJoinRoom}>Join Global Chat</button>
                    <button className="action-button room-btn" onClick={handleRoomClick}>
                        Join Room
                    </button>
                </div>

                {showRoomInput && (
                    <div className="room-input-container">
                        <input
                            type="text"
                            placeholder="Enter Room Name"
                            value={roomName}
                            onChange={handleRoomNameChange}
                            className="room-input"
                        />
                        <button className="action-button join-room-submit" onClick={handleJoinRoom}>
                            Join
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App
