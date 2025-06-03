/**
 * Apple Client Secret Generator Script
 *
 * This script generates a client secret JWT required for Apple Sign In authentication.
 * The generated secret is valid for 6 months and needs to be regenerated before expiry.
 *
 * Required Environment Variables in .env:
 * - APPLE_TEAM_ID: Found in your Apple Developer account
 * - APPLE_KEY_ID: The Key ID from your private key in Apple Developer Console
 * - APPLE_CLIENT_ID: Your app's identifier (e.g., com.yourapp.id)
 * - APPLE_PRIVATE_KEY_PATH: Path to your .p8 private key file
 *
 * Important Notes:
 * - The private key (.p8) file must be kept secure and never committed to version control
 * - The generated secret is valid for 6 months
 * - This secret is required for the auth.ts configuration (Better Auth)
 *
 * To run this script:
 * 1. Run the script: npm run generate-apple-secret
 * 2. The generated secret will be printed to the console
 * 3. Copy the secret and paste it into your .env file
 * 4. Restart your server
 */

import dotenv from "dotenv";
import fs from "fs";
import pkg from "jsonwebtoken";
import path from "path";
const { sign } = pkg;

// Load environment variables from .env file
dotenv.config();

// Log environment variables for verification
// These logs help debug missing or incorrect values
console.log("Environment variables:");
console.log("TEAM_ID:", process.env.APPLE_TEAM_ID);
console.log("KEY_ID:", process.env.APPLE_KEY_ID);
console.log("CLIENT_ID:", process.env.APPLE_CLIENT_ID);
console.log("PRIVATE_KEY_PATH:", process.env.APPLE_PRIVATE_KEY_PATH);

// Extract required configuration from environment
const TEAM_ID = process.env.APPLE_TEAM_ID;
const KEY_ID = process.env.APPLE_KEY_ID;
const CLIENT_ID = process.env.APPLE_CLIENT_ID;
const PRIVATE_KEY_PATH = process.env.APPLE_PRIVATE_KEY_PATH;

// Validate all required environment variables
// Exit early if any required variable is missing
if (!TEAM_ID || !KEY_ID || !CLIENT_ID || !PRIVATE_KEY_PATH) {
    console.error("Missing required environment variables");
    console.error(
        "Required variables: APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_CLIENT_ID, APPLE_PRIVATE_KEY_PATH"
    );
    process.exit(1);
}

console.log("Attempting to read private key from:", PRIVATE_KEY_PATH);

try {
    // Read the Apple private key (.p8 file)
    // This key should be downloaded from Apple Developer Console
    const privateKey = fs.readFileSync(path.resolve(PRIVATE_KEY_PATH));

    // Configure the JWT payload according to Apple's specifications
    // See: https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens
    const payload = {
        iss: TEAM_ID, // Team ID from Apple Developer account
        iat: Math.floor(Date.now() / 1000), // Current timestamp
        exp: Math.floor(Date.now() / 1000) + 15777000, // 6 months expiry
        aud: "https://appleid.apple.com", // Required audience
        sub: CLIENT_ID, // Your app's identifier
    };

    // Generate the client secret
    // Uses ES256 algorithm as required by Apple
    const clientSecret = sign(payload, privateKey, {
        algorithm: "ES256",
        keyid: KEY_ID,
    });

    // Output the generated secret
    // This value should be used in your auth.ts configuration
    console.log("\nApple Client Secret:");
    console.log(clientSecret);
} catch (error: any) {
    console.error("Error reading private key:", error.message);
    process.exit(1);
}
