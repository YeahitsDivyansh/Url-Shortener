/* eslint-disable react/prop-types */ // Disabling prop-types validation for this component

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"; // Importing components from the Recharts library for creating pie charts

// Defining an array of colors to be used for the pie chart segments
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Functional component to display device statistics
export default function Device({ stats }) {
    // Reducing the stats array to count occurrences of each device type
    const deviceCount = stats.reduce((acc, item) => {
        // Check if the device type already exists in the accumulator
        if (!acc[item.device]) {
            acc[item.device] = 0; // Initialize the count for a new device type
        }
        acc[item.device]++; // Increment the count for the existing device type
        return acc; // Return the updated accumulator
    }, {});

    // Transforming the deviceCount object into an array of objects for charting
    const result = Object.keys(deviceCount).map((device) => ({
        device, // Device type
        count: deviceCount[device], // Count of occurrences for the device type
    }));

    return (
        <div style={{ width: "100%", height: 300 }}> {/* Container for the pie chart */}
            <ResponsiveContainer> {/* Makes the chart responsive to container size */}
                <PieChart width={700} height={400}> {/* Pie chart with specified dimensions */}
                    <Pie
                        data={result} // Data for the pie chart
                        labelLine={false} // Disable lines connecting labels to pie segments
                        label={({ device, percent }) => // Custom label for each pie segment
                            `${device}: ${(percent * 100).toFixed(0)}%` // Display device type and percentage
                        }
                        dataKey="count" // Key to access the count value in the data
                    >
                        {/* Mapping over the result to create a Cell for each pie segment */}
                        {result.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`} // Unique key for each cell
                                fill={COLORS[index % COLORS.length]} // Assign color from the COLORS array
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
