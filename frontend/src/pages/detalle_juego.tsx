import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'

function DetalleJuego() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [juego, setJuego] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [screenshots, setScreenshots] = useState<any[]>([])
  const [trailers, setTrailers] = useState<any[]>([])

  useEffect(() => {
    const fetchJuego = async () => {
      try {
        const apikey = "95252892507c4c7ca20417bfcead9e8a"

        const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${apikey}`)
        if (!response.ok) throw new Error('Error al cargar el juego')
        const data = await response.json()
        setJuego(data)

        const screensRes = await fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=${apikey}`)
        const screensData = await screensRes.json()
        setScreenshots(screensData.results || [])

        const trailersRes = await fetch(`https://api.rawg.io/api/games/${id}/movies?key=${apikey}`)
        const trailersData = await trailersRes.json()
        setTrailers(trailersData.results || [])

      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchJuego()
  }, [id])

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status" />
    </div>
  )

  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>

  // Todas las imágenes: imagen principal + screenshots
  const todasLasImagenes = [
    juego.background_image,
    ...screenshots.map((s: any) => s.image)
  ].filter(Boolean)

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/inicio')}>
        ← Volver al catálogo
      </button>

      <div className="row">
        {/* Carrusel solo con imágenes */}
        <div className="col-md-6">
          <div id="carruselJuego" className="carousel slide mb-3" data-bs-ride="carousel">
            <div className="carousel-inner rounded shadow">
              {todasLasImagenes.map((img, index) => (
                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                  <img
                    src={img}
                    className="d-block w-100 rounded"
                    style={{ maxHeight: '320px', objectFit: 'cover' }}
                    alt={`Imagen ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            {todasLasImagenes.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#carruselJuego" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" />
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carruselJuego" data-bs-slide="next">
                  <span className="carousel-control-next-icon" />
                </button>
              </>
            )}
          </div>

          {/* Trailers como enlaces externos */}
          {trailers.length > 0 && (
            <div className="mt-2">
              <h6>Trailers:</h6>
              {trailers.map((trailer: any) => (
                <a
                  key={trailer.id}
                  href={trailer.data?.max || trailer.data?.['480']}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-info btn-sm me-2 mb-2"
                >
                  ▶ {trailer.name || 'Ver trailer'}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Info del juego */}
        <div className="col-md-6">
          <h1>{juego.name}</h1>
          <p><span className="badge bg-warning text-dark">Metacritic: {juego.metacritic || 'N/A'}</span></p>
          <p><strong>Fecha de lanzamiento:</strong> {juego.released || 'Desconocida'}</p>
          <p><strong>Géneros:</strong> {juego.genres?.map((g: any) => g.name).join(', ') || 'Desconocido'}</p>
          <p><strong>Plataformas:</strong> {juego.platforms?.map((p: any) => p.platform.name).join(', ') || 'Desconocida'}</p>
          <button
            className="btn btn-success mt-2 me-2"
            onClick={async () => {
              const usuario = auth.currentUser
              if (!usuario) return
              const token = await usuario.getIdToken()
              await fetch(`http://localhost:8000/biblioteca/agregar/${id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
              })
              alert('Juego agregado a tu biblioteca')
            }}
          >
            ➕ Añadir a biblioteca
          </button>
          <p className="mt-3">{juego.description_raw?.slice(0, 300)}...</p>
          {juego.website && (
            <a href={juego.website} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-2">
              🌐 Página oficial
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetalleJuego