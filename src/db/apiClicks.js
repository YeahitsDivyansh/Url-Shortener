import { UAParser } from "ua-parser-js"; // Importing the UAParser library to detect device type
import supabase from "./supabase"; // Importing the Supabase client

/**
 * Fetches click statistics for multiple URLs.
 * @param {Array} urlIds - An array of URL IDs for which click data is needed.
 * @returns {Array} - Returns an array of click records associated with the provided URLs.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
export async function getClicksForUrls(urlIds) {
    const { data, error } = await supabase
        .from("clicks") // Targeting the "clicks" table
        .select("*") // Selecting all columns
        .in("url_id", urlIds); // Fetching records where "url_id" is in the provided list

    if (error) {
        console.error(error.message); // Logging the error message for debugging
        throw new Error("Unable to load Clicks"); // Throwing an error for better debugging
    }
    return data; // Returning the fetched click data
}

// Creating a new instance of UAParser to detect user device details
const parser = new UAParser();

/**
 * Stores a click event in the database and redirects the user to the original URL.
 * @param {Object} params - Object containing the short URL ID and the original URL.
 * @param {string} params.id - The ID of the short URL.
 * @param {string} params.originalUrl - The destination/original URL.
 */
export const storeClicks = async ({ id, originalUrl }) => {
    try {
        // Parsing the user's device type (e.g., mobile, tablet, desktop)
        const res = parser.getResult();
        const device = res.type || "desktop"; // Defaulting to "desktop" if the type is undefined

        // Fetching the user's location details using an external IP API
        const response = await fetch("https://ipapi.co/json");
        const { city, country_name: country } = await response.json();

        // Storing the click event in the "clicks" table
        await supabase.from("clicks").insert({
            url_id: id, // The short URL ID
            city: city, // User's city (retrieved from the IP API)
            country: country, // User's country (retrieved from the IP API)
            device: device, // User's device type (parsed from the UAParser)
        });

        // Redirecting the user to the original long URL
        window.location.href = originalUrl;

    } catch (error) {
        console.error("Error recording click:", error); // Logging the error if anything fails
    }
}

/**
 * Retrieves click statistics for a specific URL.
 * @param {string} url_id - The ID of the URL for which click data is needed.
 * @returns {Array} - Returns an array of click records associated with the given URL ID.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
export async function getClicksForUrl(url_id) {
    const { data, error } = await supabase
        .from("clicks") // Targeting the "clicks" table
        .select("*") // Selecting all columns
        .eq("id", url_id); // Filtering clicks for the specific URL ID

    if (error) {
        console.error(error.message); // Logging the error message
        throw new Error("Unable to load Stats"); // Throwing an error for better debugging
    }
    return data; // Returning the fetched click data
}
