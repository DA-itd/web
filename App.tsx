import React from 'react';
import RegistrationForm from './components/RegistrationForm.tsx';
// FIX: Import the Toaster component from react-hot-toast to display notifications.
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      <header className="w-full max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold text-brand-dark">Sistema de Registro de Cursos</h1>
        <p className="text-lg text-gray-600 mt-2">Plataforma de actualización para docentes</p>
      </header>
      <main className="w-full">
        <RegistrationForm />
      </main>
      <footer className="w-full max-w-4xl mx-auto mt-8 text-center text-gray-500 text-sm">
        <p>&copy; 2024 Desarrollo Profesional Docente. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default App;