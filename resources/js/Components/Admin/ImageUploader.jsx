import { useRef } from "react";
import { GripVertical, ImagePlus, X } from "lucide-react";

export default function ImageUploader({ images, onChange }) {
    const inputRef = useRef(null);
    const dragIndex = useRef(null);

    const addFiles = (fileList) => {
        const files = Array.from(fileList).map((file) => ({
            key: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            type: "new",
            file,
            url: URL.createObjectURL(file),
        }));
        onChange([...images, ...files]);
    };

    const removeAt = (key) => {
        const target = images.find((img) => img.key === key);
        if (target?.type === "new") URL.revokeObjectURL(target.url);
        onChange(images.filter((img) => img.key !== key));
    };

    const handleDrop = (index) => {
        if (dragIndex.current === null || dragIndex.current === index) return;
        const next = [...images];
        const [moved] = next.splice(dragIndex.current, 1);
        next.splice(index, 0, moved);
        dragIndex.current = null;
        onChange(next);
    };

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium tracking-wide text-front-muted uppercase">
                    Images
                </p>
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex items-center gap-1 text-xs font-medium text-front-accent hover:underline"
                >
                    <ImagePlus size={13} />
                    Add images
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files?.length) addFiles(e.target.files);
                        e.target.value = "";
                    }}
                />
            </div>

            {images.length === 0 ? (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-front-line py-8 text-front-muted hover:border-front-accent hover:text-front-accent"
                >
                    <ImagePlus size={20} />
                    <span className="text-xs">Click to upload, or drag images here</span>
                </button>
            ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {images.map((img, index) => (
                        <div
                            key={img.key}
                            draggable
                            onDragStart={() => (dragIndex.current = index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(index)}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-front-line"
                        >
                            <img src={img.url} alt="" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 flex items-start justify-between bg-front-bg/0 p-1.5 opacity-0 transition-opacity group-hover:bg-front-bg/40 group-hover:opacity-100">
                                <span className="cursor-grab rounded bg-front-surface/90 p-1 text-front-muted">
                                    <GripVertical size={12} />
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeAt(img.key)}
                                    aria-label="Remove image"
                                    className="rounded bg-front-surface/90 p-1 text-front-muted hover:text-red-400"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                            {index === 0 && (
                                <span className="absolute bottom-1 left-1 rounded bg-front-accent px-1.5 py-0.5 text-[0.6rem] font-medium text-front-accent-ink">
                                    Cover
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
