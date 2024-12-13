import {useState} from 'react'
import './App.css'
import LoginForm from "./features/Auth/components/LoginForm.jsx";

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <LoginForm/>
        </>
    )
}

export default App
