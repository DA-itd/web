
import React from 'react';

interface StepperProps {
    currentStep: number;
}

const steps = [
    { number: 1, title: 'Información Personal' },
    { number: 2, title: 'Selección de Cursos' },
    { number: 3, title: 'Confirmación' },
    { number: 4, title: 'Registro Completo' }
];

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
    return (
        <div className="w-full py-4 px-2 md:px-8 mb-8">
            <div className="flex items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center text-center">
                            <div
                                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300
                                ${currentStep >= step.number ? 'bg-red-700 text-white' : 'bg-gray-300 text-gray-600'}
                                ${currentStep === step.number ? 'ring-4 ring-red-300' : ''}`}
                            >
                                <span className="font-bold">{step.number}</span>
                            </div>
                            <p className={`mt-2 text-xs md:text-sm transition-colors duration-300 ${currentStep >= step.number ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                                {step.title}
                            </p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-auto border-t-2 transition-colors duration-300 mx-2
                                ${currentStep > step.number ? 'border-red-700' : 'border-gray-300'}`}
                            ></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Stepper;
