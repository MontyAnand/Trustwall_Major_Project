
const startSuricata = (res) => {
    const command = `systemctl daemon-reload && systemctl start suricata-${interfaces[index].interface}.service`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠ STDERR: ${stderr}`);
            return;
        }
    });
}

// For starting a service
app.post("/api/interface/start/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = interfaces.findIndex((i) => i.id === id);

    if (index !== -1) {
        const command = `systemctl daemon-reload && systemctl start suricata-${interfaces[index].interface}.service`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`⚠ STDERR: ${stderr}`);
                return;
            }
            exec(`systemctl is-active suricata-${interfaces[index].interface}.service`, (error, stdout, stderr) => {
                const status = stdout.trim();
                if (error) {
                    console.log(`suricata-${interfaces[index].interface}.service is not active or not found`);
                    return;
                }
                if (stderr) {
                    console.error(`⚠ STDERR: ${stderr}`);
                    return;
                }
                interfaces[index].status = status;
                console.log(`suricata-${interfaces[index].interface}.service status : ${status}`);
                console.log(`✅ Suricata service on ${interfaces[index].interface} on nfqueue ${interfaces[index].queue} has started:\n${stdout}`);
                res.json(interfaces);
            });

        });
    } else {
        res.status(404).json({ error: "Not found" });
    }
});