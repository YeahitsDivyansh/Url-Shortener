/* eslint-disable react/prop-types */

import { createContext, useContext, useEffect } from "react";
import { getCurrentUser } from "./db/apiAuth";
import useFetch from "./hooks/use-fetch";

// Creating a context to manage user authentication state across the application
const UrlContext = createContext();

/**
 * UrlProvider Component
 * 
 * This component provides authentication-related state and functions to its children components.
 * It manages user authentication status, user data, and loading state using the `useFetch` custom hook.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components that will consume the context.
 * @returns {JSX.Element} - Context provider wrapping the application.
 */
const UrlProvider = ({ children }) => {
    // Fetch user authentication state using a custom hook
    const { data: user, loading, fn: fetchUser } = useFetch(getCurrentUser);

    // Check if the user is authenticated
    const isAuthenticated = user?.role === "authenticated";

    // Fetch user data when the component mounts
    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UrlContext.Provider value={{ user, fetchUser, loading, isAuthenticated }}>
            {children} {/* Render child components inside the provider */}
        </UrlContext.Provider>
    );
};

/**
 * UrlState Hook
 * 
 * A custom hook to easily access the authentication state and user details 
 * from any component inside the provider.
 * 
 * @returns {Object} - Authentication state and user data.
 */
export const UrlState = () => {
    return useContext(UrlContext);
};

export default UrlProvider;
