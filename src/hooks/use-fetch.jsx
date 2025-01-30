import { useState } from "react";

/**
 * Custom hook `useFetch` for handling asynchronous requests.
 * 
 * @param {Function} cb - A callback function that makes the API request.
 * @param {Object} options - Optional configuration object for the API request.
 * 
 * @returns {Object} An object containing:
 *   - `data`: The fetched data (initially `null`).
 *   - `loading`: A boolean indicating whether the request is in progress.
 *   - `error`: Any error encountered during the request.
 *   - `fn`: A function to trigger the fetch request.
 */
const useFetch = (cb, options = {}) => {
    // State to store the fetched data
    const [data, setData] = useState(null);
    
    // State to track loading status
    const [loading, setLoading] = useState(null);
    
    // State to store any errors encountered
    const [error, setError] = useState(null);

    /**
     * Function to execute the API request.
     * It resets error state, sets loading to true, and then calls the `cb` function.
     * 
     * @param {...any} args - Additional arguments passed to the callback function.
     */
    const fn = async (...args) => {
        setLoading(true);  // Set loading to true before making the request
        setError(null);  // Reset previous errors
        
        try {
            // Execute the provided callback function (API request) with options and arguments
            const response = await cb(options, ...args);
            
            // Store the response data in state
            setData(response);
        } catch (error) {
            // Catch and store any errors that occur during the request
            setError(error);
        } finally {
            // Set loading to false once the request completes (whether successful or failed)
            setLoading(false);
        }
    };

    // Return the state variables and the function to trigger the fetch request
    return { data, loading, error, fn };
};

export default useFetch;
