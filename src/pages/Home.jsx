import { Navbar } from "../components/Navbar/Navbar";
import { Carrousel } from "../components/Carrousel";
import { HotelesDestacados } from "../components/HotelesDestacados";
import { Footer } from "../components/Footer";
export function Home() {
    return (
        <>
            <Navbar />
            <Carrousel/>
            <HotelesDestacados/>
            <Footer/>
        </>

    );
};