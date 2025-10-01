import React from 'react';

interface StepperProps {
    currentStep: number;
    steps: string[];
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-start">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center w-1/4">
                            <div className="relative flex items-center justify-center">
                                <div className={`w-10 h-10 flex items-center justify-center z-10 rounded-full font-semibold text-white ${index < currentStep - 1 ? 'bg-rose-800' : 'bg-gray-300'} ${index === currentStep - 1 && 'ring-4 ring-rose-300'}`}>
                                    {index + 1}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`absolute w-full top-1/2 -translate-y-1/2 left-1/2 h-1 ${index < currentStep - 1 ? 'bg-rose-800' : 'bg-gray-300'}`} />
                                )}
                            </div>
                            <div className="mt-2 text-center">
                                <p className={`text-sm font-medium ${index < currentStep - 1 ? 'text-rose-800' : 'text-gray-500'}`}>
                                    {step}
                                </p>
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Stepper;