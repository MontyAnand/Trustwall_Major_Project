import { useEffect, useState } from "react";
import { useSocket } from "../Contexts/socketContex";

const CommandInterface = () => {
    const [command, setCommand] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;
        socket.on('command-execution-result', (data) => {
            setLoading(false);
            setOutput(output + data);
        });

        return () => {
            socket.off('command-execution-result');
        }
    }, [socket]);

    const handleSendCommand = () => {
        if (!socket) {
            setOutput("Not connected to UTM");
            setLoading(false);
            return;
        }
        if (!command.trim()) return;
        setLoading(true);
        setOutput("");
        socket.emit('execute-command', command.trim());
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("script", file);

        setLoading(true);
        setOutput(`Uploading ${file.name}...`);

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setOutput(data.result || "Script executed successfully.");
        } catch (error) {
            setOutput("Error uploading file.");
        }

        setLoading(false);
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <h1 className="text-xl mb-4">Remote Command Executor</h1>

            {/* Command Input */}
            <div className="flex w-3/4 max-w-lg">
                <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Enter command..."
                    className="flex-1 p-2 bg-gray-800 text-white border border-gray-600 rounded-l"
                />
                <button
                    onClick={handleSendCommand}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r"
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Run"}
                </button>
            </div>

            {/* File Upload */}
            <div className="mt-4">
                <input
                    type="file"
                    accept=".sh,.py,.bat"
                    onChange={handleFileUpload}
                    className="text-white bg-gray-800 p-2 rounded cursor-pointer"
                />
            </div>

            {/* Output Terminal */}
            <div className="w-3/4 max-w-lg mt-4 p-2 bg-black text-green-500 border border-gray-600 rounded h-40 overflow-auto">
                {output || "Results will appear here..."}
            </div>
        </div>
    );
};

export default CommandInterface;
