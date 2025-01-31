import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { BeatLoader } from "react-spinners" // Loading spinner component
import Error from "./error" // Custom error component
import { useEffect, useState } from "react"
import * as Yup from 'yup' // Schema validation library
import useFetch from "@/hooks/use-fetch" // Custom hook for API calls
import { signup } from "@/db/apiAuth" // API function for signing up
import { useNavigate, useSearchParams } from "react-router-dom" // Routing utilities
import { UrlState } from "@/context" // Context for global state management

const Signup = () => {
    // State to hold form validation errors
    const [errors, setErrors] = useState([]);
    // State to manage form data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profile_pic: null, // File input for profile picture
    });

    const navigate = useNavigate(); // Hook for programmatic navigation
    let [searchParams] = useSearchParams(); // Access query parameters from the URL
    const longLink = searchParams.get("createNew"); // Get the "createNew" query parameter

    // Handle input changes for text and file inputs
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: files ? files[0] : value, // Update state with file or text value
        }));
    };

    // Custom hook to handle API call for signup
    const { data, error, loading, fn: fnSignup } = useFetch(signup, formData);
    const { fetchUser } = UrlState(); // Function to fetch user data from global state

    // Effect to handle navigation after successful signup
    useEffect(() => {
        if (error === null && data) {
            // Navigate to the dashboard with optional query parameter
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
            fetchUser(); // Fetch user data after successful signup
        }
    }, [error, loading]); // Trigger effect when error or loading state changes

    // Function to handle the signup process
    const handleSignup = async () => {
        setErrors([]); // Clear previous errors
        try {
            // Define validation schema using Yup
            const schema = Yup.object().shape({
                name: Yup.string().required("Name is required"),
                email: Yup.string()
                    .email("Invalid Email")
                    .required("Email is Required"),
                password: Yup.string()
                    .min(6, "Password must be at least 6 characters")
                    .required("Password is required"),
                profile_pic: Yup.mixed().required("Profile picture is required"),
            });

            // Validate form data against the schema
            await schema.validate(formData, { abortEarly: false });
            // Call the signup API function
            await fnSignup();
        } catch (e) {
            // Handle validation errors
            const newErrors = {};
            e?.inner?.forEach((err) => {
                newErrors[err.path] = err.message; // Map errors to their respective fields
            });
            setErrors(newErrors); // Update errors state
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Signup</CardTitle>
                <CardDescription>
                    Create a new account if you haven&rsquo;t already
                </CardDescription>
                {/* Display error message if API call fails */}
                {error && <Error message={error.message} />}
            </CardHeader>
            <CardContent className="space-y-2">
                {/* Name input field */}
                <div className="space-y-1">
                    <Input
                        name="name"
                        type="text"
                        placeholder="Enter Name"
                        onChange={handleInputChange}
                    />
                    {/* Display name validation error */}
                    {errors.name && <Error message={errors.name} />}
                </div>
                {/* Email input field */}
                <div className="space-y-1">
                    <Input
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                        onChange={handleInputChange}
                    />
                    {/* Display email validation error */}
                    {errors.email && <Error message={errors.email} />}
                </div>
                {/* Password input field */}
                <div className="space-y-1">
                    <Input
                        name="password"
                        type="password"
                        placeholder="Enter Password"
                        onChange={handleInputChange}
                    />
                    {/* Display password validation error */}
                    {errors.password && <Error message={errors.password} />}
                </div>
                {/* Profile picture file input */}
                <div className="space-y-1">
                    <Input
                        name="profile_pic"
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                    />
                    {/* Display profile picture validation error */}
                    {errors.profile_pic && <Error message={errors.profile_pic} />}
                </div>
            </CardContent>
            <CardFooter>
                {/* Signup button with loading state */}
                <Button onClick={handleSignup}>
                    {loading ? <BeatLoader size={10} color="#36d7b7" /> : (
                        "Create Account"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Signup;
