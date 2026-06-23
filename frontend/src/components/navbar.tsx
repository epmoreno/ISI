import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/navbar.css'

function Navbar() {
  const navigate = useNavigate()

  const cerrarSesion = async () => {
    await signOut(auth)
    navigate('/')
  }

  return (
    <nav className="navbar-custom">
      <Link to="/inicio" className="navbar-logo">
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="8" width="14" height="7" rx="3.5" stroke="#ffffff" strokeWidth="2.2" fill="none"/>
          <rect x="12" y="13" width="14" height="7" rx="3.5" stroke="#ffffff" strokeWidth="2.2" fill="none"/>
          <line x1="9" y1="14" x2="19" y2="16" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="5" cy="22" r="1.2" fill="#2563eb"/>
          <circle cx="23" cy="6" r="1.2" fill="#2563eb"/>
        </svg>
        <span className="navbar-logo-texto">OmniLink</span>
      </Link>

      <div className="navbar-links">
        <Link to="/inicio" className={`navbar-link ${location.pathname === '/inicio' ? 'activo' : ''}`}>
          Catálogo
        </Link>
        <Link to="/biblioteca" className={`navbar-link ${location.pathname === '/biblioteca' ? 'activo' : ''}`}>
          Mi Biblioteca
        </Link>
        <Link to="/dashboard" className={`navbar-link ${location.pathname === '/dashboard' ? 'activo' : ''}`}>
          🔒 Panel de Control
        </Link>
        <button className="navbar-btn-sesion" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}

export default Navbar