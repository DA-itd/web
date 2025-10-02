// FIX: Import React to resolve namespace errors.
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-blue-800 text-white text-center p-4 mt-auto">
            <p className="font-semibold">COORDINACIÓN DE ACTUALIZACIÓN DOCENTE - Desarrollo Académico</p>
            <p className="text-sm">Todos los derechos reservados 2026.</p>
        </footer>
    );
};

export default Footer;