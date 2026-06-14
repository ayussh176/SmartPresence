import React, { useCallback, useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';

interface UploadImageProps {
    onImageSelect: (file: File, previewUrl: string) => void;
    isLoading?: boolean;
}

export const UploadImage: React.FC<UploadImageProps> = ({ onImageSelect, isLoading }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;

        const url = URL.createObjectURL(file);
        setPreview(url);
        onImageSelect(file, url);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const clearImage = () => {
        setPreview(null);
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            {!preview ? (
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex flex-col items-center justify-center min-h-[300px]"
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                        id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                        <UploadCloud className="w-12 h-12 text-blue-500 mb-4" />
                        <p className="text-lg font-medium mb-1">Click to upload or drag & drop</p>
                        <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 10MB)</p>
                    </label>
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
                    <img src={preview} alt="Preview" className="w-full h-auto object-cover max-h-[500px]" />

                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                            onClick={clearImage}
                            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                            disabled={isLoading}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {isLoading && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <div className="flex flex-col items-center text-white">
                                <Loader2 className="w-10 h-10 animate-spin mb-3" />
                                <p className="font-medium">Processing Model Inference...</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
