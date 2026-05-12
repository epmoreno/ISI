import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const cerrarSesion = async () => {
    await signOut(auth)
    navigate('/')
  }

  return (
    <nav className="navbar navbar-dark bg-dark px-4 d-flex justify-content-between w-100">
      <span className="navbar-brand fw-bold fs-4">OmniLink</span>
      <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
        Cerrar sesión
      </button> 
    </nav>
  )
}

export default Navbar