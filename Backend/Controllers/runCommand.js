// const process = require('node:process');

module.exports.runCommand = (command, res) => {
    exec(command, (error, stdout, stderr) => {
        if(error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }
        return res.status(200).json({ message: stdout.trim() });
    })
}