import { storeClicks } from "@/db/apiClicks"; // Import function to store click statistics
import { getLongUrl } from "@/db/apiUrls"; // Import function to retrieve the original URL
import useFetch from "@/hooks/use-fetch"; // Custom hook for API fetching
import { useEffect } from "react"; // Import useEffect for handling side effects
import { useParams } from "react-router-dom"; // Hook to get route parameters
import { BarLoader } from "react-spinners"; // Loader component for UI feedback

const RedirectLink = () => {
    // Extract the short URL ID from the route parameters
    const { id } = useParams();

    // Fetch the original long URL using the custom fetch hook
    const { loading, data, fn } = useFetch(getLongUrl, id);

    // Fetch hook to store click statistics once the URL is retrieved
    const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
        id: data?.id,
        originalUrl: data?.original_url,
    });

    // Fetch the long URL when the component mounts
    useEffect(() => {
        fn();
    }, []);

    // Once the long URL is fetched, store the click statistics
    useEffect(() => {
        if (!loading && data) {
            fnStats();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    // Show a loading indicator while fetching data or storing statistics
    if (loading || loadingStats) {
        return (
            <>
                <BarLoader width={"100%"} color="#36d7b7" />
                <br />
                Redirecting...
            </>
        );
    }

    return null; // No UI is needed once redirection is complete
}

export default RedirectLink;
