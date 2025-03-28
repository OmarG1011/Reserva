import { useState } from "react";
import { auth } from "../../backend/fireBase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Session } from "../Session/Session"; // Importa el componente Session

export function AuthModal({ showModal, setShowModal }) {
    const { user, setUser } = Session(); // Usa Session para manejar el estado del usuario
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            setUser(result.user); // Actualiza el estado del usuario en Session
            resetInputs(); // Limpia los inputs
            setShowModal(false); // Cierra el modal
        } catch (error) {
            console.error("Error al registrar usuario:", error.message);
        }
    };

    const handleLogin = async () => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            setUser(result.user); // Actualiza el estado del usuario en Session
            resetInputs(); // Limpia los inputs
            setShowModal(false); // Cierra el modal
        } catch (error) {
            console.error("Error al iniciar sesión:", error.message);
        }
    };

    // Función para limpiar los inputs
    const resetInputs = () => {
        setEmail("");
        setPassword("");
    };

    const handleCloseModal = () => {
        resetInputs(); // Limpia los inputs al cerrar el modal
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
            }}
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content bgfooter">
                    <div className="modal-header bgfooter">
                        <h5 className="modal-title text-white">{isRegistering ? "Registrar" : "Iniciar Sesión"}</h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={handleCloseModal} // Llama a la función que limpia los inputs y cierra el modal
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {/* Inputs */}
                        <input
                            type="email"
                            className="form-control mb-3"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* Botones alineados horizontalmente */}
                        <div className="d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-primary w-50 me-2"
                                onClick={isRegistering ? handleRegister : handleLogin}
                            >
                                {isRegistering ? "Registrar" : "Iniciar Sesión"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary w-50"
                                onClick={handleCloseModal} // Llama a la función que limpia los inputs y cierra el modal
                            >
                                Cerrar
                            </button>
                        </div>

                        {/* Enlace de cambio de formulario */}
                        <div className="text-center mt-3">
                            <button
                                type="button"
                                className="btn btn-link text-white"
                                onClick={() => setIsRegistering(!isRegistering)}
                            >
                                {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}