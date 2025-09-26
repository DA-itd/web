
import React from 'react';

const Header: React.FC = () => {
    return (
        <div className="flex flex-col justify-center items-center text-center mb-6 border-b pb-4">
            <img src="https://raw.githubusercontent.com/DA-itd/web/main/logo_itdurango.png" alt="Logo ITD" className="h-20 w-auto object-contain mb-4" />
            <div className="w-full">
                <h2 className="text-xl font-semibold text-gray-700">INSTITUTO TECNOLOGICO DE DURANGO</h2>
                <h1 className="text-3xl font-bold text-gray-800">Registro de Cursos de Actualización Docente</h1>
            </div>
        </div>
    );
};

export default Header;
