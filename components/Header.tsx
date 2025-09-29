import React from 'react';

const Header: React.FC = () => (
    <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center">
            <img 
                src="https://raw.githubusercontent.com/DA-itd/web/main/logo_itdurango.png" 
                alt="Logo ITD" 
                className="h-12 md:h-16 mr-4"
            />
            <div className="text-center flex-grow">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
                    SISTEMA DE INSCRIPCIÓN A CURSOS DE ACTUALIZACIÓN DOCENTE
                </h1>
                <p className="text-sm md:text-base font-light">
                    INSTITUTO TECNOLÓGICO DE DURANGO
                </p>
            </div>
        </div>
    </header>
);

export default Header;