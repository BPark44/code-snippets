import React, { useCallback, useEffect, useState } from "react";

interface MediaItem {
    id: string;
    url: string;
    filename: string;
    mimetype: string;
    size: number;
    created_at: string;
}

interface MediaResponse {
    data: MediaItem[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

type Props = {
    onMediaSelect: (url: string) => void;
    selectedUrl?: string;
    accept?: Partial<{
        "image/*": string[];
        "video/*": string[];
    }>;
};

export const MediaGallery = ({
    onMediaSelect,
    selectedUrl,
    accept = {
        "image/*": [".jpg", ".jpeg", ".png"],
        "video/*": [".mp4", ".mov"],
    },
}: Props) => {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchMedia = useCallback(async (pageNum: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/media?page=${pageNum}&limit=20`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch media");
            }

            const result: MediaResponse = await response.json();
            setMedia(result.data);
            setTotalPages(result.meta.totalPages);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load media"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMedia(page);
    }, [fetchMedia, page]);

    const isAcceptedFile = (mimetype: string) => {
        if (accept["image/*"] && mimetype.startsWith("image/")) return true;
        if (accept["video/*"] && mimetype.startsWith("video/")) return true;
        return false;
    };

    const filteredMedia = media.filter((item) => isAcceptedFile(item.mimetype));

    const handleMediaClick = (url: string) => {
        onMediaSelect(url);
    };

    const renderMediaItem = (item: MediaItem) => {
        const isSelected = selectedUrl === item.url;
        const isImage = item.mimetype.startsWith("image/");
        const isVideo = item.mimetype.startsWith("video/");

        return (
            <div
                key={item.id}
                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                    isSelected
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleMediaClick(item.url)}
            >
                {isImage && (
                    <img
                        src={item.url}
                        alt={item.filename}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                )}

                {isVideo && (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center relative">
                        <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white bg-black bg-opacity-50 rounded px-2 py-1 text-xs">
                                Video
                            </span>
                        </div>
                    </div>
                )}

                {isSelected && (
                    <div className="absolute top-2 right-2">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            ✓
                        </span>
                    </div>
                )}
            </div>
        );
    };

    if (loading && media.length === 0) {
        return (
            <div className="w-full">
                <div className="flex items-center justify-center py-12">
                    <span className="text-gray-500">Loading media...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full">
                <div className="text-center py-12">
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                    <button
                        onClick={() => fetchMedia(page)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (filteredMedia.length === 0) {
        return (
            <div className="w-full">
                <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">
                        No media files found
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMedia.map(renderMediaItem)}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setPage((prev) => Math.min(totalPages, prev + 1))
                        }
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};
