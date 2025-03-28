// useAuthState.js
import { useState, useEffect } from "react";
import { auth } from "../../backend/fireBase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export function Session() {
    const [user, setUser] = useState(null); // Estado para almacenar el usuario autenticado

    useEffect(() => {
        // Escucha los cambios en el estado de autenticación
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Actualiza el estado del usuario
        });

        return () => unsubscribe(); // Limpia el listener al desmontar el componente
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null); // Limpia el estado del usuario al cerrar sesión
        } catch (error) {
            console.error("Error al cerrar sesión:", error.message);
        }
    };

    return { user, setUser, handleLogout }; // Devuelve tanto el usuario como la función setUser
}
