import React, { useEffect, useRef, useState } from 'react';
import { getSocket, disconnectSocket } from "../utils/socket.js";
import '../styles/Chat.css';
import { useAuthFetch } from '../../../shared/hooks/useAuth.jsx';
import { getUser } from '../hooks/getUser.js';
import TypingBubble from "./TypingBubble.jsx";
import ProfileImage from "./ProfileImage.jsx";
import Message from "./Message.jsx";


const Chat = () => {
    const { loading } = useAuthFetch();

    // State
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [currentUser,setCurrentUser] = useState();
    const [typingUser, setTypingUser] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingMessage, setTypingMessage] = useState('');
    const [messagePopup, setMessagePopup] = useState(false);
    const [newMessage,setNewMessage] = useState(false);

    // Refs
    const messagesEndRef = useRef(null);
    const disconnectTimeouts = useRef({});
    const effectRan = useRef(false);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        console.log(scrollHeight,clientHeight,scrollTop);

        if(clientHeight+scrollTop+300 <= scrollHeight) setMessagePopup(true)

        if(scrollTop + clientHeight >= scrollHeight){
            setNewMessage(false)
            setMessagePopup(false);
        }
        setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    };

    useEffect(() => {
        if (effectRan.current) return; // Skip if already ran
        const initChat = async () => {
            const username = await getUser();
            if (username) setCurrentUser(username);

            const socket = await getSocket();

            if (!socket) return;

            socket.on('userJoined', (message) => {
                if (disconnectTimeouts.current[message.username]) {
                    console.log(`Clearing disconnect timeout for ${message.username}`);
                    clearTimeout(disconnectTimeouts.current[message.username]);
                    delete disconnectTimeouts.current[message.username];
                }

                const normalizedUsername = message.username.trim().toLowerCase();

                setActiveUsers((prevActiveUsers) => {
                    const isUserActive = prevActiveUsers.some(
                        (user) => user.toLowerCase() === normalizedUsername
                    );

                    if (isUserActive) {
                        return prevActiveUsers; // No change
                    }

                    return [...prevActiveUsers, message.username];
                });

                // Step 3: Avoid adding a system message for the current user
                if (message.username !== currentUser) {
                    const displayUsername = message.username.startsWith('Guest')
                        ? 'Guest'
                        : message.username;

                    const joinMessage = `${displayUsername} has joined the chat at ${new Date(
                        message.time
                    ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                    // Step 4: Update messages with a new system message
                    setMessages((prevMessages) => {
                        const isDuplicateMessage = prevMessages.some(
                            (msg) =>
                                msg.system === 'System' &&
                                msg.username === joinMessage
                        );

                        if (isDuplicateMessage) {
                            return prevMessages;
                        }

                        return [
                            ...prevMessages,
                            { system: 'System', username: joinMessage },
                        ];
                    });
                }
            });

            socket.on('chatHistory', (chatHistory) => {
                setMessages(chatHistory);
            });

            socket.on('newMessage', (message) => {
                setTypingMessage(false);
                setMessages((prevMessages) => [...prevMessages, message]);
            });


            socket.on('userTyping', (message) => {
                setTypingUser((prev) => {
                    const normalizedUsername = message.username.split('_').length > 1
                        ? message.username.split('_')[0] + '_'+message.username.split('_')[1]
                        : message.username.split('_')[0];
                    if (prev.includes(normalizedUsername)) {
                        return prev;
                    }
                    return [...prev, normalizedUsername];
                });

                if (message.username !== username) {
                    setTypingMessage(message);
                }
            });

            socket.on('userStoppedTyping', () => {
                setTypingUser([]);
                setTypingMessage('');
            });

            // Handle userDisconnected
            socket.on('userDisconnected', (user) => {

                // Set a timeout to add the "left chat" message after 10 seconds
                disconnectTimeouts.current[user] = setTimeout(() => {
                    const newUser = (user.split('_')[0] !== 'Guest' ? user : 'Guest') +
                        ' has Left the chat at ' +
                        new Date().toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        });

                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { system: 'System', username: newUser }
                    ]);

                    // Remove the timeout reference after execution
                    delete disconnectTimeouts.current[user];
                }, 20000);
            });

        };

        initChat();
        effectRan.current = true;

        return () => {
            disconnectSocket();
        };
    }, []);



    useEffect(() => {
        if (isAtBottom ) {
            scrollToBottom();
        }else{
            setMessagePopup(true);
            setNewMessage(true);
        }
    }, [messages]);

    useEffect(() => {
        if (isAtBottom && messages.length > 8) {
            scrollToBottom();
        }
    }, [typingUser]);

    const sendMessage = async () => {
        if (input.trim().length === 0) return; // Don't send empty messages
        const socket = await getSocket();
        if (socket) {
            socket.emit('sendMessage', input);
            setInput('');
        }
    };

    const typing = async () => {
        const socket = await getSocket();
        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing');
        }

        const typingTimeout = setTimeout(() => {
            setIsTyping(false);
            setTypingUser([]);
            socket.emit('stopTyping'); // Notify the server
        }, 2500);

        if (isTyping) {
            clearTimeout(typingTimeout);
        }
    }


    if (loading) {
        return (
            <div className='loading'>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="chat-box">
            <div
                className="messages"
                ref={messagesContainerRef}
                onScroll={handleScroll}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={msg.system === 'System' ? 'system-message'
                            : `message ${msg.username === currentUser ? 'user-message' : ''}`}
                    >
                        <Message msg={msg} currentUser={currentUser}/>
                    </div>
                ))}

                {typingMessage && <TypingBubble typingUser={typingUser}/>}

                <div ref={messagesEndRef}/>
            </div>

            {messagePopup &&
                <div className='down-arrow'>
                    <div className="subtle-down-arrow" onClick={() => scrollToBottom()}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            width="24px"
                            height="24px"
                        >
                            <path d="M12 16l-6-6h12z"/>
                        </svg>
                    </div>
                    {newMessage && <span className="new-message-indicator"></span>}
                </div>
            }

            <div className="chat-input-container">
                <input
                    ref={inputRef}
                    type="text"
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        typing();
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    placeholder="Type a message"
                />
                <button onClick={sendMessage} className="chat-send-button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="send-icon"
                    >
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Chat;
