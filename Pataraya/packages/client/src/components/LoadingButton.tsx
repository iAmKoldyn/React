import React from "react";
import { twMerge } from "tailwind-merge";
import Spinner from "./Spinner";


// Button состоит из Spinner`a и текста
type LoadingButtonProps = {
    loading: boolean;
    btnColor?: string;
    textColor?: string;
    children: React.ReactNode;
};

// Компонент Spinner`a отоброжается когда загрузка true и request выполняется
export const LoadingButton: React.FC<LoadingButtonProps> = ({
    textColor = "text-white",
    btnColor = "bg-ct-blue-700",
    children,
    loading = false,
}) => {
    return (
        <button
            type="submit"
            className={twMerge(
                `w-full py-3 font-semibold ${btnColor} rounded-lg outline-none border-none flex justify-center`,
                `${loading && "bg-[#ccc]"}`
            )}
        >
            {loading ? (
                <div className="flex items-center gap-3">
                    <Spinner />
                    <span className="text-white inline-block">Загрузка...</span>
                </div>
            ) : (
                <span className={`text-lg font-normal ${textColor}`}>{children}</span>
            )}
        </button>
    );
};
