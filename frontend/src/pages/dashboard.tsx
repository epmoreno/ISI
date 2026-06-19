import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip as PieTooltip, BarChart, Bar } from 'recharts';
import './dashboard.css';

// 1. Interfaces
interface Juego {
    id: number;
    name: string;
    released: string;
    rating: number;
    metacritic: number;
    platforms: { platform: { name: string } }[];
    tags: { name: string }[];
}

interface Genero {
    id: number;
    name: string;
    games_count: number;
}

const COLORES_ANILLO = ['#0dcaf0', '#198754', '#ffc107', '#fd7e14', '#d63384', '#6c757d'];

export default function Dashboard() {
    const [menuLateralAbierto, setMenuLateralAbierto] = useState(false);
    
    const [juegos, setJuegos] = useState<Juego[]>([]);
    const [totalJuegos, setTotalJuegos] = useState<number>(0);
    const [juegoTop, setJuegoTop] = useState<Juego | null>(null);
    const [generos, setGeneros] = useState<Genero[]>([]);
    
    // Estados para los gráficos
    const [datosGraficoLineas, setDatosGraficoLineas] = useState<{ anio: string; lanzamientos: number }[]>([]);
    const [datosPlataformas, setDatosPlataformas] = useState<{ nombre: string; valor: number }[]>([]);
    const [datosEtiquetas, setDatosEtiquetas] = useState<{ nombre: string; valor: number }[]>([]); // <-- NUEVO ESTADO
    
    const [cargando, setCargando] = useState<boolean>(true);
    const [errorPeticion, setErrorPeticion] = useState<string | null>(null);

    useEffect(() => {
        const obtenerTodosLosDatos = async () => {
            try {
                const claveApi = import.meta.env.VITE_RAWG_API_KEY;
                if (!claveApi) throw new Error("API Key no encontrada");

                const peticionJuegos = fetch(`https://api.rawg.io/api/games?key=${claveApi}&page_size=40&ordering=-added`);
                const peticionMejorValorado = fetch(`https://api.rawg.io/api/games?key=${claveApi}&page_size=1&ordering=-metacritic`);
                const peticionGeneros = fetch(`https://api.rawg.io/api/genres?key=${claveApi}&page_size=5`);

                const [respuestaJuegos, respuestaMejorValorado, respuestaGeneros] = await Promise.all([peticionJuegos, peticionMejorValorado, peticionGeneros]);

                if (!respuestaJuegos.ok || !respuestaMejorValorado.ok || !respuestaGeneros.ok) {
                    throw new Error("Error en las llamadas a la API");
                }

                const datosJuegos = await respuestaJuegos.json();
                const datosMejorValorado = await respuestaMejorValorado.json();
                const datosGeneros = await respuestaGeneros.json();

                // Gráfico de Líneas (Evolución Temporal)
                const conteoPorAnio: Record<string, number> = {};
                datosJuegos.results.forEach((juego: Juego) => {
                    if (juego.released) {
                        const anio = juego.released.substring(0, 4);
                        conteoPorAnio[anio] = (conteoPorAnio[anio] || 0) + 1;
                    }
                });
                const datosGraficoFormateados = Object.keys(conteoPorAnio)
                    .sort()
                    .map(anio => ({ anio: anio, lanzamientos: conteoPorAnio[anio] }));

                // Gráfico de Anillo (Agrupación de Plataformas)
                const conteoPlataformas: Record<string, number> = {};
                datosJuegos.results.forEach((juego: Juego) => {
                    juego.platforms?.forEach(plataforma => {
                        let nombrePlataforma = plataforma.platform.name;
                        if (nombrePlataforma.includes("PlayStation")) nombrePlataforma = "PlayStation";
                        else if (nombrePlataforma.includes("Xbox")) nombrePlataforma = "Xbox";
                        else if (nombrePlataforma.includes("Nintendo") || nombrePlataforma.includes("Wii") || nombrePlataforma.includes("Game Boy")) nombrePlataforma = "Nintendo";
                        else if (nombrePlataforma.includes("macOS") || nombrePlataforma.includes("Apple")) nombrePlataforma = "Mac";
                        else if (!["PC", "Linux", "Android", "iOS"].includes(nombrePlataforma)) nombrePlataforma = "Otros";

                        conteoPlataformas[nombrePlataforma] = (conteoPlataformas[nombrePlataforma] || 0) + 1;
                    });
                });
                const datosPlataformasFormateados = Object.keys(conteoPlataformas)
                    .map(clave => ({ nombre: clave, valor: conteoPlataformas[clave] }))
                    .sort((a, b) => b.valor - a.valor);

                // Gráfico de Barras (Filtrado de Etiquetas Clave)
                const conteoEtiquetas: Record<string, number> = {};
                // Definimos qué mecánicas queremos vigilar estrictamente
                const etiquetasClave = ["Singleplayer", "Multiplayer", "Co-op", "Open World", "Atmospheric", "RPG", "Sandbox", "Shooter", "Survival"];

                datosJuegos.results.forEach((juego: Juego) => {
                    juego.tags?.forEach(etiqueta => {
                        if (etiquetasClave.includes(etiqueta.name)) {
                            conteoEtiquetas[etiqueta.name] = (conteoEtiquetas[etiqueta.name] || 0) + 1;
                        }
                    });
                });

                // Convertimos, ordenamos de más a menos popular y nos quedamos el Top 6
                const datosEtiquetasFormateados = Object.keys(conteoEtiquetas)
                    .map(clave => ({ nombre: clave, valor: conteoEtiquetas[clave] }))
                    .sort((a, b) => b.valor - a.valor)
                    .slice(0, 6);


                // Actualizamos estados
                setJuegos(datosJuegos.results.slice(0, 10));
                setDatosGraficoLineas(datosGraficoFormateados);
                setDatosPlataformas(datosPlataformasFormateados);
                setDatosEtiquetas(datosEtiquetasFormateados); // Guardamos las etiquetas
                setTotalJuegos(datosJuegos.count);
                setJuegoTop(datosMejorValorado.results[0]);
                setGeneros(datosGeneros.results);
                
                setCargando(false);

            } catch (errorCapturado: any) {
                console.error(errorCapturado);
                setErrorPeticion(errorCapturado.message);
                setCargando(false);
            }
        };

        obtenerTodosLosDatos();
    }, []);

    return (
        <div className={`sb-nav-fixed ${menuLateralAbierto ? 'sb-sidenav-toggled' : ''}`}>
            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <nav className="sb-sidenav sb-sidenav-dark">
                        <div className="sb-sidenav-menu">
                            <div className="nav">
                                <div className="sb-sidenav-menu-heading">Analítica</div>
                                <a className="nav-link" href="/dashboard">
                                    <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                    Panel Principal
                                </a>
                                <a className="nav-link" href="/">
                                    <div className="sb-nav-link-icon"><i className="fas fa-sign-out-alt"></i></div>
                                    Cerrar Sesión
                                </a>
                            </div>
                        </div>
                    </nav>
                </div>

                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid px-4 mt-4">
                            
                            <div className="d-flex align-items-center mb-3">
                                <button className="btn btn-outline-secondary btn-sm me-3" onClick={() => setMenuLateralAbierto(!menuLateralAbierto)}>
                                    <i className="fas fa-bars"></i>
                                </button>
                                <h1 className="mb-0">Dashboard Analytics</h1>
                            </div>

                            {errorPeticion && <div className="alert alert-danger">Error: {errorPeticion}</div>}

                            {/* Tarjetas Superiores */}
                            <div className="row">
                                <div className="col-xl-4 col-md-6">
                                    <div className="card bg-primary text-white mb-4 shadow-sm border-0">
                                        <div className="card-body">
                                            <h5 className="card-title text-uppercase text-white-50 fs-6">Juegos Indexados</h5>
                                            <p className="card-text fs-4 fw-bold">{cargando ? "..." : totalJuegos.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-md-6">
                                    <div className="card bg-warning text-white mb-4 shadow-sm border-0">
                                        <div className="card-body">
                                            <h5 className="card-title text-uppercase text-white-50 fs-6">Top Histórico</h5>
                                            <p className="card-text fs-4 fw-bold text-truncate" title={juegoTop?.name}>
                                                {cargando ? "..." : juegoTop?.name || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-md-12">
                                    <div className="card bg-success text-white mb-4 shadow-sm border-0">
                                        <div className="card-body pb-0">
                                            <h5 className="card-title text-uppercase text-white-50 fs-6">Género Rey</h5>
                                            <p className="card-text fs-4 fw-bold mb-2">{cargando ? "..." : generos[0]?.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fila 1: Líneas y Anillo */}
                            <div className="row">
                                <div className="col-xl-8">
                                    <div className="card mb-4 border-secondary shadow-lg" style={{ backgroundColor: '#0a0a0a' }}>
                                        <div className="card-header border-secondary bg-transparent text-info text-uppercase fw-bold pt-3 pb-3">
                                            <i className="fas fa-chart-line me-2"></i>
                                            Distribución de Lanzamientos
                                        </div>
                                        <div className="card-body" style={{ height: '300px' }}>
                                            {cargando ? (
                                                <div className="d-flex justify-content-center align-items-center h-100">
                                                    <div className="spinner-border text-info" role="status"></div>
                                                </div>
                                            ) : (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={datosGraficoLineas} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                                                        <XAxis dataKey="anio" stroke="#555" tick={{fill: '#777', fontSize: 12}} tickMargin={10} />
                                                        <YAxis stroke="#555" tick={{fill: '#777', fontSize: 12}} allowDecimals={false} />
                                                        <LineTooltip 
                                                            contentStyle={{ backgroundColor: '#000', borderColor: '#0dcaf0', borderRadius: '5px', boxShadow: '0 0 10px rgba(13, 202, 240, 0.2)' }} 
                                                            itemStyle={{ color: '#0dcaf0', fontWeight: 'bold' }}
                                                            labelStyle={{ color: '#fff', marginBottom: '5px' }}
                                                        />
                                                        <Line type="monotone" dataKey="lanzamientos" stroke="#0dcaf0" strokeWidth={3} dot={{ r: 4, fill: '#000', stroke: '#0dcaf0', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#0dcaf0', stroke: '#fff' }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-4">
                                    <div className="card mb-4 border-secondary shadow-lg" style={{ backgroundColor: '#0a0a0a' }}>
                                        <div className="card-header border-secondary bg-transparent text-success text-uppercase fw-bold pt-3 pb-3">
                                            <i className="fas fa-chart-pie me-2"></i>
                                            Cuota de Plataformas
                                        </div>
                                        <div className="card-body" style={{ height: '300px' }}>
                                            {cargando ? (
                                                <div className="d-flex justify-content-center align-items-center h-100">
                                                    <div className="spinner-border text-success" role="status"></div>
                                                </div>
                                            ) : (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie data={datosPlataformas} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="valor" nameKey="nombre" stroke="#0a0a0a" strokeWidth={2}>
                                                            {datosPlataformas.map((entrada, indice) => (
                                                                <Cell key={`celda-${indice}`} fill={COLORES_ANILLO[indice % COLORES_ANILLO.length]} />
                                                            ))}
                                                        </Pie>
                                                        <PieTooltip 
                                                            contentStyle={{ backgroundColor: '#000', borderColor: '#198754', borderRadius: '5px' }} 
                                                            itemStyle={{ color: '#fff' }}
                                                        />
                                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#999', fontSize: '12px', paddingTop: '10px' }} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fila 2: Gráfico de Barras Horizontal */}
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card mb-4 border-secondary shadow-lg" style={{ backgroundColor: '#0a0a0a' }}>
                                        <div className="card-header border-secondary bg-transparent text-warning text-uppercase fw-bold pt-3 pb-3">
                                            <i className="fas fa-tags me-2"></i>
                                            Mecánicas más Populares
                                        </div>
                                        <div className="card-body" style={{ height: '320px' }}>
                                            {cargando ? (
                                                <div className="d-flex justify-content-center align-items-center h-100">
                                                    <div className="spinner-border text-warning" role="status"></div>
                                                </div>
                                            ) : (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={datosEtiquetas} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
                                                        <XAxis type="number" stroke="#555" tick={{fill: '#777', fontSize: 12}} allowDecimals={false} />
                                                        <YAxis type="category" dataKey="nombre" stroke="#555" tick={{fill: '#aaa', fontSize: 13, fontWeight: 500}} width={110} />
                                                        <LineTooltip 
                                                            contentStyle={{ backgroundColor: '#000', borderColor: '#ffc107', borderRadius: '5px' }} 
                                                            cursor={{fill: '#111'}} 
                                                            itemStyle={{ color: '#ffc107', fontWeight: 'bold' }}
                                                            labelStyle={{ color: '#aaa' }}
                                                        />
                                                        <Bar dataKey="valor" fill="#ffc107" radius={[0, 4, 4, 0]} name="Juegos" barSize={24} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TABLA PRINCIPAL - ESTILO CYBORG */}
                            <div className="card mb-4 border-secondary shadow-lg" style={{ backgroundColor: '#0a0a0a' }}>
                                <div className="card-header border-secondary bg-transparent text-white text-uppercase fw-bold pt-3 pb-3">
                                    <i className="fas fa-fire me-2 text-danger"></i>
                                    Juegos Populares del Momento
                                </div>
                                <div className="card-body p-0" style={{ backgroundColor: '#0a0a0a' }}>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0 text-light">
                                            <thead style={{ backgroundColor: '#050505' }}>
                                                <tr className="text-white">
                                                    <th className="ps-4 py-3 border-secondary">Título</th>
                                                    <th className="py-3 border-secondary">Lanzamiento</th>
                                                    <th className="py-3 border-secondary">Metacritic</th>
                                                    <th className="py-3 border-secondary">Plataformas</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cargando ? (
                                                    <tr>
                                                        <td colSpan={4} className="text-center py-5">
                                                            <div className="spinner-border text-info" role="status"></div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    juegos.map((juego) => (
                                                        <tr key={juego.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                                                            <td className="ps-4 fw-bold text-info">{juego.name}</td>
                                                            <td className="text-muted">{juego.released ? new Date(juego.released).toLocaleDateString() : 'TBA'}</td>
                                                            <td>
                                                                <span className={`badge ${juego.metacritic >= 80 ? 'bg-success' : juego.metacritic >= 60 ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                                                    {juego.metacritic || 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td className="text-white">
                                                                {juego.platforms?.slice(0, 3).map(p => p.platform.name).join(', ')}
                                                                {juego.platforms?.length > 3 && ' +'}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}