export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 bg-white rounded-lg p-1 w-fit">
            <img 
              src="https://raw.githubusercontent.com/DA-itd/web/main/logo_itdurango.png" 
              alt="Instituto Tecnológico de Durango" 
              className="h-10 w-auto"
            />
          </div>
          <div className="text-center flex-1 ml-6">
            <h1 className="text-base lg:text-lg font-bold leading-tight">
              SISTEMA DE INSCRIPCIÓN A CURSOS<br />
              DE ACTUALIZACIÓN DOCENTE
            </h1>
            <p className="text-xs mt-2 text-blue-200">
              INSTITUTO TECNOLÓGICO DE DURANGO
            </p>
          </div>
          <div className="w-16"></div> {/* Spacer for balance */}
        </div>
      </div>
    </header>
  );
}
