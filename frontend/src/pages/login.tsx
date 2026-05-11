import { useState } from 'react'
import { auth } from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import '../App.css'

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
    <div
      className="d-flex justify-content-center align-items-center w-100"
      style={{ minHeight: 'calc(100vh - 56px)' }}
    >
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">OmniLink</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          className="btn btn-primary w-100 mb-2"
          onClick={manejarLogin}
          disabled={cargando}
        >
          {cargando ? 'Cargando...' : 'Iniciar sesión'}
        </button>

        <button
          className="btn btn-outline-secondary w-100"
          onClick={manejarRegistro}
          disabled={cargando}
        >
          Registrarse
        </button>
      </div>
    </div>
  )
}

export default Login