import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const cerrarSesion = async () => {
    await signOut(auth)
    navigate('/')
  }

  return (
    <nav className="navbar navbar-dark bg-dark px-4 w-100">
      <Link to="/inicio" className="navbar-brand fw-bold fs-4">OmniLink</Link>
      <div className="d-flex gap-3 align-items-center">
        <Link to="/inicio" className="text-white text-decoration-none">Catálogo</Link>
        <Link to="/biblioteca" className="text-white text-decoration-none">Mi Biblioteca</Link>
        <Link className="nav-link text-warning" to="/dashboard"><i className="fas fa-lock me-1"></i> Panel de Control</Link>
        <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}

export default Navbar