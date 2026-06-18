import { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

function Biblioteca() {
  const [juegos, setJuegos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const obtenerToken = async () => {
    const usuario = auth.currentUser
    if (!usuario) return null
    return await usuario.getIdToken()
  }

  const cargarBiblioteca = async () => {
    setLoading(true)
    try {
      const token = await obtenerToken()
      const response = await fetch('http://localhost:8000/biblioteca/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()

      // Para cada juego de la lista, obtenemos los detalles de RAWG
      const apikey = "95252892507c4c7ca20417bfcead9e8a"
      const detalles = await Promise.all(
        data.juegos.map(async (j: any) => {
          const res = await fetch(`https://api.rawg.io/api/games/${j.rawg_juego_id}?key=${apikey}`)
          return await res.json()
        })
      )
      setJuegos(detalles)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const eliminarJuego = async (rawg_juego_id: number) => {
    const token = await obtenerToken()
    await fetch(`http://localhost:8000/biblioteca/eliminar/${rawg_juego_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    cargarBiblioteca()
  }

  useEffect(() => {
    cargarBiblioteca()
  }, [])

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status" />
    </div>
  )

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Mi Biblioteca</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {juegos.length === 0 ? (
        <div className="text-center mt-5">
          <p className="text-muted">No tienes juegos en tu biblioteca todavía.</p>
          <button className="btn btn-primary" onClick={() => navigate('/inicio')}>
            Explorar catálogo
          </button>
        </div>
      ) : (
        <div className="row">
          {juegos.map((juego) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={juego.id}>
              <div className="card h-100 shadow-sm text-bg-dark">
                <img
                  src={juego.background_image || 'https://via.placeholder.com/300x150?text=Sin+Imagen'}
                  className="card-img-top"
                  style={{ height: '150px', objectFit: 'cover' }}
                  alt={juego.name}
                />
                <div className="card-body">
                  <h5 className="card-title text-truncate">{juego.name}</h5>
                  <p className="card-text">
                    <small className="text-warning">Nota: {juego.metacritic || 'N/A'}</small>
                  </p>
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-danger btn-sm w-100"
                    onClick={() => eliminarJuego(juego.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Biblioteca