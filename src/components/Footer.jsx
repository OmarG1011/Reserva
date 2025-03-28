import { FaGithub, FaLinkedin } from 'react-icons/fa';
export function Footer() {
    return (
    
        <div className="footer bgfooter text-white py-3">
        <div className="container d-flex justify-content-center align-items-center">
          <p className="mb-0 me-4">Sígueme en:</p>
    
          <div>
            <a 
              href="https://github.com/OmarG1011" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white mx-3"
            >
              <FaGithub className="fs-2" /> 
            </a>
            <a 
              href="https://www.linkedin.com/in/oscar-omar-ortega-gonzalez-6247b2301" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white mx-3"
            >
              <FaLinkedin className="fs-2" /> 
            </a>
          </div>
        </div>
      </div>

    );
};