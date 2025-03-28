import uno from '../assets/1.jpg';
import dos from '../assets/2.jpg';
import tres from '../assets/3.jpg';
export function Carrousel() {

    return (
        <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
                {/* Imagen 1 */}
                <div className="carousel-item active position-relative">
                    <img src={uno} className="d-block w-100" alt="Imagen 1" style={{ objectFit: "cover", height: "60vh" }} />
                    <div className="overlay position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                    <div className="carousel-caption position-absolute top-50 start-50 translate-middle text-white text-center">
                        <h2 className="fs-1 fs-sm-3 fs-md-4 fs-lg-5">Bienvenido a Paradise</h2>
                        <p className="fs-4 fs-sm-5 fs-md-4 fs-lg-5">Disfruta de una experiencia única</p>
                    </div>
                </div>

                {/* Imagen 2 */}
                <div className="carousel-item position-relative">
                    <img src={dos} className="d-block w-100" alt="Imagen 2" style={{ objectFit: "cover", height: "60vh" }} />
                    <div className="overlay position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                    <div className="carousel-caption position-absolute top-50 start-50 translate-middle text-white text-center">
                        <h2 className="fs-1 fs-sm-3 fs-md-4 fs-lg-5">Explora Nuestros Servicios</h2>
                        <p className="fs-4 fs-sm-5 fs-md-4 fs-lg-5">Lujo y confort a tu alcance</p>
                    </div>
                </div>

                {/* Imagen 3 */}
                <div className="carousel-item position-relative">
                    <img src={tres} className="d-block w-100" alt="Imagen 3" style={{ objectFit: "cover", height: "60vh" }} />
                    <div className="overlay position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                    <div className="carousel-caption position-absolute top-50 start-50 translate-middle text-white text-center">
                        <h2 className="fs-1 fs-sm-3 fs-md-4 fs-lg-5">Reserva Tu Estancia</h2>
                        <p className="fs-4 fs-sm-5 fs-md-4 fs-lg-5">Vive momentos inolvidables</p>
                    </div>
                </div>
            </div>

            {/* Botones de navegación */}
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
        </div>
    );
};