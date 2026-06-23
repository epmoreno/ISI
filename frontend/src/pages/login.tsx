import { useState } from 'react'
import { auth } from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const manejarLogin = async () => {
    setCargando(true)
    setError('')
    try {
      const credencial = await signInWithEmailAndPassword(auth, email, password)
      const token = await credencial.user.getIdToken()
      await fetch('http://localhost:8000/auth/sesion', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate('/inicio')
    } catch (e: any) {
      setError('Correo o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  const manejarRegistro = async () => {
    setCargando(true)
    setError('')
    try {
      const credencial = await createUserWithEmailAndPassword(auth, email, password)
      const token = await credencial.user.getIdToken()
      await fetch('http://localhost:8000/auth/sesion', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate('/inicio')
    } catch (e: any) {
      setError(e.code || 'Error al registrarse')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <svg width="40" height="40" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="8" width="14" height="7" rx="3.5" stroke="#ffffff" strokeWidth="2.2" fill="none"/>
            <rect x="12" y="13" width="14" height="7" rx="3.5" stroke="#ffffff" strokeWidth="2.2" fill="none"/>
            <line x1="9" y1="14" x2="19" y2="16" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="5" cy="22" r="1.2" fill="#2563eb"/>
            <circle cx="23" cy="6" r="1.2" fill="#2563eb"/>
          </svg>
          <h1 className="login-titulo">OmniLink</h1>
          <p className="login-subtitulo">Tu catálogo de videojuegos</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="login-field">
          <label className="login-label">Correo electrónico</label>
          <input
            type="email"
            className="login-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="login-field">
          <label className="login-label">Contraseña</label>
          <input
            type="password"
            className="login-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button className="login-btn-primary" onClick={manejarLogin} disabled={cargando}>
          {cargando ? 'Cargando...' : 'Iniciar sesión'}
        </button>

        <div className="login-divisor">
          <div className="login-divisor-linea" />
          <span className="login-divisor-texto">o</span>
          <div className="login-divisor-linea" />
        </div>

        <button className="login-btn-secondary" onClick={manejarRegistro} disabled={cargando}>
          Crear cuenta
        </button>
      </div>
    </div>
  )
}

export default Login