import { db } from "../backend/fireBase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import placeholder from '../assets/Placeholder.jpg';
import { Link } from "react-router-dom";
export function HotelesDestacados() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchHabitaciones = async () => {
      const habitacionRef = collection(db, "Habitaciones");
      const snapshot = await getDocs(habitacionRef);
      const habitacionesData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setHabitaciones(habitacionesData);
      setLoading(false); // Cuando los datos son obtenidos, se cambia el estado de carga
    };

    fetchHabitaciones();
  }, []);

  const habitacionesRandom = useMemo(() => {
    if (habitaciones.length < 3) return habitaciones; // Si hay menos de 3, mostrar todas
    return [...habitaciones].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [habitaciones]);


  return (
    <>
      <div className="text-center text-white p-4 mibg">
        <h2>Habitaciones Destacadas</h2>
      </div>
      <div className="d-flex flex-wrap gap-4 justify-content-center pb-4 mibg">
        {habitacionesRandom.map((habitacion) => (
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
        ))}
      </div>
    </>


  );
}
