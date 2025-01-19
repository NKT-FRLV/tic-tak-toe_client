import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/loginPage/LoginPage'
import GamePage from './components/gamePage/GamePage'

function App() {
  

  return (
    <>
    <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/game" element={<GamePage />} />
        {/* <Route path="/game/:name/:room/:gameMode" element={<GamePage />} /> */}
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </>
  )
}

export default App
