import React, {useEffect, useRef, useState} from "react";
import {Button, Input} from '../../../shared/index.js';
import '../styles/form.css'

export default function LoginForm() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState(''); // State to store the error message
    const [showError, setShowError] = useState(false)
    const [errors, setErrors] = useState({ email: '', password: '' });
    const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/login' : '/login';

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const validatePassword = (value) => {
        return value.length >= 8; // Example: password must be at least 8 characters
    };

    function handelClick(e){

        e.preventDefault();

        const emailError = validateEmail(emailRef.current.value) ? '' : 'Invalid email address';
        const passwordError = validatePassword(passwordRef.current.value) ? '' : 'Password must be at least 8 characters long';

        if (!emailError && !passwordError) {
            setErrors({ email: '', password: '' });
        } else {
            setErrors({ email: emailError, password: passwordError });
            return
        }

        fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify content type
            },
            body: JSON.stringify({
                email:emailRef.current.value,
                password:passwordRef.current.value
            }),
            credentials: 'include',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                localStorage.setItem('accessToken', data.accessToken);
                window.location.pathname = '/'; // Redirect to the home page
            })
            .catch((error) => {
                console.error('Fetch error:', error)
                setErrorMessage('Invalid username or password. Please try again.'); // Set error message
                setShowError(true); // Show popup

                // Hide the notification after 3 seconds
                setTimeout(() => {
                    setShowError(false);
                }, 3000);
            });
    }

    return (
        <>
            <div
                className={"form-container"}
                // onSubmit={(e) => handelClick(e)}
            >

                <h1>Login</h1>

                <form
                    id="loginForm"
                >
                    <Input
                        style={{border: errors.email ? '1px solid red' : '1px solid #ccc'}}
                        ref={emailRef}
                        type={'email'}
                        name={'email'}
                        id={"email"}
                        placeholder={"Enter your email"}
                        required={true}
                        autoComplete={'off'}
                    />
                    {errors.email && <small style={{ color: '#ffa5a5'}}>{errors.email}</small>}

                    <Input
                        ref={passwordRef}
                        type={'password'}
                        name={'password'}
                        id={'password'}
                        placeholder={"Enter your password"}
                        required={true}
                        autoComplete={'off'}
                    />
                    {errors.password && <small style={{ color: '#ffa5a5' }}>{errors.password}</small> }

                    <Button
                        label="Login"
                        type="submit"
                        onClick={(e)=>handelClick(e)}
                    />

                    <p className="register-link">Don't have an account? <a href="/register">Register here</a></p>
                    <p className="register-link">Use as <a href="/guest">Guest</a></p>
                </form>
            </div>

            {/* Notification */}
            <div className={`notification ${showError ? 'show' : ''}`}>
                {errorMessage}
            </div>
        </>
    )
}