import CreateLink from "@/components/create-link"; // Importing the CreateLink component for adding new short URLs
import Error from "@/components/error"; // Importing the Error component to handle errors
import LinkCard from "@/components/link-card"; // Importing the LinkCard component to display individual links
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Importing UI components for displaying stats
import { Input } from "@/components/ui/input"; // Importing Input component for search functionality
import { UrlState } from "@/context"; // Importing the URL context to get user data
import { getClicksForUrls } from "@/db/apiClicks"; // Function to fetch click statistics for URLs
import { getUrls } from "@/db/apiUrls"; // Function to fetch the user's URLs from the database
import useFetch from "@/hooks/use-fetch"; // Custom hook for handling API requests
import { Filter } from "lucide-react"; // Importing the Filter icon from lucide-react
import { useEffect, useState } from "react"; // Importing React hooks
import { BarLoader } from "react-spinners"; // Importing a loading bar for UI feedback

const Dashboard = () => {
    // State to store the search query for filtering URLs
    const [searchQuery, setSearchQuery] = useState("");

    // Fetching the logged-in user from context
    const { user } = UrlState();

    // Fetching the user's URLs using a custom hook
    const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls, user?.id);

    // Fetching click statistics for the URLs
    const {
        loading: loadingClicks,
        data: clicks,
        fn: fnClicks,
    } = useFetch(
        getClicksForUrls,
        urls?.map((url) => url.id) // Extracting URL IDs for fetching click data
    );

    // Fetch the URLs when the component mounts
    useEffect(() => {
        fnUrls();
    }, []);

    // Fetch click stats whenever URLs are successfully loaded
    useEffect(() => {
        if (urls?.length) fnClicks();
    }, [urls?.length]);

    // Filtering URLs based on the search query
    const filteredUrls = urls?.filter((url) =>
        url.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8">
            {/* Show a loading bar when data is being fetched */}
            {(loading || loadingClicks) && (<BarLoader width={"100%"} color="#36d7b7" />)}

            {/* Display the total number of links created and total clicks */}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Links Created</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{urls?.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Clicks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{clicks?.length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Header section with the title and a button to create a new short link */}
            <div className="flex justify-between">
                <h1 className="text-4xl font-extrabold">My Links</h1>
                <CreateLink />
            </div>

            {/* Search input field to filter links */}
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Filter Links..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Filter className="absolute top-2 right-2 p-1" /> {/* Search filter icon */}
            </div>

            {/* Display error message if there's an issue fetching URLs */}
            {error && <Error message={error?.message} />}

            {/* Render filtered list of links, or an empty array if no links exist */}
            {(filteredUrls || []).map((url, i) => {
                return <LinkCard key={i} url={url} fetchUrls={fnUrls} />
            })}
        </div>
    )
}

export default Dashboard;
