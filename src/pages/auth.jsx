import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/login";
import Signup from "@/components/signup";
import { UrlState } from "@/context";
import { useEffect } from "react";

const Auth = () => {
    // Extract query parameters from the URL
    const [searchParams] = useSearchParams();
    const longLink = searchParams.get("createNew"); // Retrieve the long URL if passed as a query parameter

    // React Router hook to navigate between pages
    const navigate = useNavigate();

    // Get authentication status and loading state from the global context
    const { isAuthenticated, loading } = UrlState();

    // Redirect user to the dashboard if they are authenticated
    useEffect(() => {
        if (isAuthenticated && !loading) {
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
        }
    }, [isAuthenticated, loading]);

    return (
        <div className="mt-20 flex flex-col items-center gap-10">
            {/* Dynamic heading based on whether a long URL is present */}
            <h1 className="text-5xl font-extrabold">
                {longLink ? "Hold up! Let's login first..." : "Login / Signup"}
            </h1>

            {/* Tabbed UI for switching between Login and Signup */}
            <Tabs defaultValue="login" className="w-[400px]">
                {/* TabsList defines the available tabs */}
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Signup</TabsTrigger>
                </TabsList>

                {/* Content for the Login Tab */}
                <TabsContent value="login">
                    <Login />
                </TabsContent>

                {/* Content for the Signup Tab */}
                <TabsContent value="signup">
                    <Signup />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Auth;
