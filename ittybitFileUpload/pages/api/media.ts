import { NextApiRequest, NextApiResponse } from "next";

// https://ittybit.com/api/media/list
const API_URL = "https://api.ittybit.com/media";

type QueryParams = {
    page?: string;
    limit?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { page: pageParam, limit: limitParam } = req.query as QueryParams;

        const page = pageParam ? parseInt(pageParam, 10) : 1;
        const limit = limitParam ? parseInt(limitParam, 10) : 20;

        if (!process.env.ITTYBIT_API_KEY) {
            return res
                .status(500)
                .json({ error: "IttyBit API key not configured" });
        }

        const url = new URL(API_URL);
        url.searchParams.set("page", page.toString());
        url.searchParams.set("limit", limit.toString());

        const response = await fetch(url.toString(), {
            headers: {
                Authorization: `Bearer ${process.env.ITTYBIT_API_KEY}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            console.error("IttyBit API Error:", {
                status: response.status,
                statusText: response.statusText,
                error: errorData,
            });
            return res.status(response.status).json({
                error:
                    errorData.message ||
                    `Failed to fetch media: ${response.status} ${response.statusText}`,
            });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Media retrieval error:", error);
        return res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to retrieve media",
        });
    }
}
