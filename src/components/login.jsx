import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"; // UI components for structuring the login form
import { Input } from "./ui/input"; // Input component for user input fields
import { Button } from "./ui/button"; // Button component for submission
import { BeatLoader } from "react-spinners"; // Loader for indicating processing state
import Error from "./error"; // Error component to display validation or API errors
import { useEffect, useState } from "react";
import * as Yup from "yup"; // Validation library for form validation
import useFetch from "@/hooks/use-fetch"; // Custom hook for handling API requests
import { login } from "@/db/apiAuth"; // API function for login
import { useNavigate, useSearchParams } from "react-router-dom"; // React Router hooks for navigation
import { UrlState } from "@/context"; // Global state management hook

const Login = () => {
    // State to store validation errors
    const [errors, setErrors] = useState([]);

    // State to store form input values
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate(); // Hook to navigate between routes
    let [searchParams] = useSearchParams(); // Hook to access URL query parameters
    const longLink = searchParams.get("createNew"); // Retrieve the long URL if present in the query params

    // Function to handle input changes and update state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Custom hook for API call to login, returns loading state, error, and response data
    const { data, error, loading, fn: fnLogin } = useFetch(login, formData);
    const { fetchUser } = UrlState(); // Function to fetch user data after login

    // Effect to check if login was successful, then redirect user
    useEffect(() => {
        if (error === null && data) {
            fetchUser(); // Fetch user details after login
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`); // Redirect to dashboard with optional long URL
        }
    }, [data, error]);

    // Function to validate and handle login
    const handleLogin = async () => {
        setErrors([]); // Reset errors before validation

        try {
            // Define validation schema using Yup
            const schema = Yup.object().shape({
                email: Yup.string()
                    .email("Invalid Email") // Must be a valid email format
                    .required("Email is Required"), // Email field is mandatory
                password: Yup.string()
                    .min(6, "Password must be at least 6 characters") // Minimum length requirement
                    .required("Password is required"), // Password field is mandatory
            });

            // Validate form data against schema
            await schema.validate(formData, { abortEarly: false });

            // API call to log in the user
            await fnLogin();
        } catch (e) {
            const newErrors = {};

            // Extract validation errors from Yup and store them in state
            e?.inner?.forEach((err) => {
                newErrors[err.path] = err.message;
            });

            setErrors(newErrors); // Update error state
        }
    };

    return (
        <Card>
            {/* Card Header containing title and description */}
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    to your account if you already have one
                </CardDescription>
                {/* Display error message if an API error occurs */}
                {error && <Error message={error.message} />}
            </CardHeader>

            {/* Card Content containing input fields */}
            <CardContent className="space-y-2">
                {/* Email Input Field */}
                <div className="space-y-1">
                    <Input
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                        onChange={handleInputChange}
                    />
                    {/* Display validation error for email if present */}
                    {errors.email && <Error message={errors.email} />}
                </div>

                {/* Password Input Field */}
                <div className="space-y-1">
                    <Input
                        name="password"
                        type="password"
                        placeholder="Enter Password"
                        onChange={handleInputChange}
                    />
                    {/* Display validation error for password if present */}
                    {errors.password && <Error message={errors.password} />}
                </div>
            </CardContent>

            {/* Card Footer containing the login button */}
            <CardFooter>
                <Button onClick={handleLogin}>
                    {/* Show loading spinner when API request is in progress */}
                    {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Login"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Login;
