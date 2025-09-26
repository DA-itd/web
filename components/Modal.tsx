import React from 'react';
import { ModalInfo } from '../types';

interface ModalProps {
    modalInfo: ModalInfo;
    closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ modalInfo, closeModal }) => {
    if (!modalInfo.isOpen) return null;

    return (
        <div className={`modal fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${modalInfo.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm transform transition-all duration-300 ${modalInfo.isOpen ? 'scale-100' : 'scale-95'}`}>
                <h4 className="text-lg font-bold text-gray-800 mb-4">{modalInfo.title}</h4>
                <p className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: modalInfo.message }}></p>
                <div className="flex justify-end space-x-3">
                    {modalInfo.type === 'confirm' && (
                        <button
                            onClick={() => {
                                if (modalInfo.onCancel) modalInfo.onCancel(); // This is the "No, finalizar" action
                                closeModal();
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition duration-150"
                        >
                            No, finalizar registro
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (modalInfo.onConfirm) modalInfo.onConfirm(); // This is the "Aceptar" or "Sí, agregar" action
                            closeModal();
                        }}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-150"
                    >
                        {modalInfo.type === 'confirm' ? 'Sí, agregar otro' : 'Aceptar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;