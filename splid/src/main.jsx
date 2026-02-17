import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { GroupProvider } from './context/GroupContext.jsx'
import Footer from './components/Footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GroupProvider>

    <App />
   
    </GroupProvider>
  </StrictMode>,
)
