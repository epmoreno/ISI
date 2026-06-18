import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import React from 'react'

function RutaProtegida({ children }: { children: React.ReactElement }) {
  const [cargando, setCargando] = useState(true)
  const [autenticado, setAutenticado] = useState(false)

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (usuario) => {
      setAutenticado(!!usuario)
      setCargando(false)
    })
    return () => unsuscribe()
  }, [])

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return autenticado ? children : <Navigate to="/" />
}

export default RutaProtegida