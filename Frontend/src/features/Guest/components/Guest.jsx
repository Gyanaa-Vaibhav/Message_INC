// DONE
import React, {useState} from "react";
import '../styles/Guest.css'

export function Guest() {
    const [loading, setLoading] = React.useState(false);
    const [username, setUsername] = useState('');
    const [isGuest, setIsGuest] = useState(false);
    const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP : '/';

    function fetchUser() {

        setLoading(true);

        // TODO: Change 3
        fetch(url+`/guest/${username || 'Guest'}`)
            .then(res => {
                return res.json();
            })
            .then(data => {
                localStorage.setItem("accessToken", (data.accessToken));
            })
            .finally(() => {
                setTimeout(() => {
                    window.location.href = '/chat';
                }, 700);
            });
    }

    if (loading) return (
        <div className='loading'>
            <h1>
                Getting things ready
                <span className="dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </span>
            </h1>
        </div>
    )

    return (
        <div className="guest-container">
            <h1>Welcome to the Chat!</h1>
            <p>Choose how you want to join:</p>

            <div className="guest">
                <input
                    type="radio"
                    id="guest"
                    name="join"
                    checked={isGuest}
                    onChange={() => setIsGuest(true)}
                />
                <label htmlFor="guest">Join as Guest</label>
            </div>

            <div className="option">
                <div className='username'>
                    <input
                        type="radio"
                        id="name"
                        name="join"
                        checked={!isGuest}
                        onChange={() => setIsGuest(false)}
                    />
                    <label htmlFor="name">Enter a Username</label>
                </div>

                {!isGuest && (
                    <div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e)=>setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>
                )}
            </div>

            <button className="enter-chat" onClick={fetchUser}>Enter Chat</button>
        </div>
    );
}