import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 1. Definimos los "estados" (variables que al cambiar, actualizan la pantalla)
  const [games, setGames] = useState<any[]>([]) // Guardará los juegos de la API
  const [page, setPage] = useState(1) // Guarda la página actual
  const [loading, setLoading] = useState(false) // Para mostrar un spinner de carga
  const [error, setError] = useState<string | null>(null) // Para manejar errores

  // 2. useEffect hace la llamada a la API. 
  // El array [page] al final indica que esto se volverá a ejecutar cada vez que cambie de página.
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const apikey = "95252892507c4c7ca20417bfcead9e8a"
        const apiurl = `https://api.rawg.io/api/games?key=${apikey}&page=${page}&page_size=20`
        
        // El equivalente a curl_exec
        const response = await fetch(apiurl)
        
        // Comprobamos si hay error (equivalente a tu comprobación de $httpCode === 200)
        if (!response.ok) {
          throw new Error(`Error: API request failed with status code ${response.status}`)
        }
        
        // Decodificamos el JSON
        const data = await response.json()
        setGames(data.results)
        
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [page]) // <--- Importante: Dependencia de la página

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Catálogo - Página {page}</h1>

      {/* Manejo de Errores */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Estado de Carga (Spinner de Bootstrap) */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Grid de Bootstrap: se adapta a móviles, tablets y escritorio automáticamente */}
          <div className="row">
            {games.map((juego) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={juego.id}>
                <div className="card h-100 shadow-sm text-bg-dark">
                  {/* Imagen de fondo */}
                  <img 
                    src={juego.background_image || 'https://via.placeholder.com/300x150?text=Sin+Imagen'} 
                    className="card-img-top" 
                    style={{ height: '150px', objectFit: 'cover' }} 
                    alt={juego.name} 
                  />
                  <div className="card-body">
                    <h5 className="card-title text-truncate" title={juego.name}>{juego.name}</h5>
                    <p className="card-text mb-1">
                      {/* Usamos Optional Chaining (?.) por si un juego no tiene géneros listados */}
                      <small className="text-info">Género: {juego.genres?.[0]?.name || 'Desconocido'}</small>
                    </p>
                    <p className="card-text">
                      <small className="text-warning">Nota: {juego.metacritic || 'N/A'}</small>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de Paginación */}
          <div className="d-flex justify-content-between mt-3 mb-5">
            <button 
              className="btn btn-secondary" 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1} // Deshabilita el botón "Anterior" en la página 1
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

export default App