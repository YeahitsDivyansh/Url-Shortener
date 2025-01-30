import supabase, { supabaseUrl } from "./supabase";

/**
 * Logs in a user using email and password authentication.
 * 
 * @param {Object} param0 - Object containing user credentials.
 * @param {string} param0.email - User's email address.
 * @param {string} param0.password - User's password.
 * @returns {Object} - User session data on successful login.
 * @throws {Error} - Throws an error if login fails.
 */
export async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw new Error(error.message); // Handle authentication errors

    return data; // Return user session data
}

/**
 * Retrieves the currently authenticated user session.
 * 
 * @returns {Object|null} - User data if logged in, otherwise null.
 * @throws {Error} - Throws an error if session retrieval fails.
 */
export async function getCurrentUser() {
    const { data: session, error } = await supabase.auth.getSession();
    
    if (!session.session) return null; // Return null if no active session exists
    if (error) throw new Error(error.message); // Handle session retrieval errors

    return session.session?.user; // Return the user object from the session
}

/**
 * Registers a new user with email, password, name, and profile picture.
 * 
 * @param {Object} param0 - User registration details.
 * @param {string} param0.name - User's full name.
 * @param {string} param0.email - User's email address.
 * @param {string} param0.password - User's password.
 * @param {File} param0.profile_pic - Profile picture file.
 * @returns {Object} - User data on successful signup.
 * @throws {Error} - Throws an error if signup or file upload fails.
 */
export async function signup({ name, email, password, profile_pic }) {
    // Generate a unique filename for profile picture
    const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;
    
    // Upload profile picture to Supabase storage
    const { error: storageError } = await supabase.storage
        .from("profile_pic")
        .upload(fileName, profile_pic);

    if (storageError) throw new Error(storageError.message); // Handle file upload errors

    // Sign up the user with provided credentials and store profile picture URL
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
            }
        }
    });

    if (error) throw new Error(error.message); // Handle authentication errors

    return data; // Return user data upon successful registration
}

/**
 * Logs out the currently authenticated user.
 * 
 * @returns {void}
 * @throws {Error} - Throws an error if logout fails.
 */
export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message); // Handle logout errors
}
