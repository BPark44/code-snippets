import formidable from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

// Simple upload URL - Get your URL from your IttyBit dashboard
// https://ittybit.com/guides/simple-uploads
const API_URL = "https://https://you.ittybit.net";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const form = formidable();
        const [fields, files] = await form.parse(req);
        const file = files.file?.[0];
        const folder = fields.folder?.[0] || "uploads";

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Generate a safe filename
        const safeFileName = encodeURIComponent(
            file.originalFilename?.toLowerCase().replace(/[^a-z0-9.]/g, "-") ||
                "file"
        );
        const uploadPath = `${folder}/${safeFileName}`;

        // Read the file
        const fileData = fs.readFileSync(file.filepath);

        console.log("Uploading to IttyBit:", {
            path: uploadPath,
            size: fileData.length,
            hasApiKey: !!process.env.ITTYBIT_API_KEY,
        });

        // Upload to IttyBit
        const response = await fetch(`${API_URL}/${uploadPath}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${process.env.ITTYBIT_API_KEY}`,
                "Content-Type": file.mimetype || "application/octet-stream",
            },
            body: fileData,
        });

        // Clean up the temporary file
        fs.unlinkSync(file.filepath);

        if (!response.ok) {
            const errorData = await response.json();

            console.error("IttyBit API Error:", {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                error: errorData,
            });
            throw new Error(
                errorData.message ||
                    `Failed to upload to IttyBit: ${response.status} ${response.statusText}`
            );
        }

        const { meta, data, error } = await response.json();

        console.log("IttyBit upload success:", data);
        return res.status(201).json({ meta, data, error });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to upload file",
            details: error instanceof Error ? error.stack : undefined,
        });
    }
}
