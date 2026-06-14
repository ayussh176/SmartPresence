import React, { useState, useRef, useEffect } from 'react';
import { UploadImage } from '../components/UploadImage';
import { attendanceService } from '../services/api';
import { toast } from 'sonner';
import { Camera, CheckCircle2, ScanFace } from 'lucide-react';

export const AttendanceCapture = () => {
    const [selectedImage, setSelectedImage] = useState<{ file: File, url: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<any>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    // Draw bounding boxes when results are available
    useEffect(() => {
        if (!results || !results.details || !selectedImage || !imgRef.current || !canvasRef.current) return;

        const img = imgRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Wait for image to load to get dimensions
        const setupCanvas = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            results.details.forEach((det: any) => {
                const { x, y, w, h } = det.bounding_box;
                const student = det.student_id;

                // Define colors based on recognition
                const color = student !== "Unknown" ? "#10b981" : "#f43f5e"; // Green or Red

                ctx.strokeStyle = color;
                ctx.lineWidth = Math.max(2, canvas.width * 0.005);
                ctx.strokeRect(x, y, w, h);

                // Background for text
                ctx.fillStyle = color;
                const text = `${student} (${(det.detection_confidence * 100).toFixed(0)}%)`;
                const textWidth = ctx.measureText(text).width;
                ctx.fillRect(x - 2, y - 24, textWidth + 8, 24);

                // Text
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 16px Inter, sans-serif";
                ctx.fillText(text, x + 2, y - 6);
            });
        };

        if (img.complete) { setupCanvas(); }
        else { img.onload = setupCanvas; }

    }, [results, selectedImage]);

    const handlePredict = async () => {
        if (!selectedImage) return;

        setIsProcessing(true);
        try {
            const res = await attendanceService.predictAttendance(selectedImage.file);
            setResults(res);
            toast.success(`Detected ${res.total_faces} faces, ${res.attendance.length} recognized.`);
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to process classroom image.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClear = () => {
        setSelectedImage(null);
        setResults(null);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8 select-none">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
                    <Camera className="w-8 h-8 text-indigo-500" />
                    Capture Attendance
                </h1>
                <p className="text-gray-500">Upload a classroom photo to detect faces and mark attendance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-6">
                        {!selectedImage ? (
                            <UploadImage
                                onImageSelect={(file, url) => {
                                    setSelectedImage({ file, url });
                                    setResults(null);
                                }}
                            />
                        ) : (
                            <div className="space-y-4">
                                <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex justify-center border border-gray-200 dark:border-gray-700 max-h-[600px]">
                                    <img
                                        ref={imgRef}
                                        src={selectedImage.url}
                                        alt="Classroom"
                                        className="max-w-full h-auto object-contain"
                                    />
                                    {results && (
                                        <canvas
                                            ref={canvasRef}
                                            className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
                                        />
                                    )}
                                    {isProcessing && (
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-all">
                                            <ScanFace className="w-16 h-16 text-white animate-pulse mb-4" />
                                            <h3 className="text-xl font-bold text-white tracking-widest uppercase">Analyzing Image</h3>
                                            <p className="text-white/80 mt-2">Running FaceNet embeddings...</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <button
                                        onClick={handlePredict}
                                        disabled={isProcessing || results}
                                        className={`px-8 py-3 rounded-xl font-medium shadow-md transition-all flex items-center justify-center gap-2 flex-1 ${isProcessing || results
                                                ? 'bg-indigo-400 text-white cursor-not-allowed'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg translate-y-[-1px]'
                                            }`}
                                    >
                                        <ScanFace className="w-5 h-5" />
                                        {isProcessing ? 'Processing Details...' : results ? 'Processed Successfully' : 'Analyze Classroom'}
                                    </button>
                                    <button
                                        onClick={handleClear}
                                        disabled={isProcessing}
                                        className="px-6 py-3 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                                    >
                                        Clear & Upload New
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-lg h-full max-h-[800px] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            Results Summary
                        </h3>

                        {results ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl text-center">
                                        <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-1">Total Faces</p>
                                        <p className="text-3xl font-black text-indigo-700 dark:text-indigo-300">{results.total_faces}</p>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center">
                                        <p className="text-green-600 dark:text-green-400 text-sm font-semibold uppercase tracking-wider mb-1">Recognized</p>
                                        <p className="text-3xl font-black text-green-700 dark:text-green-300">{results.attendance.length}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-2">Identified Students</h4>
                                    {results.attendance.length > 0 ? (
                                        <ul className="space-y-2">
                                            {results.attendance.map((id: string, i: number) => (
                                                <li key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                    <span className="font-medium">{id}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 italic text-sm">No students matched our records.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                                <ScanFace className="w-12 h-12 mb-3 opacity-20" />
                                <p>Upload an image and run analysis to see results.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
