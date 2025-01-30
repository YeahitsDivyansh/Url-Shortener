import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
    // State to store the long URL input by the user
    const [longUrl, setLongUrl] = useState("");
    
    // Hook to navigate between routes
    const navigate = useNavigate();

    // Function to handle URL shortening
    const handleShorten = (e) => {
        e.preventDefault(); // Prevents default form submission behavior
        if (longUrl) navigate(`/auth?createNew=${longUrl}`); // Redirect to authentication page with the URL as a query parameter
    };

    return (
        <div className="flex flex-col items-center">
            {/* Page heading */}
            <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
                The only URL Shortener <br /> you&rsquo;ll ever need! 👇
            </h2>

            {/* URL input form */}
            <form
                onSubmit={handleShorten}
                className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2"
            >
                {/* Input field for long URL */}
                <Input
                    type="url"
                    placeholder="Enter your loooong URL"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    className="h-full flex-1 py-4 px-4"
                />
                {/* Submit button */}
                <Button type="submit" className="h-full" variant="destructive">
                    Shorten!
                </Button>
            </form>

            {/* Banner image */}
            <img
                src="/banner1.jpg" // Replace with a different image for small screens if needed
                className="w-full my-11 md:px-11"
            />

            {/* FAQ Section using Accordion */}
            <Accordion type="multiple" collapsible className="w-full md:px-11">
                {/* Question 1 */}
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        How does the Trimrr URL shortener work?
                    </AccordionTrigger>
                    <AccordionContent>
                        When you enter a long URL, our system generates a shorter version of
                        that URL. This shortened URL redirects to the original long URL when
                        accessed.
                    </AccordionContent>
                </AccordionItem>

                {/* Question 2 */}
                <AccordionItem value="item-2">
                    <AccordionTrigger>
                        Do I need an account to use the app?
                    </AccordionTrigger>
                    <AccordionContent>
                        Yes. Creating an account allows you to manage your URLs, view
                        analytics, and customize your short URLs.
                    </AccordionContent>
                </AccordionItem>

                {/* Question 3 */}
                <AccordionItem value="item-3">
                    <AccordionTrigger>
                        What analytics are available for my shortened URLs?
                    </AccordionTrigger>
                    <AccordionContent>
                        You can view the number of clicks, geolocation data of the clicks,
                        and device types (mobile/desktop) for each of your shortened URLs.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default LandingPage;
