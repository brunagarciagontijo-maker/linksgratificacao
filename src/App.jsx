import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Admin from './pages/Admin'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<Admin />} />

        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}