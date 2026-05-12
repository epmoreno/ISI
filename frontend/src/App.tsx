import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Inicio from './pages/inicio'
import DetalleJuego from './pages/detalle_juego'
import Biblioteca from './pages/biblioteca'
import Navbar from './components/navbar'
import RutaProtegida from './components/ruta_protegida'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<RutaProtegida><Inicio /></RutaProtegida>} />
        <Route path="/juego/:id" element={<RutaProtegida><DetalleJuego /></RutaProtegida>} />
        <Route path="/biblioteca" element={<RutaProtegida><Biblioteca /></RutaProtegida>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App