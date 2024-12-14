import {useState} from 'react'
import './App.css'
import LoginForm from "./features/Auth/components/LoginForm.jsx";

function App() {
    const [count, setCount] = useState(0)
    const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/api' : '/api';

    function handelFetch() {
        fetch(url).then(res => res.json()).then(data=>console.log(data)).catch(err => console.log(err))
    }

    function handelPostFetch(){
        fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: 'John'})
        })
            .then(res => res.json()).then(data=>console.log(data)).catch(err => console.log(err))
    }

    return (
        <>
            <h1>FETCH Testing</h1>
            <button onClick={handelFetch}>Fetch</button>
            <button onClick={handelPostFetch}>Fetch POST</button>
        </>
    )
}

export default App
