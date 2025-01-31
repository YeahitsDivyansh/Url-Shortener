/* eslint-disable react/prop-types */ // Disabling prop-types validation for this component

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"; // Importing components from the Recharts library for creating charts

// Functional component to display location statistics
export default function Location({ stats = [] }) {
    // Reducing the stats array to count occurrences of each city
    const cityCount = stats.reduce((acc, item) => {
        // Check if the city already exists in the accumulator
        if (acc[item.city]) {
            acc[item.city] += 1; // Increment the count for the existing city
        } else {
            acc[item.city] = 1; // Initialize the count for a new city
        }
        return acc; // Return the updated accumulator
    }, {});

    // Transforming the cityCount object into an array of objects for charting
    const cities = Object.entries(cityCount).map(([city, count]) => ({
        city, // City name
        count, // Count of occurrences
    }));

    return (
        <div style={{ width: "100%", height: 300 }}> {/* Container for the chart */}
            <ResponsiveContainer> {/* Makes the chart responsive to container size */}
                <LineChart width={700} height={300} data={cities.slice(0, 5)}> {/* Line chart with data for the top 5 cities */}
                    <XAxis dataKey="city" /> {/* X-axis displaying city names */}
                    <YAxis /> {/* Y-axis for count values */}
                    <Tooltip labelStyle={{ color: "green" }} /> {/* Tooltip with custom label style */}
                    <Legend /> {/* Legend to identify the data series */}
                    <Line type="monotone" dataKey="count" stroke="#82ca9d" /> {/* Line representing the count of clicks per city */}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
