import type { CursoType } from '@/shared/types';

interface CourseCardProps {
  curso: CursoType;
  isSelected: boolean;
  onToggle: (cursoId: string) => void;
  disabled?: boolean;
  simplified?: boolean;
}

export default function CourseCard({ curso, isSelected, onToggle, disabled = false, simplified = false }: CourseCardProps) {
  const periodColors = {
    PERIODO_1: 'bg-blue-100 border-blue-300 text-blue-800',
    PERIODO_2: 'bg-green-100 border-green-300 text-green-800',
  };

  const selectedColors = {
    PERIODO_1: 'bg-blue-500 border-blue-600 text-white',
    PERIODO_2: 'bg-green-500 border-green-600 text-white',
  };

  const baseColor = periodColors[curso.Periodo as keyof typeof periodColors] || 'bg-gray-100 border-gray-300 text-gray-800';
  const selectedColor = selectedColors[curso.Periodo as keyof typeof selectedColors] || 'bg-gray-500 border-gray-600 text-white';

  return (
    <div
      className={`
        p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
        ${isSelected ? selectedColor : baseColor}
      `}
      onClick={() => !disabled && onToggle(curso.Id_Curso)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-semibold ${simplified ? 'text-sm' : 'text-base'}`}>{curso.Nombre_curso}</h3>
        <div className={`
          w-5 h-5 rounded border-2 flex items-center justify-center
          ${isSelected ? 'border-white bg-white' : 'border-current'}
        `}>
          {isSelected && (
            <svg className="w-3 h-3 text-current" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      
      {simplified ? (
        <div className="text-xs">
          <p><span className="font-medium">Fechas:</span> {curso.FechaVisible}</p>
        </div>
      ) : (
        <div className="space-y-0.5 text-xs">
          <p><span className="font-medium">Horario:</span> {curso.Horario}</p>
          <p><span className="font-medium">Periodo:</span> {curso.Periodo.replace('_', ' ')}</p>
          <p><span className="font-medium">Fechas:</span> {curso.FechaVisible}</p>
          <p><span className="font-medium">Lugar:</span> {curso.Lugar}</p>
          <p><span className="font-medium">Tipo:</span> {curso.Tipo}</p>
          <p><span className="font-medium">Horas:</span> {curso.Horas}</p>
        </div>
      )}
    </div>
  );
}
