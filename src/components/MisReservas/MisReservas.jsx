import { useState, useEffect } from "react";
import { db } from "../../backend/fireBase";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { Session } from "../Session/Session"; // Importa Session para obtener el usuario autenticado
import { Card, Button } from "react-bootstrap"; // Importa componentes de Bootstrap

export function MisReservas() {
    const { user } = Session(); // Obtén el usuario autenticado desde Session
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservas = async () => {
            if (!user) return; // Si no hay usuario autenticado, no se realiza la consulta

            try {
                const reservasRef = collection(db, "Reservas");
                const q = query(reservasRef, where("idUsuario", "==", user.uid)); // Filtra por el uid del usuario
                const snapshot = await getDocs(q);

                const reservasData = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setReservas(reservasData);
            } catch (error) {
                console.error("Error al obtener las reservas: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservas();
    }, [user]);

    // Función para cancelar una reserva
    const cancelarReserva = async (reservaId, habitacionId) => {
        try {
            // Actualizar el estado de la reserva a "cancelada"
            const reservaRef = doc(db, "Reservas", reservaId);
            await updateDoc(reservaRef, { estado: false });

            // Actualizar la disponibilidad de la habitación
            const habitacionRef = doc(db, "Habitaciones", habitacionId);
            await updateDoc(habitacionRef, { disponible: true });

            // Actualizar el estado local
            setReservas(prevReservas =>
                prevReservas.map(reserva =>
                    reserva.id === reservaId ? { ...reserva, estado: false } : reserva
                )
            );

            console.log("Reserva cancelada exitosamente.");
        } catch (error) {
            console.error("Error al cancelar la reserva: ", error);
        }
    };

    return (
        <div className="container-fluid text-white mibg min-vh-100">
    <h2 className="text-center py-4">Mis Reservas</h2>
    {loading ? (
        <p className="text-center">Cargando reservas...</p>
    ) : reservas.length === 0 ? (
        <p className="text-center">No tienes reservas actuales.</p>
    ) : (
        <div className="row g-4">
            {reservas.map((reserva) => (
                <div className="col-md-4 mb-4" key={reserva.id}>
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title">{reserva.nombreHabitacion}</h5>
                            <p className="card-text">
                                <strong>Cliente:</strong> {reserva.nombreCliente}
                            </p>
                            <p className="card-text">
                                <strong>Fecha de inicio:</strong>{" "}
                                {new Date(reserva.fechaInicio.seconds * 1000).toLocaleString()}
                            </p>
                            <p className="card-text">
                                <strong>Fecha de fin:</strong>{" "}
                                {new Date(reserva.fechaFin.seconds * 1000).toLocaleString()}
                            </p>
                            <p className="card-text">
                                <strong>Estado:</strong>{" "}
                                <span className={reserva.estado ? "text-success" : "text-danger"}>
                                    {reserva.estado ? "Activa" : "Cancelada"}
                                </span>
                            </p>
                            {reserva.estado && (
                                <button
                                    className="btn btn-danger"
                                    onClick={() => cancelarReserva(reserva.id, reserva.habitacionId)}
                                >
                                    Cancelar Reserva
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )}
</div>

    );
}
