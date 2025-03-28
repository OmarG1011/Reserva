import { db } from "../backend/fireBase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import placeholder from '../assets/Placeholder.jpg';
import { Link } from "react-router-dom";
export function HabitacionList() {
    const [habitaciones, setHabitaciones] = useState([]);
    const [habitacionesFiltradas, setHabitacionesFiltradas] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga
    const [mostrarCantidad, setMostrarCantidad] = useState(12); // Número de habitaciones a mostrar
    const [busqueda, setBusqueda] = useState(""); // Valor de la búsqueda

    useEffect(() => {
        const fetchHabitaciones = async () => {
            const habitacionRef = collection(db, "Habitaciones");
            const snapshot = await getDocs(habitacionRef);
            const habitacionesData = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }));
            setHabitaciones(habitacionesData);
            setHabitacionesFiltradas(habitacionesData); // Inicialmente, no hay filtro
            setLoading(false); // Cuando los datos son obtenidos, se cambia el estado de carga
        };

        fetchHabitaciones();
    }, []);

    // Filtrar habitaciones según el texto de búsqueda
    useEffect(() => {
        const habitacionesFiltradas = habitaciones.filter(habitacion =>
            habitacion.nombre.toLowerCase().includes(busqueda.toLowerCase())
        );
        setHabitacionesFiltradas(habitacionesFiltradas);
    }, [busqueda, habitaciones]);

    // Mostrar las primeras 'mostrarCantidad' habitaciones filtradas
    const habitacionesMostrar = habitacionesFiltradas.slice(0, mostrarCantidad);

    const cargarMas = () => {
        setMostrarCantidad(prevCantidad => prevCantidad + 12); // Aumenta en 12 las habitaciones a mostrar
    };

    return (
        <>
            <div className="text-center text-white p-3 mibg">
                <h2>Nuestras Habitaciones</h2>
            </div>

            {/* Barra de búsqueda */}
            <div className="text-center pb-4 mibg d-flex justify-content-center">
                <input
                    type="text"
                    placeholder="Buscar habitación"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="form-control w-50 text-center"
                />
            </div>
            <div className="d-flex flex-wrap gap-4 justify-content-center pb-4 mibg">
                {loading ? (
                    <div className="text-center">Cargando habitaciones...</div>
                ) : (
                    habitacionesMostrar.map((habitacion) => (
                        <Link to={`/habitacion/${habitacion.id}`} style={{ textDecoration: 'none' }} key={habitacion.id}>
                            <div className="card bgcard mb-4" style={{ width: '18rem', height: '100%' }}>
                                <img
                                    src={placeholder}
                                    alt={habitacion.nombre}
                                    className="card-img-top img-fluid"
                                    style={{ objectFit: 'cover', height: '200px' }}  // Altura de la imagen ajustable
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{habitacion.nombre}</h5>
                                    <p className="card-text">Capacidad: {habitacion.capacidadMax} personas</p>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item bgcard">{habitacion.descripcion}</li>
                                    <li className="list-group-item bgcard">Precio: {habitacion.precio} $</li>
                                    <li className={`list-group-item ${habitacion.disponible ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                                        {habitacion.disponible ? "Disponible" : "Ocupado"}
                                    </li>
                                </ul>
                            </div>
                        </Link>
                    ))
                )}
            </div>


            {/* Botón de "Cargar más" solo aparece si hay más habitaciones para mostrar */}
            {habitacionesFiltradas.length > mostrarCantidad && !loading && (
                <div className="text-center mibg p-4 text-white">
                    <button onClick={cargarMas} className="btn bgfooter text-white">
                        Cargar más
                    </button>
                </div>
            )}
        </>
    );
};