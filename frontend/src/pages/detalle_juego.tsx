import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import '../styles/detalle.css'

function DetalleJuego() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [juego, setJuego] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [screenshots, setScreenshots] = useState<any[]>([])
  const [trailers, setTrailers] = useState<any[]>([])
  const [imagenActual, setImagenActual] = useState(0)
  const [añadido, setAñadido] = useState(false)
  const [enBiblioteca, setEnBiblioteca] = useState(false)

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

        const token = await auth.currentUser?.getIdToken()
        if (token) {
          const bibRes = await fetch('http://localhost:8000/biblioteca/', {
            headers: { Authorization: `Bearer ${token}` }
          })
          const bibData = await bibRes.json()
          const yaEsta = bibData.juegos.some((j: any) => j.rawg_juego_id === parseInt(id || '0'))
          setEnBiblioteca(yaEsta)
        }

      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchJuego()
  }, [id])

  if (loading) return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid #1f1f1f', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (error) return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ backgroundColor: '#1a0a0a', border: '1px solid #3f1f1f', borderRadius: '8px', padding: '12px 16px', color: '#f87171' }}>{error}</div>
    </div>
  )

  const todasLasImagenes = [juego.background_image, ...screenshots.map((s: any) => s.image)].filter(Boolean)

  return (
    <div className="detalle-page">
      <div className="detalle-container">

        <button className="detalle-btn-volver" onClick={() => navigate('/inicio')}>
          ← Volver al catálogo
        </button>

        <div className="detalle-grid">
          {/* Columna izquierda */}
          <div>
            <div className="detalle-imagen-principal">
              <img src={todasLasImagenes[imagenActual] || ''} alt={juego.name} />
              {todasLasImagenes.length > 1 && (
                <>
                  <button className="detalle-carousel-btn detalle-carousel-btn-prev" onClick={() => setImagenActual(i => Math.max(0, i - 1))}>‹</button>
                  <button className="detalle-carousel-btn detalle-carousel-btn-next" onClick={() => setImagenActual(i => Math.min(todasLasImagenes.length - 1, i + 1))}>›</button>
                </>
              )}
            </div>

            {todasLasImagenes.length > 1 && (
              <div className="detalle-miniaturas">
                {todasLasImagenes.slice(0, 6).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setImagenActual(i)}
                    alt=""
                    className={`detalle-miniatura ${imagenActual === i ? 'activa' : 'inactiva'}`}
                  />
                ))}
              </div>
            )}

            {trailers.length > 0 && (
              <div className="detalle-trailers">
                <p className="detalle-trailers-label">Trailers</p>
                <div className="detalle-trailers-lista">
                  {trailers.map((trailer: any) => (
                    <a key={trailer.id} href={trailer.data?.max || trailer.data?.['480']} target="_blank" rel="noopener noreferrer" className="detalle-trailer-link">
                      ▶ {trailer.name || 'Ver trailer'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha */}
          <div>
            <h1 className="detalle-titulo">{juego.name}</h1>

            {juego.metacritic && (
              <span className={`detalle-metacritic ${juego.metacritic >= 80 ? 'detalle-metacritic-verde' : juego.metacritic >= 60 ? 'detalle-metacritic-amarillo' : 'detalle-metacritic-rojo'}`}>
                Metacritic {juego.metacritic}
              </span>
            )}

            <div className="detalle-datos">
              {[
                { label: 'Lanzamiento', value: juego.released || 'Desconocida' },
                { label: 'Géneros', value: juego.genres?.map((g: any) => g.name).join(', ') || 'Desconocido' },
                { label: 'Plataformas', value: juego.platforms?.map((p: any) => p.platform.name).join(', ') || 'Desconocida' },
              ].map(({ label, value }) => (
                <div key={label} className="detalle-dato">
                  <span className="detalle-dato-label">{label}</span>
                  <span className="detalle-dato-valor">{value}</span>
                </div>
              ))}
            </div>

            <p className="detalle-descripcion">
              {(() => {
                const desc = juego.description_raw || ''
                const corte = desc.indexOf('Español')
                return corte > 0 ? desc.slice(corte + 'Español'.length).trim() : desc
              })()}
            </p>

            <div className="detalle-botones">
              <button
                className={`detalle-btn-biblioteca ${enBiblioteca ? 'añadido' : 'añadir'}`}
                onClick={async () => {
                  if (enBiblioteca) return
                  const usuario = auth.currentUser
                  if (!usuario) return
                  const token = await usuario.getIdToken()
                  await fetch(`http://localhost:8000/biblioteca/agregar/${id}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                  })
                  setEnBiblioteca(true)
                  setAñadido(true)
                  setTimeout(() => setAñadido(false), 2500)
                }}
                disabled={enBiblioteca}
              >
                {enBiblioteca ? '✓ Ya en biblioteca' : añadido ? '✓ Añadido' : '+ Añadir a biblioteca'}
              </button>

              {juego.website && (
                <a href={juego.website} target="_blank" rel="noopener noreferrer" className="detalle-btn-web">
                  🌐 Página oficial
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleJuego