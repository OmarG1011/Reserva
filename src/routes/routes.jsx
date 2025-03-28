import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { HotelesList } from "../pages/HotelesList";
import { HotelDetails } from "../pages/HotelDetails";
import { Reserva } from "../pages/Reserva";

export function MyRoutes() {
    return (
        <Router basename="/Reserva">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/HotelesList" element={<HotelesList />} />
                <Route path="/habitacion/:id" element={<HotelDetails />} />
                <Route path="/Reserva" element={<Reserva />} />
            </Routes>
        </Router>
    );
}

export default MyRoutes;
