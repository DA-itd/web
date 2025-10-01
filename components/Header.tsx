import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24">
                    <div className="flex-shrink-0">
                        <img className="h-16 md:h-20" src="https://raw.githubusercontent.com/DA-itd/web/main/logo_itdurango.png" alt="Logo Instituto Tecnológico de Durango" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl md:text-2xl font-bold text-blue-900">SISTEMA DE INSCRIPCIÓN A CURSOS DE ACTUALIZACIÓN DOCENTE</h1>
                        <h2 className="text-md md:text-lg text-blue-900">INSTITUTO TECNOLÓGICO DE DURANGO</h2>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;