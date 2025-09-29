import { useState } from 'react';
import { Loader2, Download, Users, Trash2 } from 'lucide-react';
import { useLocalRegistrations } from '@/react-app/hooks/useLocalStorage';
import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';

export default function Admin() {
  const { registrations, clearRegistrations } = useLocalRegistrations();
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const handleClearData = () => {
    if (confirm('¿Estás seguro de que quieres borrar todos los registros? Esta acción no se puede deshacer.')) {
      clearRegistrations();
      alert('Todos los registros han sido eliminados');
    }
  };

  const downloadCSV = () => {
    if (registrations.length === 0) return;

    const csvContent = [
      'ID,NOMBRE,CURP,EMAIL,DEPARTAMENTO,GENERO,CURSOS,FECHA',
      ...registrations.map(reg => {
        const cursosText = reg.cursos.map(curso => curso.nombre_curso).join('; ');
        const fecha = new Date(reg.created_at).toLocaleDateString('es-MX');
        
        return `${reg.id},"${reg.nombre_completo}","${reg.curp}","${reg.email}","${reg.departamento_seleccionado}","${reg.genero}","${cursosText}","${fecha}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inscripciones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-lg text-gray-600">Cargando registros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="text-red-600 text-lg">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-gray-600">Registros históricos locales</p>
                <p className="text-sm text-amber-600">
                  ⚠️ Los nuevos registros se envían a Google Sheets
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={downloadCSV}
                disabled={registrations.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Descargar CSV</span>
              </button>
              <button
                onClick={handleClearData}
                disabled={registrations.length === 0}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpiar Datos</span>
              </button>
            </div>
          </div>

          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-amber-600">ℹ️</span>
              <h3 className="font-semibold text-amber-800">Importante</h3>
            </div>
            <p className="text-sm text-amber-700 mb-3">
              Estos son registros históricos guardados localmente. Los nuevos registros se envían automáticamente a Google Sheets.
              Para ver todas las inscripciones actuales, revisa tu Google Sheet configurado.
            </p>
          </div>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{registrations.length}</div>
                <div className="text-sm text-gray-600">Registros Locales</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {registrations.reduce((total, reg) => total + reg.cursos.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total de Cursos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {registrations.length > 0 ? 
                    (registrations.reduce((total, reg) => total + reg.cursos.length, 0) / registrations.length).toFixed(1) : 
                    '0'}
                </div>
                <div className="text-sm text-gray-600">Promedio Cursos/Persona</div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">ID</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">NOMBRE</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">CURP</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">EMAIL</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">DEPARTAMENTO</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">GÉNERO</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">CURSOS</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">FECHA</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      <div className="space-y-2">
                        <p>No hay registros locales disponibles</p>
                        <p className="text-sm">Las nuevas inscripciones se guardan en Google Sheets</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  registrations.map((registration, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">{registration.id}</td>
                      <td className="border border-gray-300 px-4 py-3 font-medium">{registration.nombre_completo}</td>
                      <td className="border border-gray-300 px-4 py-3 font-mono text-sm">{registration.curp}</td>
                      <td className="border border-gray-300 px-4 py-3">{registration.email}</td>
                      <td className="border border-gray-300 px-4 py-3">{registration.departamento_seleccionado}</td>
                      <td className="border border-gray-300 px-4 py-3">{registration.genero}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="space-y-1">
                          {registration.cursos.map((curso, courseIndex) => (
                            <div key={courseIndex} className="text-sm">
                              <div className="font-medium text-blue-800">{curso.nombre_curso}</div>
                              <div className="text-gray-600 text-xs">{curso.fecha_visible} - {curso.lugar}</div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        {new Date(registration.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
