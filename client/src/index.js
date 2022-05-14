import React from 'react'
import {createRoot} from 'react-dom/client'
import App from "./components/App.js";


const root = createRoot(document.getElementById('content'))
root.render(<App />)

