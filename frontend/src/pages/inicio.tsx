import { useState, useEffect } from 'react'
import '../styles/inicio.css'

function Inicio() {
  const [games, setGames] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [genero, setGenero] = useState('')
  const [plataforma, setPlataforma] = useState('')
  const [orden, setOrden] = useState('')

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const apikey = "95252892507c4c7ca20417bfcead9e8a"
        let apiurl = `https://api.rawg.io/api/games?key=${apikey}&page=${page}&page_size=20`
        
        if (busqueda.trim()) {
          apiurl += `&search=${encodeURIComponent(busqueda)}`
        }

        if (genero) {
          apiurl += `&genres=${genero}`
        }

        if (plataforma) {
          apiurl += `&platforms=${plataforma}`
        }

        if (orden) {
          apiurl += `&ordering=${orden}`
        }

        const response = await fetch(apiurl)
        if (!response.ok) throw new Error(`Error: ${response.status}`)
        const data = await response.json()
        setGames(data.results)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [page, busqueda, genero, plataforma, orden])

  return (
    <div className="inicio-page">
      <div className="inicio-container">

        <div className="inicio-header">
          <h1 className="inicio-titulo">Catálogo de juegos</h1>
          <p className="inicio-subtitulo">Página {page} · {games.length} resultados</p>
        </div>

        <input
          type="text"
          className="inicio-buscador"
          placeholder="Buscar entre +800.000 juegos..."
          value={busqueda}
          onChange={e => { setBusqueda(e.target.value); setPage(1) }}
        />

        <div className="inicio-filtros">
          <select className={`inicio-select ${genero ? 'activo' : ''}`} value={genero} onChange={e => { setGenero(e.target.value); setPage(1) }}>
            <option value="">Todos los géneros</option>
            <option value="action">Acción</option>
            <option value="rpg">RPG</option>
            <option value="shooter">Shooter</option>
            <option value="adventure">Aventura</option>
            <option value="strategy">Estrategia</option>
            <option value="simulation">Simulación</option>
            <option value="sports">Deportes</option>
            <option value="puzzle">Puzzle</option>
            <option value="racing">Carreras</option>
            <option value="fighting">Lucha</option>
          </select>

          <select className={`inicio-select ${plataforma ? 'activo' : ''}`} value={plataforma} onChange={e => { setPlataforma(e.target.value); setPage(1) }}>
            <option value="">Todas las plataformas</option>
            <option value="4">PC</option>
            <option value="187">PlayStation 5</option>
            <option value="18">PlayStation 4</option>
            <option value="1">Xbox One</option>
            <option value="186">Xbox Series S/X</option>
            <option value="7">Nintendo Switch</option>
            <option value="3">iOS</option>
            <option value="21">Android</option>
          </select>

          <select className={`inicio-select ${orden ? 'activo' : ''}`} value={orden} onChange={e => { setOrden(e.target.value); setPage(1) }}>
            <option value="">Ordenar por</option>
            <option value="-metacritic">Mejor nota</option>
            <option value="-released">Más recientes</option>
            <option value="released">Más antiguos</option>
            <option value="-rating">Mejor valorados</option>
            <option value="-added">Más populares</option>
          </select>

          {(genero || plataforma || orden || busqueda) && (
            <button className="inicio-btn-limpiar" onClick={() => { setGenero(''); setPlataforma(''); setOrden(''); setBusqueda(''); setPage(1) }}>
              ✕ Limpiar filtros
            </button>
          )}
        </div>

        {error && <div className="inicio-error">{error}</div>}

        {loading ? (
          <div className="spinner-container">
            <div className="spinner" />
          </div>
        ) : (
          <>
            <div className="inicio-grid">
              {games.map((juego) => (
                <a href={`/juego/${juego.id}`} className="inicio-card" key={juego.id}>
                  <img
                    src={juego.background_image || 'https://via.placeholder.com/300x150?text=Sin+Imagen'}
                    className="inicio-card-img"
                    alt={juego.name}
                  />
                  <div className="inicio-card-body">
                    <p className="inicio-card-titulo">{juego.name}</p>
                    <div className="inicio-card-footer">
                      <span className="inicio-card-genero">{juego.genres?.[0]?.name || 'Desconocido'}</span>
                      {juego.metacritic && (
                        <span className={
                          juego.metacritic >= 80 ? 'inicio-metacritic-verde' :
                          juego.metacritic >= 60 ? 'inicio-metacritic-amarillo' :
                          'inicio-metacritic-rojo'
                        }>
                          {juego.metacritic}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="inicio-paginacion">
              <button className="inicio-btn-anterior" onClick={() => setPage(page - 1)} disabled={page === 1}>
                ← Anterior
              </button>
              <span className="inicio-pagina-texto">Página {page}</span>
              <button className="inicio-btn-siguiente" onClick={() => setPage(page + 1)}>
                Siguiente →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Inicio