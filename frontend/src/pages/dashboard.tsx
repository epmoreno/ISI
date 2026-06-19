import { useState } from 'react';
import './dashboard.css';

export default function Dashboard() {
    // Estado para controlar si el menú lateral está abierto o cerrado
    const [sidebarToggle, setSidebarToggle] = useState(false);

    return (
        // El div principal maneja la clase que colapsa el menú
        <div className={`sb-nav-fixed ${sidebarToggle ? 'sb-sidenav-toggled' : ''}`}>
            
            {/* La etiqueta <nav className="sb-topnav..."> de la plantilla ha sido eliminada.
              Tu App.tsx ya se encarga de pintar el <Navbar /> global por encima de esto.
            */}

            <div id="layoutSidenav">
                {/* MENÚ LATERAL (SideNav) */}
                <div id="layoutSidenav_nav">
                    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                        <div className="sb-sidenav-menu">
                            <div className="nav">
                                <div className="sb-sidenav-menu-heading">Core</div>
                                <a className="nav-link" href="#!">
                                    <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                    Dashboard
                                </a>
                                
                                <div className="sb-sidenav-menu-heading">Addons</div>
                                <a className="nav-link" href="#!">
                                    <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                                    Charts
                                </a>
                                <a className="nav-link" href="#!">
                                    <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                                    Tables
                                </a>
                            </div>
                        </div>
                        <div className="sb-sidenav-footer">
                            <div className="small">Logged in as:</div>
                            Start Bootstrap
                        </div>
                    </nav>
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid px-4 mt-4">
                            
                            {/* Cabecera con el botón reubicado para controlar el menú lateral */}
                            <div className="d-flex align-items-center mb-3">
                                <button 
                                    className="btn btn-outline-secondary btn-sm me-3" 
                                    onClick={() => setSidebarToggle(!sidebarToggle)}
                                    title="Alternar menú lateral"
                                >
                                    <i className="fas fa-bars"></i>
                                </button>
                                <h1 className="mb-0">Dashboard</h1>
                            </div>

                            <ol className="breadcrumb mb-4">
                                <li className="breadcrumb-item active">Resumen del sistema</li>
                            </ol>
                            
                            {/* TARJETAS DE COLORES */}
                            <div className="row">
                                <div className="col-xl-3 col-md-6">
                                    <div className="card bg-primary text-white mb-4">
                                        <div className="card-body">Usuarios Activos</div>
                                        <div className="card-footer d-flex align-items-center justify-content-between">
                                            <a className="small text-white stretched-link" href="#!">Ver detalles</a>
                                            <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Aquí puedes replicar más tarjetas para otras métricas */}
                            </div>

                            {/* TABLA DE EJEMPLO */}
                            <div className="card mb-4">
                                <div className="card-header">
                                    <i className="fas fa-table me-1"></i>
                                    Últimos Registros
                                </div>
                                <div className="card-body">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Posición</th>
                                                <th>Oficina</th>
                                                <th>Salario</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Tiger Nixon</td>
                                                <td>System Architect</td>
                                                <td>Edinburgh</td>
                                                <td>$320,800</td>
                                            </tr>
                                            <tr>
                                                <td>Garrett Winters</td>
                                                <td>Accountant</td>
                                                <td>Tokyo</td>
                                                <td>$170,750</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>
                    <footer className="py-4 bg-light mt-auto">
                        <div className="container-fluid px-4">
                            <div className="d-flex align-items-center justify-content-between small">
                                <div className="text-muted">Copyright &copy; Tu Proyecto 2026</div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}