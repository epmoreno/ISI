import { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/biblioteca.css'

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
      const apikey = "95252892507c4c7ca20417bfcead9e8a"
      const detalles = await Promise.all(
          data.juegos.map(async (j: any) => {
          const res = await fetch(`https://api.rawg.io/api/games/${j.rawg_juego_id}?key=${apikey}`)
          const detalle = await res.json()
          return { ...detalle, rawg_juego_id: j.rawg_juego_id }
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
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid #1f1f1f', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div className="biblioteca-page">
      <div className="biblioteca-container">

        <div className="biblioteca-header">
          <h1 className="biblioteca-titulo">Mi Biblioteca</h1>
          <p className="biblioteca-subtitulo">
            {juegos.length} {juegos.length === 1 ? 'juego guardado' : 'juegos guardados'}
          </p>
        </div>

        {error && <div className="biblioteca-error">{error}</div>}

        {juegos.length === 0 ? (
          <div className="biblioteca-vacia">
            <div className="biblioteca-vacia-emoji">🎮</div>
            <p className="biblioteca-vacia-texto">No tienes juegos en tu biblioteca todavía.</p>
            <button className="biblioteca-btn-explorar" onClick={() => navigate('/inicio')}>
              Explorar catálogo
            </button>
          </div>
        ) : (
          <div className="biblioteca-grid">
            {juegos.map((juego) => (
              <div key={juego.id} className="biblioteca-card">
                <Link to={`/juego/${juego.id}`} className="biblioteca-card-link">
                  <img
                    src={juego.background_image || 'https://via.placeholder.com/300x150?text=Sin+Imagen'}
                    alt={juego.name}
                    className="biblioteca-card-img"
                  />
                  <div className="biblioteca-card-body">
                    <p className="biblioteca-card-titulo">{juego.name}</p>
                    <div className="biblioteca-card-footer">
                      <span className="biblioteca-card-genero">
                        {juego.genres?.[0]?.name || 'Desconocido'}
                      </span>
                      {juego.metacritic && (
                        <span className={
                          juego.metacritic >= 80 ? 'biblioteca-metacritic-verde' :
                          juego.metacritic >= 60 ? 'biblioteca-metacritic-amarillo' :
                          'biblioteca-metacritic-rojo'
                        }>
                          {juego.metacritic}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="biblioteca-card-actions">
                  <button className="biblioteca-btn-eliminar" onClick={() => eliminarJuego(juego.rawg_juego_id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Biblioteca