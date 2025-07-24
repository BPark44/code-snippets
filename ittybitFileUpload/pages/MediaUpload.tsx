import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
    onMediaSelect: (url: string) => void;
    accept?: Partial<{
        "image/*": string[];
        "video/*": string[];
    }>;
    maxSize?: number;
    aspectRatio?: "square" | "16:9";
    height?: string;
    folder?: string;
};

export const MediaUpload = ({
    onMediaSelect,
    accept = {
        "image/*": [".jpg", ".jpeg", ".png"],
        "video/*": [".mp4", ".mov"],
    },
    maxSize = 10 * 1024 * 1024,
    aspectRatio = "16:9",
    height,
    folder = "uploads",
}: Props) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadToIttyBit = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to upload file");
            }

            const { data } = await response.json();
            return data.url;
        } catch (err) {
            console.error("Upload error:", err);
            throw err;
        }
    };

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            setIsUploading(true);
            setError(null);

            try {
                const finalUrl = await uploadToIttyBit(file);
                onMediaSelect(finalUrl);
            } catch (err) {
                setError("Failed to upload file. Please try again.");
                setPreview(null);
            } finally {
                setIsUploading(false);
            }
        },
        [onMediaSelect, folder]
    );

    const handleRemove = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            setPreview(null);
            onMediaSelect("");
        },
        [onMediaSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple: false,
    });

    // Helper function to get accepted file types text
    const getAcceptedTypesText = () => {
        const types: string[] = [];
        if (accept["image/*"]) types.push(".jpg or .png");
        if (accept["video/*"]) types.push(".mp4 or .mov");
        return types.join(" | ");
    };

    const containerClassName = [
        "border-2 border-dashed rounded-lg text-center cursor-pointer",
        "transition-colors duration-200 ease-in-out",
        "bg-gray-50",
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
        isUploading ? "opacity-50 cursor-not-allowed" : "",
        aspectRatio === "16:9" && !height ? "aspect-video" : "",
        aspectRatio === "square" && !height ? "aspect-square" : "",
    ]
        .filter(Boolean)
        .join(" ");

    const containerStyle = height ? { height } : undefined;

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={containerClassName}
                style={containerStyle}
            >
                <input {...getInputProps()} disabled={isUploading} />

                {preview ? (
                    <div className="relative group h-full">
                        {preview.includes("video") ? (
                            <video
                                src={preview}
                                className="h-full w-full mx-auto object-contain"
                                controls
                            />
                        ) : (
                            <img
                                src={preview}
                                alt="Preview"
                                className={`h-full w-full mx-auto hover:opacity-50 transition-opacity duration-300 rounded-lg ${
                                    aspectRatio === "16:9"
                                        ? "object-contain"
                                        : "object-cover"
                                }`}
                            />
                        )}

                        {/* Hover overlay with remove button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors duration-300"
                                onClick={handleRemove}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                        <p className="text-gray-500 text-sm text-center">
                            Click to Upload Media
                        </p>

                        <p className="text-gray-400 text-xs text-center mt-1">
                            {getAcceptedTypesText()}
                        </p>
                    </div>
                )}

                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">
                            Uploading...
                        </span>
                    </div>
                )}

                {error && (
                    <p className="text-red-500 text-sm text-center mt-2">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};
