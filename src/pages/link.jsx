import { Button } from "@/components/ui/button"; // Importing Button component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Importing Card components for UI
import { UrlState } from "@/context"; // Importing context for URL state management
import { getClicksForUrl } from "@/db/apiClicks"; // Importing function to get click statistics for a URL
import { deleteUrl, getUrl } from "@/db/apiUrls"; // Importing functions to get and delete URLs
import useFetch from "@/hooks/use-fetch"; // Custom hook for fetching data
import { Copy, Download, LinkIcon, Trash } from "lucide-react"; // Importing icons for UI
import { useEffect } from "react"; // Importing useEffect for side effects
import { useNavigate, useParams } from "react-router-dom"; // Importing hooks for navigation and URL parameters
import { BarLoader, BeatLoader } from "react-spinners"; // Importing loaders for loading states
import Location from "@/components/location-stats"; // Importing component to display location statistics
import Device from "@/components/device-stats"; // Importing component to display device statistics

const Link = () => {
    // Function to handle downloading the QR code image
    const downloadImage = () => {
        const imageUrl = url?.qr; // Get the QR code URL
        const fileName = url?.title; // Use the URL title as the file name

        // Create an anchor element for downloading the image
        const anchor = document.createElement("a");
        anchor.href = imageUrl; // Set the href to the image URL
        anchor.download = fileName; // Set the download attribute to the file name

        // Append the anchor to the body
        document.body.appendChild(anchor);

        // Trigger the download by simulating a click event
        anchor.click();

        // Remove the anchor from the document
        document.body.removeChild(anchor);
    };

    // Accessing user state from context
    const { user } = UrlState();
    const { id } = useParams(); // Getting the URL parameter (id)
    const navigate = useNavigate(); // Hook for navigation

    // Fetching URL data using custom hook
    const {
        loading,
        data: url,
        fn, // Function to trigger the fetch
        error,
    } = useFetch(getUrl, { id, user_id: user?.id }); // Fetching URL data with user ID

    // Fetching click statistics for the URL
    const {
        loading: loadingStats,
        data: stats,
        fn: fnStats,
    } = useFetch(getClicksForUrl, id); // Fetching click statistics using the URL ID

    // Fetching function for deleting the URL
    const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id); // Fetching function to delete the URL

    // useEffect to fetch URL and stats data when the component mounts
    useEffect(() => {
        fn(); // Fetch URL data
        fnStats(); // Fetch click statistics
    }, []);

    // If there's an error, navigate to the dashboard
    if (error) {
        navigate("/dashboard");
    }

    // Constructing the link to be displayed
    let link = "";
    if (url) {
        link = url?.custom_url ? url?.custom_url : url.short_url; // Use custom URL if available, otherwise use short URL
    }

    return (
        <>
            {/* Show loading spinner while data is being fetched */}
            {(loading || loadingStats) && (
                <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            )}
            <div className="flex flex-col gap-8 sm:flex-row justify-between">
                <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
                    {/* Displaying the title of the URL */}
                    <span className="text-6xl font-extrabold hover:underline cursor-pointer">{url?.title}</span>
                    {/* Displaying the shortened URL */}
                    <a
                        href={`https://trimrr.in/${link}`}
                        target="_blank"
                        className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer"
                    >
                        https://trimrr.in/{link}
                    </a>
                    {/* Displaying the original URL */}
                    <a
                        href={url?.original_url}
                        target="_blank"
                        className="flex items-center gap-1 hover:underline cursor-pointer"
                    >
                        <LinkIcon className="p-1" />
                        {url?.original_url}
                    </a>
                    {/* Displaying the creation date of the URL */}
                    <span className="flex items-end font-extralight text-sm">
                        {new Date(url?.created_at).toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                        {/* Button to copy the shortened URL to clipboard */}
                        <Button
                            variant="ghost"
                            onClick={() =>
                                navigator.clipboard.writeText(`https://trimmr.in/${url?.short_url}`)
                            }
                        >
                            <Copy />
                        </Button>
                        {/* Button to download the QR code image */}
                        <Button variant="ghost" onClick={downloadImage}>
                            <Download />
                        </Button>
                        {/* Button to delete the URL */}
                        <Button variant="ghost" onClick={() => fnDelete()} >
                            {loadingDelete ? (
                                <BeatLoader size={5} color="white" /> // Show loader while deleting
                            ) : (
                                <Trash />
                            )}
                        </Button>
                    </div>
                    {/* Displaying the QR code image */}
                    <img
                        src={url?.qr}
                        className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
                        alt="qr code"
                    />
                </div>

                {/* Card to display statistics */}
                <Card className="sm:w-3/5">
                    <CardHeader>
                        <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
                    </CardHeader>
                    {stats && stats?.length ? (
                        <CardContent className="flex flex-col gap-6">
                            {/* Card for total clicks */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Total Clicks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{stats?.length}</p> {/* Displaying total clicks */}
                                </CardContent>
                            </Card>

                            <CardTitle>Location Data</CardTitle>
                            <Location stats={stats} /> {/* Displaying location statistics */}
                            <CardTitle>Device Info</CardTitle>
                            <Device stats={stats} /> {/* Displaying device statistics */}
                        </CardContent>
                    ) : (
                        <CardContent>
                            {loadingStats === false
                                ? "No Statistics yet" // Message if no statistics are available
                                : "Loading Statistics.."} // Message while loading statistics
                        </CardContent>
                    )}
                </Card>
            </div>
        </>
    )
}

export default Link; // Exporting the Link component
