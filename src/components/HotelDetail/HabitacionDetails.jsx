import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { db } from "../../backend/fireBase";
import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import Swal from 'sweetalert2';
import placeholder from '../../assets/Placeholder.jpg';
import { Session } from "../Session/Session"; // Importa Session para obtener el usuario autenticado
import { AuthModal } from "../AuthModal/AuthModal"; // Importa el modal de autenticación

export function HabitacionDetails() {
    const { id } = useParams(); // Obtiene el id de la URL
    const { user } = Session(); // Obtiene el usuario autenticado desde Session
    const [habitacion, setHabitacion] = useState(null);
    const [showModal, setShowModal] = useState(false); // Modal de reserva
    const [showModalAuth, setShowModalAuth] = useState(false); // Modal de autenticación
    const [nombreCliente, setNombreCliente] = useState("");
    const [cantidadPersonas, setCantidadPersonas] = useState(1);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHabitacion = async () => {
            const docRef = doc(db, "Habitaciones", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setHabitacion(docSnap.data());
            } else {
                console.log("No se encontró la habitación");
            }
            setLoading(false);
        };

        fetchHabitacion();
    }, [id]);

    const handleClose = () => setShowModal(false);
    const handleShow = () => {
        if (!user) {
            setShowModalAuth(true); // Abre el modal de inicio de sesión si no hay usuario autenticado
        } else {
            setShowModal(true); // Abre el modal de reserva si el usuario está autenticado
        }
    };

    const handleReserva = async () => {
        try {
            // Validar que los campos no estén vacíos
            if (!nombreCliente || !fechaInicio || !fechaFin) {
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor, complete todos los campos.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            // Verificar que la cantidad de personas no exceda el límite de la habitación
            if (cantidadPersonas > habitacion.capacidadMax) {
                Swal.fire({
                    title: 'Error',
                    text: `La habitación solo permite ${habitacion.capacidadMax} personas.`,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            // Convertir las fechas en objetos de tipo Timestamp para Firestore
            const fechaInicioTimestamp = new Date(fechaInicio);
            const fechaFinTimestamp = new Date(fechaFin);

            if (fechaInicioTimestamp >= fechaFinTimestamp) {
                Swal.fire({
                    title: 'Error',
                    text: 'La fecha de inicio debe ser anterior a la fecha de fin.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            // Crear la reserva en Firestore
            await addDoc(collection(db, "Reservas"), {
                estado: true, // La reserva está activa
                fechaInicio: fechaInicioTimestamp, // Fecha de inicio de la reserva
                fechaFin: fechaFinTimestamp, // Fecha de fin de la reserva
                habitacionId: id, // ID de la habitación
                nombreCliente: nombreCliente, // Nombre del cliente
                nombreHabitacion: habitacion.nombre, // Nombre de la habitación
                numPersonas: cantidadPersonas, // Número de personas
                idUsuario: user.uid, // ID del usuario autenticado
            });

            // Actualizar la habitación para marcarla como ocupada
            const habitacionRef = doc(db, "Habitaciones", id);
            await updateDoc(habitacionRef, {
                disponible: false, // Marcar la habitación como no disponible
            });

            // Actualizar el estado de la habitación en el frontend
            setHabitacion(prevHabitacion => ({
                ...prevHabitacion,
                disponible: false, // Cambiar el estado de "disponible" a "no disponible"
            }));

            Swal.fire({
                title: 'Reserva Confirmada',
                text: 'Tu reserva se ha realizado con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });

            console.log("Reserva realizada con éxito");
            handleClose(); // Cerrar el modal después de la reserva
        } catch (error) {
            console.error("Error al realizar la reserva: ", error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al realizar la reserva. Intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    const today = new Date().toISOString().split("T")[0];

    const handleFechaInicioChange = (e) => {
        setFechaInicio(e.target.value);
        setFechaFin(""); // Resetear fecha de fin si se cambia la fecha de inicio
    };

    const handleFechaFinChange = (e) => {
        setFechaFin(e.target.value);
    };

    if (loading) {
        return <div>Cargando detalles...</div>;
    }

    return (
        <div className="habitacion-detail container-fluid d-flex flex-column justify-content-center align-items-center py-5 min-vh-100 bgcard">
            <h2 className="text-center mb-4">{habitacion.nombre}</h2>
            <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                    <img src={placeholder} alt={habitacion.nombre} className="img-fluid rounded mb-4" />
                </div>
                <div className="col-md-6">
                    <p><strong>Capacidad:</strong> {habitacion.capacidadMax} personas</p>
                    <p><strong>Descripción:</strong> {habitacion.descripcion}</p>
                    <p><strong>Precio:</strong> {habitacion.precio} $</p>
                    <p className={habitacion.disponible ? 'text-success' : 'text-danger'}>
                        {habitacion.disponible ? "Disponible" : "Ocupado"}
                    </p>

                    <div className="text-center">
                        <Button variant="primary" onClick={handleShow} disabled={!habitacion.disponible}>
                            Reservar
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal de Reserva */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Reservar {habitacion.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="nombreCliente" className="form-label">Nombre del Cliente</label>
                        <input
                            type="text"
                            id="nombreCliente"
                            className="form-control"
                            value={nombreCliente}
                            onChange={(e) => setNombreCliente(e.target.value)}
                            placeholder="Ingresa tu nombre"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cantidadPersonas" className="form-label">Cantidad de personas</label>
                        <input
                            type="number"
                            id="cantidadPersonas"
                            className="form-control"
                            value={cantidadPersonas}
                            onChange={(e) => setCantidadPersonas(e.target.value)}
                            min="1"
                            max={habitacion.capacidadMax}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fechaInicio" className="form-label">Fecha de inicio</label>
                        <input
                            type="date"
                            id="fechaInicio"
                            className="form-control"
                            value={fechaInicio}
                            onChange={handleFechaInicioChange}
                            min={today}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fechaFin" className="form-label">Fecha de fin</label>
                        <input
                            type="date"
                            id="fechaFin"
                            className="form-control"
                            value={fechaFin}
                            onChange={handleFechaFinChange}
                            min={fechaInicio}
                            disabled={!fechaInicio}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleReserva}>
                        Confirmar Reserva
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Autenticación */}
            <AuthModal showModal={showModalAuth} setShowModal={setShowModalAuth} />
        </div>
    );
}
