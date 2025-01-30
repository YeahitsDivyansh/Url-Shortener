/**
 * Error Component
 * 
 * This component is used to display error messages in a visually distinct way.
 * The error message is styled with a red color to indicate an issue.
 * 
 * @param {Object} props - Component props.
 * @param {string} props.message - The error message to display.
 * @returns {JSX.Element} - A styled error message.
 */
const Error = ({ message }) => {
    return <span className="text-sm text-red-400">{message}</span>;
};

export default Error;
