import { Link, useNavigate } from "react-router-dom"; // Importing Link for navigation and useNavigate hook for programmatic navigation
import { Button } from "./ui/button"; // Importing Button component from UI library
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "./ui/dropdown-menu"; // Importing dropdown menu components
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // Importing Avatar components for user profile display
import { LinkIcon, LogOutIcon } from "lucide-react"; // Importing icons for UI
import { UrlState } from "@/context"; // Importing context to access global state
import useFetch from "@/hooks/use-fetch"; // Importing custom hook for handling API calls
import { logout } from "@/db/apiAuth"; // Importing logout API function
import { BarLoader } from "react-spinners"; // Importing loading indicator

// The Header component represents the navigation bar of the application.
const Header = () => {

    const navigate = useNavigate(); // useNavigate hook for navigating programmatically

    const { user, fetchUser } = UrlState(); // Extracting user data and fetchUser function from context

    const { loading, fn: fnLogout } = useFetch(logout); // Using custom useFetch hook to handle logout API call

    return (
        <>
            {/* Navigation Bar */}
            <nav className="py-4 flex justify-between items-center">
                {/* Logo linking to home page */}
                <Link to="/">
                    <img src="/logo.png" className="h-16" alt="Trimrr logo" />
                </Link>

                {/* Right-side menu (Login Button or User Profile Dropdown) */}
                <div>
                    {/* If user is not logged in, show Login button */}
                    {!user ? (
                        <Button onClick={() => navigate("/auth")}>Login</Button>
                    ) : (
                        // If user is logged in, show profile dropdown menu
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
                                <Avatar>
                                    {/* Display user's profile picture if available, else show fallback initials */}
                                    <AvatarImage src={user?.user_metadata?.profile_pic} className="object-contain" />
                                    <AvatarFallback>DS</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>

                            {/* Dropdown content */}
                            <DropdownMenuContent>
                                {/* Display user name */}
                                <DropdownMenuLabel>
                                    {user?.user_metadata?.name}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator /> {/* Separator line */}

                                {/* Navigation to user's links/dashboard */}
                                <DropdownMenuItem>
                                    <Link to="/dashboard" className="flex">
                                        <LinkIcon className="mr-2 h-4 w-4" />
                                        My Links
                                    </Link>
                                </DropdownMenuItem>

                                {/* Logout option */}
                                <DropdownMenuItem className="text-red-400">
                                    <LogOutIcon className="mr-2 h-4 w-4" />
                                    <span onClick={() => {
                                        fnLogout().then(() => {
                                            fetchUser(); // Refresh user state after logout
                                            navigate("/"); // Redirect to home after logout
                                        });
                                    }}>
                                        Logout
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </nav>

            {/* Loading indicator displayed when logout request is in progress */}
            {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
        </>
    );
};

export default Header;
