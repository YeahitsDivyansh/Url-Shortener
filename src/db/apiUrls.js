import supabase, { supabaseUrl } from "./supabase"; // Importing the Supabase client and base URL

/**
 * Fetches all URLs associated with a specific user.
 * @param {string} user_id - The unique identifier of the user.
 * @returns {Array} - Returns an array of URLs if successful.
 * @throws {Error} - Throws an error if fetching fails.
 */
export async function getUrls(user_id) {
    const { data, error } = await supabase
        .from("urls") // Querying the "urls" table
        .select("*") // Selecting all columns
        .eq("user_id", user_id); // Filtering URLs belonging to the given user ID

    if (error) {
        console.error(error.message); // Logging the error message
        throw new Error("Unable to load URLs"); // Throwing a new error for better debugging
    }
    return data; // Returning the fetched URL data
}

/**
 * Deletes a URL from the database.
 * @param {string} id - The unique identifier of the URL to be deleted.
 * @returns {Object} - Returns the deleted data if successful.
 * @throws {Error} - Throws an error if deletion fails.
 */
export async function deleteUrl(id) {
    const { data, error } = await supabase
        .from("urls") // Targeting the "urls" table
        .delete() // Deleting the row
        .eq("id", id); // Filtering by the given URL ID

    if (error) {
        console.error(error.message); // Logging the error message
        throw new Error("Unable to delete URL"); // Throwing an error
    }
    return data; // Returning the deleted URL data
}

/**
 * Creates a new shortened URL entry in the database.
 * @param {Object} urlData - Contains title, longUrl, customUrl, and user_id.
 * @param {File} qrcode - QR code image file to be uploaded.
 * @returns {Object} - Returns the newly created URL entry.
 * @throws {Error} - Throws an error if insertion fails.
 */
export async function createUrl({ title, longUrl, customUrl, user_id }, qrcode) {
    // Generating a random 4-character string as the short URL identifier
    const short_url = Math.random().toString(36).substring(2, 6);

    // Defining the QR code file name
    const fileName = `qr-${short_url}`;

    // Uploading the QR code image to Supabase storage
    const { error: storageError } = await supabase.storage
        .from("qrs") // Targeting the "qrs" storage bucket
        .upload(fileName, qrcode); // Uploading the file

    // Handling any errors that occur during the upload
    if (storageError) throw new Error(storageError.message);

    // Generating the public URL for the uploaded QR code image
    const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

    // Inserting a new URL entry into the "urls" table
    const { data, error } = await supabase
        .from("urls")
        .insert([
            {
                title, // URL title
                user_id, // User ID
                original_url: longUrl, // The original long URL
                custom_url: customUrl || null, // Custom short URL if provided, otherwise null
                short_url, // The randomly generated short URL identifier
                qr, // The public QR code URL
            },
        ])
        .select(); // Selecting the inserted data

    // Handling any errors during insertion
    if (error) {
        console.error(error.message);
        throw new Error("Error creating short URL");
    }
    return data; // Returning the newly created URL entry
}

/**
 * Fetches the original long URL from the short URL or custom URL.
 * @param {string} id - The short URL or custom URL.
 * @returns {Object} - Returns the URL entry if found.
 * @throws {Error} - Throws an error if retrieval fails.
 */
export async function getLongUrl(id) {
    const { data, error } = await supabase
        .from("urls") // Targeting the "urls" table
        .select("id, original_url") // Selecting only necessary columns
        .or(`short_url.eq.${id},custom_url.eq.${id}`) // Checking if the given ID matches short_url or custom_url
        .single(); // Ensuring only one matching row is returned

    // Handling errors during retrieval
    if (error) {
        console.error(error.message);
        throw new Error("Error fetching short link");
    }
    return data; // Returning the found URL data
}

/**
 * Retrieves a specific URL entry based on ID and user ID.
 * @param {Object} params - Contains the URL ID and user ID.
 * @returns {Object} - Returns the URL entry if found.
 * @throws {Error} - Throws an error if the URL is not found.
 */
export async function getUrl({ id, user_id }) {
    const { data, error } = await supabase
        .from("urls") // Targeting the "urls" table
        .select("*") // Selecting all columns
        .eq("id", id) // Filtering by the given URL ID
        .eq("user_id", user_id) // Ensuring the URL belongs to the correct user
        .single(); // Expecting a single result

    // Handling errors if no matching URL is found
    if (error) {
        console.error(error.message);
        throw new Error("Short URL not found");
    }
    return data; // Returning the found URL entry
}
