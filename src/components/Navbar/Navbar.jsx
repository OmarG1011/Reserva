import { FaHotel } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthModal } from "../AuthModal/AuthModal";
import { Session } from "../Session/Session"; // Importa el componente Session

export function Navbar() {
    const { user, handleLogout } = Session(); // Obtiene el usuario autenticado y la función de cierre de sesión
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate(); // Hook para redirigir al usuario

    const handleReservasClick = (e) => {
        if (!user) {
            e.preventDefault(); // Evita la redirección
            setShowModal(true); // Abre el modal de inicio de sesión
        } else {
            navigate("/Reserva"); // Redirige a la página de reservas si el usuario está autenticado
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg minavbar">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand d-flex align-items-center">
                        <FaHotel className="fs-1 textitle" /> {/* Icono */}
                        <h1 className="px-2 text-white textitle">Paradise</h1>
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon "></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link textitle fs-5" to="/">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link textitle fs-5" to="/HotelesList">Habitaciones</Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className="nav-link textitle fs-5"
                                    to="/Reserva"
                                    onClick={handleReservasClick} // Maneja el clic en "Reservas"
                                >
                                    Reservas
                                </Link>
                            </li>
                            <li className="nav-item d-flex align-items-center">
                                {user ? (
                                    <>
                                        <span className="nav-link textitle fs-5 mr-2 d-none d-lg-block">
                                            {user.email}
                                        </span>
                                        <button
                                            className="nav-link textitle fs-5 btn btn-link"
                                            onClick={handleLogout}
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="nav-link textitle fs-5 btn btn-link"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Iniciar Sesión
                                    </button>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <AuthModal showModal={showModal} setShowModal={setShowModal} />
        </>
    );
}