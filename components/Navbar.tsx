
import React from 'react';

interface NavbarProps {
    docenteName: string;
    onLogout: () => void;
    currentView: 'courses' | 'my-courses';
    setView: (view: 'courses' | 'my-courses') => void;
}

const Navbar: React.FC<NavbarProps> = ({ docenteName, onLogout, currentView, setView }) => {
    const baseClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClasses = "bg-blue-600 text-white";
    const inactiveClasses = "text-gray-600 hover:bg-blue-100 hover:text-blue-700";

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" />
                    </svg>
                    <h1 className="text-xl font-bold text-gray-800">Cursos TNM</h1>
                </div>
                
                <nav className="hidden md:flex items-center space-x-4">
                    <button 
                        onClick={() => setView('courses')}
                        className={`${baseClasses} ${currentView === 'courses' ? activeClasses : inactiveClasses}`}>
                        Ver Cursos
                    </button>
                    <button 
                        onClick={() => setView('my-courses')}
                        className={`${baseClasses} ${currentView === 'my-courses' ? activeClasses : inactiveClasses}`}>
                        Mis Cursos
                    </button>
                </nav>

                <div className="flex items-center space-x-4">
                    <span className="text-gray-700 hidden sm:block">¡Hola, {docenteName.split(' ')[0]}!</span>
                    <button 
                        onClick={onLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                        Salir
                    </button>
                </div>
            </div>
             <nav className="md:hidden bg-gray-50 px-4 pt-2 pb-3 space-y-1 sm:px-3">
                 <button onClick={() => setView('courses')} className={`block w-full text-left ${baseClasses} ${currentView === 'courses' ? activeClasses : inactiveClasses}`}>Ver Cursos</button>
                 <button onClick={() => setView('my-courses')} className={`block w-full text-left ${baseClasses} ${currentView === 'my-courses' ? activeClasses : inactiveClasses}`}>Mis Cursos</button>
            </nav>
        </header>
    );
};

export default Navbar;
