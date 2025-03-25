import React, { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const toastRef = useRef(null);

    const showToast = (severity, summary, detail) => {
        toastRef.current.show({ severity, summary, detail, life: 3000 });
    };

    return (
        <ToastContext.Provider value={showToast}>
            <Toast ref={toastRef} />
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
