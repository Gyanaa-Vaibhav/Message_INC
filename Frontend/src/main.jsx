// TODO
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {LoginForm,RegisterForm,Error,Guest} from './features/index.js'
import App from './App.jsx'
import Chat from "./features/Chat/components/Chat.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<App />} />
              <Route path="/register" element={<RegisterForm/>}/>
              <Route path="/login" element={<LoginForm />} />
              <Route path='/chat' element={<Chat />} />
              <Route path='/chat/:name' element={<Chat />} />
              <Route path='/guest' element={<Guest />} />
              <Route path="/game/*" element={null} />
              <Route path="/*" element={<Error />}/>
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
