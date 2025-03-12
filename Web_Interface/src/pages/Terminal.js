import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { useSocket } from "../Contexts/socketContex";

const LinuxTerminal = () => {
    const terminalRef = useRef(null);
    const [term, setTerm] = useState(null);
    const { socket } = useSocket();

    useEffect(() => {
        const terminal = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: "Menlo, Monaco, monospace",
            theme: { background: "#000", foreground: "#00ff00" },
        });
        setTerm(terminal);

        return () => {
            terminal.dispose();
        };
    }, []);

    useEffect(() => {
        if (term && terminalRef.current) {
            term.open(terminalRef.current);
            term.write("Welcome to Remote terminal...\r\n> ");
            let commandBuffer = "";

            term.onData((data) => {
                const char = data.charCodeAt(0);
                if (char === 13) { // Enter key
                    term.write("\r\n");
                    executeCommand(commandBuffer);
                    commandBuffer = "";
                } else if (char === 127) { // Backspace key
                    if (commandBuffer.length > 0) {
                        commandBuffer = commandBuffer.slice(0, -1);
                        term.write("\b \b");
                    }
                } else {
                    commandBuffer += data;
                    term.write(data);
                }
            });
        }
    }, [term]);

    useEffect(() => {
        if (!socket) return;

        socket.on("command-execution-result", (data) => {
            if (term) {
                term.write(data);
            }
        });

        return () => {
            socket.off("command-execution-result");
        };
    }, [socket, term]);

    const executeCommand = (command) => {
        if(!term){
            alert("No term");
            return;
        }
        if (!command.trim()) return;
        if(command.trim() === "clear"){
            term.clear();
            term.write("Welcome to Remote terminal...\r\n> ");
            return;
        }
        if (!socket.id) {
            term.write("Not connected with UTM\r\n> ");
            return;
        }
        socket.emit("execute-command", command.trim());
    };

    return <div ref={terminalRef} style={{ width: "100%", height: "500px", backgroundColor: "black" }} />;
};

export default LinuxTerminal;
