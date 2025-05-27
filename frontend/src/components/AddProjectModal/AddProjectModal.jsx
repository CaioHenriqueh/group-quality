import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Edit3, Move, RotateCw, ZoomIn, ZoomOut, Crop, X, Check, Download } from 'lucide-react';
import "./AddProjectModal.css";

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
        crop: { x: 100, y: 100, width: 200, height: 200 },
        scale: 1,
        rotation: 0,
        isDragging: false,
        dragStart: { x: 0, y: 0 },
        imagePosition: { x: 0, y: 0 },
        cropMode: false
    });

    const [dragOver, setDragOver] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef(null);
    const editorCanvasRef = useRef(null);
    const fileInputRef = useRef(null);

    // Optimized canvas rendering with requestAnimationFrame
    const drawImageToCanvas = useCallback(() => {
        if (!editorCanvasRef.current || !imageEditor.originalImage) return;

        const canvas = editorCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = imageEditor.originalImage;

        // Dynamic canvas size based on container
        const containerWidth = canvas.parentElement?.clientWidth || 400;
        canvas.width = Math.min(600, containerWidth);
        canvas.height = canvas.width;

        ctx.fillStyle = 'var(--bg-color)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(imageEditor.scale, imageEditor.scale);
        ctx.rotate((imageEditor.rotation * Math.PI) / 180);

        const aspectRatio = img.width / img.height;
        let drawWidth = canvas.width * 0.75;
        let drawHeight = drawWidth / aspectRatio;

        if (aspectRatio < 1) {
            drawHeight = canvas.width * 0.75;
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

        if (imageEditor.cropMode) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillRect(
                imageEditor.crop.x,
                imageEditor.crop.y,
                imageEditor.crop.width,
                imageEditor.crop.height
            );

            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = 'var(--primary-color)';
            ctx.lineWidth = 3;
            ctx.strokeRect(
                imageEditor.crop.x,
                imageEditor.crop.y,
                imageEditor.crop.width,
                imageEditor.crop.height
            );

            const cornerSize = 10;
            ctx.fillStyle = 'var(--primary-color)';
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
        let animationFrameId;
        const render = () => {
            drawImageToCanvas();
            animationFrameId = requestAnimationFrame(render);
        };
        animationFrameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrameId);
    }, [drawImageToCanvas]);

    const handleImageLoad = (file) => {
        setIsLoading(true);
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
                setIsLoading(false);
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

        setIsLoading(true);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = imageEditor.crop.width;
        canvas.height = imageEditor.crop.height;

        ctx.drawImage(
            editorCanvasRef.current,
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
        setIsLoading(false);
    };

    const saveEdits = () => {
        if (!editorCanvasRef.current) return;

        setIsLoading(true);
        const canvas = editorCanvasRef.current;
        const editedImage = canvas.toDataURL('image/jpeg', 0.9);
        
        setProjectData(prev => ({
            ...prev,
            previewImage: editedImage,
            image: editedImage
        }));

        setImageEditor(prev => ({ ...prev, isOpen: false }));
        setIsLoading(false);
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
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-glow-effect" />
                
                <button
                    onClick={onClose}
                    className="close-btn"
                    title="Close"
                >
                    <X />
                </button>

                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
                    </div>
                )}

                {imageEditor.isOpen ? (
                    <div className="image-editor-container">
                        <div className="modal-header">
                            <h2>Edit Your Image</h2>
                            <p>Fine-tune your project image with precision</p>
                        </div>

                        <div className="react-crop">
                            <canvas
                                ref={editorCanvasRef}
                                className="w-full"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button
                                onClick={() => adjustScale(0.1)}
                                className="flex items-center justify-center gap-2 p-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900 rounded-lg transition-all duration-200"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-4 h-4" />
                                <span className="text-sm font-medium">Zoom+</span>
                            </button>
                            <button
                                onClick={() => adjustScale(-0.1)}
                                className="flex items-center justify-center gap-2 p-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900 rounded-lg transition-all duration-200"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Zoom-</span>
                            </button>
                            <button
                                onClick={() => adjustRotation(90)}
                                className="flex items-center justify-center gap-2 p-3 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 dark:hover:bg-purple-900 rounded-lg transition-all duration-200"
                                title="Rotate 90°"
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
                                title={imageEditor.cropMode ? 'Exit Crop Mode' : 'Enter Crop Mode'}
                            >
                                <Crop className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {imageEditor.cropMode ? 'Exit Crop' : 'Crop'}
                                </span>
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
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

                        <div className="crop-actions">
                            <button
                                onClick={downloadImage}
                                className="cancel-btn"
                                title="Download Image"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                            {imageEditor.cropMode ? (
                                <button
                                    onClick={applyCrop}
                                    className="save-crop-btn"
                                    title="Apply Crop"
                                >
                                    <Crop className="w-4 h-4" />
                                    Apply Crop
                                </button>
                            ) : (
                                <button
                                    onClick={saveEdits}
                                    className="save-crop-btn"
                                    title="Save Edits"
                                >
                                    <Check className="w-4 h-4" />
                                    Save Edits
                                </button>
                            )}
                            <button
                                onClick={() => setImageEditor(prev => ({ ...prev, isOpen: false }))}
                                className="cancel-btn"
                                title="Cancel"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="modal-header">
                            <h2>Create Epic Project</h2>
                            <p>Build something extraordinary</p>
                        </div>

                        <div
                            className={`image-upload ${dragOver ? 'dragging' : ''}`}
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
                                <div className="image-preview-container">
                                    <img
                                        src={projectData.previewImage}
                                        alt="Project preview"
                                        className="image-preview"
                                    />
                                    <div className="image-hover-overlay">
                                        <Edit3 className="w-8 h-8 mb-2" />
                                        <span className="text-sm font-medium">Edit Image</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="image-upload-placeholder">
                                    <Upload className="w-12 h-12" />
                                    <p>{dragOver ? 'Drop image here!' : 'Click or drag image'}</p>
                                    <small>Supports JPG, PNG, up to 5MB</small>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Project Name *</label>
                            <input
                                type="text"
                                value={projectData.name}
                                onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="My Epic Project"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={projectData.description}
                                onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe your amazing project..."
                                rows={4}
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={onClose}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="submit-btn"
                                disabled={!projectData.name.trim()}
                            >
                                <Check className="w-4 h-4" />
                                Create Project
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddProjectModal;