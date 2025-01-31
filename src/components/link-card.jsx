import { Link } from "react-router-dom"; // Importing Link for navigation
import { Button } from "./ui/button"; // Importing a UI button component
import { Copy, Download, Trash } from "lucide-react"; // Importing icons from Lucide React
import useFetch from "@/hooks/use-fetch"; // Importing custom hook for API requests
import { deleteUrl } from "@/db/apiUrls"; // Function to delete a URL from the database
import { BeatLoader } from "react-spinners"; // Importing a loading spinner for delete action

/* eslint-disable react/prop-types */ // Disables ESLint warning for missing PropTypes

const LinkCard = ({ url, fetchUrls }) => {
    /**
     * Function to download the QR code image associated with the short URL.
     * It creates an anchor element dynamically and triggers a download action.
     */
    const downloadImage = () => {
        const imageUrl = url?.qr; // QR code image URL
        const fileName = url?.title; // File name for the downloaded image

        // Create an anchor element
        const anchor = document.createElement("a");
        anchor.href = imageUrl;
        anchor.download = fileName; // Setting the filename

        // Append anchor to the document and trigger the download
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor); // Cleanup: remove anchor after download
    };

    // Hook to handle deleting the URL, along with a loading state
    const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

    return (
        <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
            {/* QR Code Image */}
            <img
                src={url?.qr}
                className="h-32 object-contain ring ring-blue-500 self-start"
                alt="QR Code"
            />

            {/* URL Information */}
            <Link to={`/link/${url?.id}`} className="flex flex-col flex-1">
                {/* Title of the shortened URL */}
                <span className="text-3xl font-extrabold hover:underline cursor-pointer">
                    {url?.title}
                </span>

                {/* Shortened URL with optional custom URL */}
                <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer">
                    https://trimrr.in/{url?.custom_url ? url?.custom_url : url.short_url}
                </span>

                {/* Original long URL */}
                <span className="flex items-center gap-1 hover:underline cursor-pointer">
                    {url?.original_url}
                </span>

                {/* Timestamp of when the URL was created */}
                <span className="flex items-end font-extralight text-sm flex-1">
                    {new Date(url?.created_at).toLocaleString()}
                </span>
            </Link>

            {/* Action Buttons (Copy, Download, Delete) */}
            <div className="flex gap-2">
                {/* Copy shortened URL to clipboard */}
                <Button
                    variant="ghost"
                    onClick={() =>
                        navigator.clipboard.writeText(`https://trimmr.in/${url?.short_url}`)
                    }
                >
                    <Copy />
                </Button>

                {/* Download QR Code Image */}
                <Button variant="ghost" onClick={downloadImage}>
                    <Download />
                </Button>

                {/* Delete Shortened URL */}
                <Button
                    variant="ghost"
                    onClick={() => fnDelete().then(() => fetchUrls())} // After deletion, refresh the list of URLs
                >
                    {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
                </Button>
            </div>
        </div>
    );
};

export default LinkCard;
