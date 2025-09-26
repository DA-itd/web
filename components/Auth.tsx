import React, { useState, useEffect, useCallback } from 'react';
// FIX: Import the `auth` instance to be used with `signInWithEmailAndPassword`.
import { signInWithEmailAndPassword, registerTeacher, getDepartamentos, auth } from '../services/firebaseService';
import type { Departamento } from '../types';
import Spinner from './common/Spinner';
import Alert from './common/Alert';

const AuthView: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [curp, setCurp] = useState('');
    const [genero, setGenero] = useState<'Masculino' | 'Femenino' | 'Otro' | ''>('');
    const [departamentoId, setDepartamentoId] = useState('');
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchDepartamentos = useCallback(async () => {
        try {
            const deps = await getDepartamentos();
            setDepartamentos(deps);
        } catch (err) {
            setError('No se pudieron cargar los departamentos.');
        }
    }, []);

    useEffect(() => {
        if (!isLoginView) {
            fetchDepartamentos();
        }
    }, [isLoginView, fetchDepartamentos]);

    const validateDomain = (email: string) => {
        const allowedDomains = ['@itdurango.edu.mx', '@gmail.com'];
        return allowedDomains.some(domain => email.endsWith(domain));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateDomain(email)) {
            setError('Solo se permiten correos con dominio @itdurango.edu.mx o @gmail.com.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            // FIX: The `signInWithEmailAndPassword` function requires the `auth` instance as the first argument.
            await signInWithEmailAndPassword(auth, email, password);
            // El listener de onAuthStateChanged en App.tsx se encargará de la redirección
        } catch (err) {
            setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateDomain(email)) {
            setError('Solo se permiten correos con dominio @itdurango.edu.mx o @gmail.com.');
            return;
        }
        if (!nombreCompleto || !curp || !genero || !departamentoId) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const docenteData = { nombreCompleto, curp, email, genero: genero as 'Masculino' | 'Femenino' | 'Otro', departamentoId };
            await registerTeacher(docenteData);
            setSuccess(`Registro exitoso. Se ha creado una contraseña temporal: ${curp.substring(0, 4)}${new Date().getFullYear()}. Por favor, inicia sesión.`);
            setIsLoginView(true); // Cambia a la vista de login
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error inesperado durante el registro.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {isLoginView ? 'Iniciar Sesión' : 'Registro de Docente'}
                </h2>
                
                {error && <div className="mb-4"><Alert message={error} type="error" onClose={() => setError('')} /></div>}
                {success && <div className="mb-4"><Alert message={success} type="success" onClose={() => setSuccess('')} /></div>}

                <form onSubmit={isLoginView ? handleLogin : handleRegister}>
                    {/* Campos comunes */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {isLoginView ? (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    ) : (
                        <>
                            {/* Campos solo para registro */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreCompleto">
                                    Nombre Completo
                                </label>
                                <input id="nombreCompleto" type="text" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="curp">
                                    CURP
                                </label>
                                <input id="curp" type="text" value={curp} onChange={(e) => setCurp(e.target.value.toUpperCase())} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genero">
                                    Género
                                </label>
                                <select id="genero" value={genero} onChange={(e) => setGenero(e.target.value as any)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                    <option value="" disabled>Seleccione...</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="departamento">
                                    Departamento
                                </label>
                                <select id="departamento" value={departamentoId} onChange={(e) => setDepartamentoId(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                    <option value="" disabled>Seleccione...</option>
                                    {departamentos.map(dep => <option key={dep.id} value={dep.id}>{dep.nombre}</option>)}
                                </select>
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors w-full flex items-center justify-center disabled:bg-blue-300"
                        >
                            {loading ? <Spinner /> : (isLoginView ? 'Entrar' : 'Registrarme')}
                        </button>
                    </div>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                    {isLoginView ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}
                    <button
                        onClick={() => { setIsLoginView(!isLoginView); setError(''); setSuccess(''); }}
                        className="font-bold text-blue-600 hover:text-blue-800 ml-1"
                    >
                        {isLoginView ? 'Regístrate' : 'Inicia Sesión'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthView;