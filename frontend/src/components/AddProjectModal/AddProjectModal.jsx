import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Edit3, Move, RotateCw, ZoomIn, ZoomOut, Crop, X, Check, Download } from 'lucide-react';
import "./AddProjectModal.css"

const AddProjectModal = ({ onClose, onSave }) => {
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        image: null,
        previewImage: null
    });

    const [imageEditor, setImageEditor] = useState({
        isOpen: false,
        originalImage: null,
        editedImage: null,
        crop: { x: 0, y: 0, width: 200, height: 200 },
        scale: 1,
        rotation: 0,
        isDragging: false,
        dragStart: { x: 0, y: 0 },
        imagePosition: { x: 0, y: 0 },
        cropMode: false
    });

    const [dragOver, setDragOver] = useState(false);
    const canvasRef = useRef(null);
    const editorCanvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    // Função para desenhar a imagem no canvas do editor
    const drawImageToCanvas = useCallback(() => {
        if (!editorCanvasRef.current || !imageEditor.originalImage) return;

        const canvas = editorCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = imageEditor.originalImage;

        canvas.width = 400;
        canvas.height = 400;

        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(imageEditor.scale, imageEditor.scale);
        ctx.rotate((imageEditor.rotation * Math.PI) / 180);

        const aspectRatio = img.width / img.height;
        let drawWidth = 300;
        let drawHeight = 300;

        if (aspectRatio > 1) {
            drawHeight = drawWidth / aspectRatio;
        } else {
            drawWidth = drawHeight * aspectRatio;
        }

        ctx.drawImage(
            img,
            -drawWidth / 2 + imageEditor.imagePosition.x,
            -drawHeight / 2 + imageEditor.imagePosition.y,
            drawWidth,
            drawHeight
        );

        ctx.restore();

        // Desenhar área de crop se estiver no modo crop
        if (imageEditor.cropMode) {
            // Overlay escuro
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Área de crop transparente
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillRect(
                imageEditor.crop.x,
                imageEditor.crop.y,
                imageEditor.crop.width,
                imageEditor.crop.height
            );

            // Borda da área de crop
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = '#4facfe';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                imageEditor.crop.x,
                imageEditor.crop.y,
                imageEditor.crop.width,
                imageEditor.crop.height
            );

            // Cantos da área de crop
            const cornerSize = 8;
            ctx.fillStyle = '#4facfe';
            const corners = [
                [imageEditor.crop.x, imageEditor.crop.y],
                [imageEditor.crop.x + imageEditor.crop.width, imageEditor.crop.y],
                [imageEditor.crop.x, imageEditor.crop.y + imageEditor.crop.height],
                [imageEditor.crop.x + imageEditor.crop.width, imageEditor.crop.y + imageEditor.crop.height]
            ];

            corners.forEach(([x, y]) => {
                ctx.fillRect(x - cornerSize / 2, y - cornerSize / 2, cornerSize, cornerSize);
            });
        }
    }, [imageEditor]);

    useEffect(() => {
        drawImageToCanvas();
    }, [drawImageToCanvas]);

    const handleImageLoad = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setImageEditor(prev => ({
                    ...prev,
                    isOpen: true,
                    originalImage: img,
                    imagePosition: { x: 0, y: 0 },
                    scale: 1,
                    rotation: 0,
                    crop: { x: 100, y: 100, width: 200, height: 200 }
                }));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleImageLoad(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageLoad(file);
        }
    };

    const handleMouseDown = (e) => {
        if (!imageEditor.cropMode) {
            const rect = editorCanvasRef.current.getBoundingClientRect();
            setImageEditor(prev => ({
                ...prev,
                isDragging: true,
                dragStart: { 
                    x: e.clientX - rect.left - prev.imagePosition.x, 
                    y: e.clientY - rect.top - prev.imagePosition.y 
                }
            }));
        }
    };

    const handleMouseMove = (e) => {
        if (imageEditor.isDragging && !imageEditor.cropMode) {
            const rect = editorCanvasRef.current.getBoundingClientRect();
            setImageEditor(prev => ({
                ...prev,
                imagePosition: {
                    x: e.clientX - rect.left - prev.dragStart.x,
                    y: e.clientY - rect.top - prev.dragStart.y
                }
            }));
        }
    };

    const handleMouseUp = () => {
        setImageEditor(prev => ({ ...prev, isDragging: false }));
    };

    const adjustScale = (delta) => {
        setImageEditor(prev => ({
            ...prev,
            scale: Math.max(0.1, Math.min(3, prev.scale + delta))
        }));
    };

    const adjustRotation = (delta) => {
        setImageEditor(prev => ({
            ...prev,
            rotation: (prev.rotation + delta) % 360
        }));
    };

    const toggleCropMode = () => {
        setImageEditor(prev => ({ ...prev, cropMode: !prev.cropMode }));
    };

    const applyCrop = () => {
        if (!editorCanvasRef.current || !imageEditor.originalImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = imageEditor.crop.width;
        canvas.height = imageEditor.crop.height;

        // Capturar apenas a área de crop
        const sourceCanvas = editorCanvasRef.current;
        ctx.drawImage(
            sourceCanvas,
            imageEditor.crop.x, imageEditor.crop.y,
            imageEditor.crop.width, imageEditor.crop.height,
            0, 0,
            imageEditor.crop.width, imageEditor.crop.height
        );

        const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
        
        setProjectData(prev => ({
            ...prev,
            previewImage: croppedImage,
            image: croppedImage
        }));

        setImageEditor(prev => ({
            ...prev,
            isOpen: false,
            cropMode: false
        }));
    };

    const saveEdits = () => {
        if (!editorCanvasRef.current) return;

        const canvas = editorCanvasRef.current;
        const editedImage = canvas.toDataURL('image/jpeg', 0.9);
        
        setProjectData(prev => ({
            ...prev,
            previewImage: editedImage,
            image: editedImage
        }));

        setImageEditor(prev => ({ ...prev, isOpen: false }));
    };

    const downloadImage = () => {
        if (!editorCanvasRef.current) return;
        
        const link = document.createElement('a');
        link.download = 'edited-image.jpg';
        link.href = editorCanvasRef.current.toDataURL('image/jpeg', 0.9);
        link.click();
    };

    const handleSubmit = () => {
        if (!projectData.name.trim()) return;
        
        onSave({
            name: projectData.name,
            description: projectData.description,
            image: projectData.previewImage || `https://picsum.photos/300/300?random=${Date.now()}`
        });
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="relative bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl border border-white/20">
                
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-20 animate-pulse"></div>
                
                <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-8">
                    
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:rotate-90"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {imageEditor.isOpen ? (
                        /* Image Editor */
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Advanced Image Editor
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Transform your image with professional tools
                                </p>
                            </div>

                            {/* Editor Canvas */}
                            <div className="flex justify-center">
                                <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-blue-200 dark:border-blue-800">
                                    <canvas
                                        ref={editorCanvasRef}
                                        width={400}
                                        height={400}
                                        className="cursor-move"
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                        onMouseLeave={handleMouseUp}
                                    />
                                </div>
                            </div>

                            {/* Editor Controls */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button
                                    onClick={() => adjustScale(0.1)}
                                    className="flex items-center justify-center gap-2 p-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900 rounded-lg transition-all duration-200"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                    <span className="text-sm font-medium">Zoom+</span>
                                </button>
                                
                                <button
                                    onClick={() => adjustScale(-0.1)}
                                    className="flex items-center justify-center gap-2 p-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900 rounded-lg transition-all duration-200"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                    <span className="text-sm font-medium">Zoom-</span>
                                </button>
                                
                                <button
                                    onClick={() => adjustRotation(90)}
                                    className="flex items-center justify-center gap-2 p-3 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 dark:hover:bg-purple-900 rounded-lg transition-all duration-200"
                                >
                                    <RotateCw className="w-4 h-4" />
                                    <span className="text-sm font-medium">Rotate</span>
                                </button>
                                
                                <button
                                    onClick={toggleCropMode}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                                        imageEditor.cropMode 
                                            ? 'bg-green-200 hover:bg-green-300 dark:bg-green-900/50 dark:hover:bg-green-900' 
                                            : 'bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-900'
                                    }`}
                                >
                                    <Crop className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {imageEditor.cropMode ? 'Exit Crop' : 'Crop'}
                                    </span>
                                </button>
                            </div>

                            {/* Advanced Controls */}
                            <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="text-gray-600 dark:text-gray-400 text-sm">Scale:</span>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    value={imageEditor.scale}
                                    onChange={(e) => setImageEditor(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                                    className="flex-1 mx-4"
                                />
                                <span className="text-sm font-mono w-12 text-center">
                                    {imageEditor.scale.toFixed(1)}x
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={downloadImage}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                                
                                {imageEditor.cropMode ? (
                                    <button
                                        onClick={applyCrop}
                                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <Crop className="w-4 h-4" />
                                        Apply Crop
                                    </button>
                                ) : (
                                    <button
                                        onClick={saveEdits}
                                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <Check className="w-4 h-4" />
                                        Save Edits
                                    </button>
                                )}

                                <button
                                    onClick={() => setImageEditor(prev => ({ ...prev, isOpen: false }))}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900 text-red-700 dark:text-red-300 rounded-lg transition-all duration-200"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Project Form */
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Create Epic Project
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Let's build something amazing together
                                </p>
                            </div>

                            {/* Image Upload Area */}
                            <div className="flex justify-center">
                                <div
                                    className={`relative group cursor-pointer transition-all duration-300 ${
                                        dragOver ? 'scale-105' : 'hover:scale-102'
                                    }`}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />

                                    {projectData.previewImage ? (
                                        <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                                            <img
                                                src={projectData.previewImage}
                                                alt="Project preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="text-white text-center">
                                                    <Edit3 className="w-8 h-8 mx-auto mb-2" />
                                                    <span className="text-sm font-medium">Edit Image</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`w-64 h-40 border-3 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                                            dragOver 
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' 
                                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                                        }`}>
                                            <div className="relative">
                                                <Upload className="w-12 h-12 text-gray-400 mb-4 mx-auto" />
                                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
                                                    <span className="text-white text-xs font-bold">+</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                                                {dragOver ? 'Drop image here!' : 'Click or drag image'}
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-500 text-sm">
                                                Professional editing tools included
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Project Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={projectData.name}
                                        onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="My Epic Project"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={projectData.description}
                                        onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Describe your amazing project..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                                >
                                    Create Project ✨
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddProjectModal;