import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

function Inicio() {
  const [games, setGames] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const apikey = "95252892507c4c7ca20417bfcead9e8a"
        const apiurl = `https://api.rawg.io/api/games?key=${apikey}&page=${page}&page_size=20`
        const response = await fetch(apiurl)
        
        if (!response.ok) {
          throw new Error(`Error: API request failed with status code ${response.status}`)
        }
        
        const data = await response.json()
        setGames(data.results)
        
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [page])

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Catálogo - Página {page}</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            {games.map((juego) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={juego.id}>
                <Link to={`/juego/${juego.id}`} className="text-decoration-none">
                  <div className="card h-100 shadow-sm text-bg-dark">
                    <img 
                      src={juego.background_image || 'https://via.placeholder.com/300x150?text=Sin+Imagen'} 
                      className="card-img-top" 
                      style={{ height: '150px', objectFit: 'cover' }} 
                      alt={juego.name} 
                    />
                    <div className="card-body">
                      <h5 className="card-title text-truncate" title={juego.name}>{juego.name}</h5>
                      <p className="card-text mb-1">
                        <small className="text-info">Género: {juego.genres?.[0]?.name || 'Desconocido'}</small>
                      </p>
                      <p className="card-text">
                        <small className="text-warning">Nota: {juego.metacritic || 'N/A'}</small>
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between mt-3 mb-5">
            <button 
              className="btn btn-secondary" 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
            >
              ⬅️ Anterior
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => setPage(page + 1)}
            >
              Siguiente ➡️
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Inicio