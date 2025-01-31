import { UrlState } from "@/context"; // Importing context to get user information
import { useNavigate, useSearchParams } from "react-router-dom"; // Hooks for navigation and URL query parameters
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"; // UI components for the modal dialog
import { Button } from "./ui/button"; // Importing custom button component
import { Input } from "./ui/input"; // Input field component
import Error from "./error"; // Error message component
import { Card } from "./ui/card"; // UI Card component for displaying the custom short URL
import { useEffect, useRef, useState } from "react"; // React hooks
import * as yup from "yup"; // Yup for form validation
import { QRCode } from "react-qrcode-logo"; // Library for generating QR codes
import useFetch from "@/hooks/use-fetch"; // Custom hook for API calls
import { createUrl } from "@/db/apiUrls"; // API function to create a short URL entry
import { BeatLoader } from "react-spinners"; // Loader component for button loading state

/**
 * CreateLink Component: 
 * - This component allows users to create a shortened link with an optional custom URL.
 * - It generates a QR code for the entered long URL.
 * - Uses validation with Yup to ensure correct input.
 * - Stores the new link in the database via Supabase.
 * - Redirects the user to the newly created link's page upon success.
 */
const CreateLink = () => {
    // Extracting user details from the global state
    const { user } = UrlState();

    // Hook to navigate between pages
    const navigate = useNavigate();

    // Reference for the QR Code canvas
    const ref = useRef();

    // React Router hook to manage URL search parameters
    let [searchParams, setSearchParams] = useSearchParams();
    
    // Check if there is a `createNew` parameter in the URL (pre-fills the long URL)
    const longLink = searchParams.get("createNew");

    // State for form errors
    const [errors, setErrors] = useState({});

    // State to manage form input values
    const [formValues, setFormValues] = useState({
        title: "",          // Title of the shortened link
        longUrl: longLink ? longLink : "", // Long URL (prefilled if available)
        customUrl: "",      // Optional custom short URL
    });

    /**
     * Yup Validation Schema:
     * - Title is required.
     * - Long URL must be a valid URL and required.
     * - Custom URL is optional.
     */
    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        longUrl: yup.string().url("Must be a valid URL").required("Long URL is required"),
        customUrl: yup.string(),
    });

    /**
     * Handles input field changes.
     * Updates the form state dynamically as user types.
     */
    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value,
        });
    };

    /**
     * API request to create a short link
     * - Sends form data along with the user ID
     */
    const {
        loading, // Loading state for button UI
        error,   // Error state for handling API errors
        data,    // Data returned from API (short URL details)
        fn: fnCreateUrl, // Function to trigger API call
    } = useFetch(createUrl, { ...formValues, user_id: user.id });

    /**
     * Redirects user to the newly created link's page after successful creation.
     */
    useEffect(() => {
        if (error === null && data) {
            navigate(`/link/${data[0].id}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, data]);

    /**
     * Function to create a new shortened link.
     * - Validates form input using Yup.
     * - Generates a QR code and converts it into a Blob.
     * - Sends the Blob along with the form data to the API.
     */
    const createNewLink = async () => {
        setErrors([]); // Reset previous errors
        try {
            // Validate input fields using Yup schema
            await schema.validate(formValues, { abortEarly: false });

            // Retrieve QR code as an image blob
            const canvas = ref.current.canvasRef.current;
            const blob = await new Promise((resolve) => canvas.toBlob(resolve));

            // Call the API to create a new link
            await fnCreateUrl(blob);
        } catch (e) {
            // Handling validation errors
            const newErrors = {};
            e?.inner?.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        }
    };

    return (
        <Dialog
            defaultOpen={longLink} // Opens dialog automatically if `createNew` param is present
            onOpenChange={(res) => {
                if (!res) setSearchParams({}); // Removes query params when dialog is closed
            }}
        >
            {/* Button to trigger the modal */}
            <DialogTrigger>
                <Button variant="destructive">Create New Link</Button>
            </DialogTrigger>

            {/* Modal content */}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
                </DialogHeader>

                {/* QR Code Preview (only shown if long URL is provided) */}
                {formValues?.longUrl && (
                    <QRCode ref={ref} size={250} value={formValues?.longUrl} />
                )}

                {/* Title Input Field */}
                <Input
                    id="title"
                    placeholder="Short Link's Title"
                    value={formValues.title}
                    onChange={handleChange}
                />
                {errors.title && <Error message={errors.title} />}

                {/* Long URL Input Field */}
                <Input
                    id="longUrl"
                    placeholder="Enter your Loooong URL"
                    value={formValues.longUrl}
                    onChange={handleChange}
                />
                {errors.longUrl && <Error message={errors.longUrl} />}

                {/* Custom Short URL Field */}
                <div className="flex items-center gap-2">
                    <Card className="p-2">trimrr.in</Card> /
                    <Input
                        id="customUrl"
                        placeholder="Custom Link (optional)"
                        value={formValues.customUrl}
                        onChange={handleChange}
                    />
                </div>
                
                {/* Display API errors if any */}
                {error && <Error message={error.message} />}

                {/* Footer with Submit Button */}
                <DialogFooter className="sm:justify-start">
                    <Button
                        onClick={createNewLink} // Calls the function to create a new link
                        variant="destructive"
                        disabled={loading} // Disables button while loading
                    >
                        {loading ? <BeatLoader size={10} color="white" /> : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateLink;
