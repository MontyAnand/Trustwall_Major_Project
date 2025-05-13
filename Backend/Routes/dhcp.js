const { Router } = require('express');
const bodyParser = require("body-parser");
const macaddress = require('macaddress');
const fs = require('fs');
const crypto = require('crypto');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const app = Router();

let dhcpSettings = '';
// let dhnextID = 1;
let staticMappings = [];
let stnextId = 1;
// This part is to manage DHCP configuration

// Middleware to parse JSON bodies
app.use(bodyParser.json());


// Function to generate DHCP configuration
function generateDhcpConfig() {
    let configLines = [];

    configLines.push(`# dhcpd.conf
#
# Sample configuration file for ISC dhcpd
#

# option definitions common to all supported networks...
option domain-name "example.org";
option domain-name-servers ns1.example.org, ns2.example.org;

default-lease-time 600;
max-lease-time 7200;

# The ddns-updates-style parameter controls whether or not the server will
# attempt to do a DNS update when a lease is confirmed. We default to the
# behavior of the version 2 packages ('none', since DHCP v2 didn't
# have support for DDNS.)
ddns-update-style none;

# If this DHCP server is the official DHCP server for the local
# network, the authoritative directive should be uncommented.
#authoritative;

# Use this to send dhcp log messages to a different log file (you also
# have to hack syslog.conf to complete the redirection).
#log-facility local7;\n`);

    if (dhcpSettings.omapiPort && dhcpSettings.omapiKey) {
        configLines.push(`
# Enable OMAPI on port ${dhcpSettings.omapiPort}
omapi-port ${dhcpSettings.omapiPort};

# Optional: Secure with authentication key
key omapi_key {
    algorithm HMAC-MD5;
    secret "${dhcpSettings.omapiKey}";
};

`);
    }

    if (dhcpSettings.enableChangeTimeFormat === true) {
        configLines.push(`# This will change time format from UTC to Local in DHCP lease file`);
        configLines.push(`db-time-format local;`);
        configLines.push(`\n`);
    }

    if (dhcpSettings.enableBootp === true) {
        configLines.push(`# This will ignore all BOOTP queries coming to the server`);
        configLines.push(`ignore bootp;`);
        configLines.push(`\n`);
    }

    if (dhcpSettings.clientType === 1) {
        configLines.push(`# This will not allow any Unknown DHCP clients from any staticMappings`);
        configLines.push(`deny unknown-clients;`);
        configLines.push(`\n`);
    }

    if (dhcpSettings.enableIgnClientIdentifier === true) {
        configLines.push(`# This will not record any UID for a specific client, only record MAC address in client's lease data`);
        configLines.push(`ignore client-updates;`);
        configLines.push(`\n`);
    }

    if (dhcpSettings.enableStaticArp === true) {
        configLines.push(`# This will force the system to keep static ARP entries.Clients must mactch ARP entries to get a IP`);
        configLines.push(`option arp-cache-timeout 0;`);
        configLines.push(`\n`);
    }

    if (dhcpSettings.enablePingCheck === true) {
        configLines.push(`# This will disable ping check for a  IP address `);
        configLines.push(`ping-check false;`);
        configLines.push(`ping-timeout ${dhcpSettings.pingTimeout};`);
    }

    if (dhcpSettings.subnet && dhcpSettings.mask) {
        configLines.push(`\n
# Subnet Specific Configuration
`);

        configLines.push(`subnet ${dhcpSettings.subnet} netmask ${dhcpSettings.mask} {`);

        if (dhcpSettings.rangeStart && dhcpSettings.rangeEnd) {
            configLines.push(`  range ${dhcpSettings.rangeStart} ${dhcpSettings.rangeEnd};`);
        }
        if (dhcpSettings.dns0 || dhcpSettings.dns1 || dhcpSettings.dns2 | dhcpSettings.dns3) {
            configLines.push(`  option domain-name-servers ${dhcpSettings.dns0 ? dhcpSettings.dns0 : ''} ${dhcpSettings.dns1 ? ', ' + dhcpSettings.dns1 : ''} ${staticMappings.dns2 ? ', ' + staticMappings.dns2 : ''} ${staticMappings.dns3 ? ', ' + staticMappings.dns3 : ''};`);
        }

        if (dhcpSettings.domainName) {
            configLines.push(`  option domain-name "${dhcpSettings.domainName}";`);
        }

        if (dhcpSettings.domainSearchList) {
            configLines.push(`  option domain-search "${dhcpSettings.domainSearchList}";`);
        }

        if (dhcpSettings.gateway) {
            configLines.push(`  option routers ${dhcpSettings.gateway};`);
        }

        if (dhcpSettings.wins1 || dhcpSettings.wins2) {
            configLines.push(`  option netbios-name-servers ${dhcpSettings.wins1 ? dhcpSettings.wins1 : ''} ${dhcpSettings.wins2 ? ', ' + dhcpSettings.wins2 : ''};`);
        }


        if (dhcpSettings.defaultLeaseTime) {
            configLines.push(`  default-lease-time ${dhcpSettings.defaultLeaseTime};`);
        }

        if (dhcpSettings.maxLeaseTime) {
            configLines.push(`  max-lease-time ${dhcpSettings.maxLeaseTime};`);
        }

        configLines.push("}\n\n"); // Close subnet block
    }

    if (staticMappings.length > 0) {
        staticMappings.map((staticMapping) => {
            configLines.push(`

host ${staticMapping.hostname} {
  hardware ethernet ${staticMapping.macAddress} ;
  fixed-address ${staticMapping.ipAddress};
}
`);
        });
    }
    return configLines.join("\n");
}




const getInterface = (iface) => {
    const path = `/tmp/${iface}`;
    try {
        return fs.readFileSync(path, 'utf8');
    }
    catch (err) {
        console.log(err);
        return "";
    }
};


function generateDefaultConfig(){
    const iface=getInterface("LAN");
    return `# Defaults for isc-dhcp-server (sourced by /etc/init.d/isc-dhcp-server)

# Path to dhcpd's config file (default: /etc/dhcp/dhcpd.conf).
#DHCPDv4_CONF=/etc/dhcp/check.conf
#DHCPDv6_CONF=/etc/dhcp/dhcpd6.conf

# Path to dhcpd's PID file (default: /var/run/dhcpd.pid).
#DHCPDv4_PID=/var/run/dhcpd.pid
#DHCPDv6_PID=/var/run/dhcpd6.pid

# Additional options to start dhcpd with.
#       Don't use options -cf or -pf here; use DHCPD_CONF/ DHCPD_PID instead
#OPTIONS=""

# On what interfaces should the DHCP server (dhcpd) serve DHCP requests?
#       Separate multiple interfaces with spaces, e.g. "eth0 eth1".
INTERFACESv4="${iface}"
#INTERFACESv6=""

`;
}

app.get("/api/settings", (req, res) => {
    res.json(dhcpSettings);
});

app.get("/api/settings/:id", (req, res) => {
    const found = interfaces.find((i) => i.id == req.params.id);
    found ? res.json(found) : res.status(404).json({ error: "Not found" });
});


// Define the backend route
app.post('/save', async function (req, res) {
    // const newEntry = { ...req.body, id: dhnextID++ };
    // dhcp_settings.push(newEntry);
    dhcpSettings = req.body;
    // Write data to a file
    const dhcpFilePath = "/etc/dhcp/dhcpd.conf";
    const tempFilePath = "/etc/dhcp/temp.conf";
    const dhcpConfig = generateDhcpConfig();
    const defaultConfig=generateDefaultConfig();
    //Configuration Syntax check
    try {
        fs.writeFile(tempFilePath, dhcpConfig, function (err) {
            if (err) {
                console.error('Error writing to file:', err);
                res.status(500).send({ message: 'Error writing to file' });
            }
        });
        const { stderr } = await execAsync(`dhcpd -t -cf ${tempFilePath} && rm ${tempFilePath}`);
        // Writing to file after syntaxcheck
        fs.writeFile(dhcpFilePath, dhcpConfig, function (err) {
            if (err) {
                console.error('Error writing to file:', err);
                res.status(500).send({ message: 'Error writing to file' });
            } else {
                fs.writeFile('/etc/default/isc-dhcp-server',defaultConfig,function(err){
                    if(err){
                        console.error('Error writing to file:', err);
                        res.status(500).send({ message: 'Error writing to file' });
                    }
                })
                console.log('DHCP configuration Data is saved to a file location ', dhcpFilePath);
                res.send({ message: 'DHCP Data is saved successfully.' });
            }
        });
    }
    catch (err) {
        console.error('Syntax Error', err);
        res.status(500).send({ message: `${err}` });
    }
});

app.delete("/api/settings/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = interfaces.findIndex((i) => i.id === id);
    if (index !== -1) {
        interfaces.splice(index, 1);
        res.json({ message: "Deleted successfully" });
    } else {
        res.status(404).json({ error: "Not found" });
    }
});



// Checking backend service's status
app.post('/status', async (req, res) => {
    // Check the status
    let status = "unknown";
    try {
        const { stdout } = await execAsync(`systemctl is-failed isc-dhcp-server`);
        status = stdout.trim();
    } catch (error) {
        // If is-failed gives non-zero, we still want the output
        status = error.stdout ? error.stdout.trim() : 'failed';
    }
    res.json(status);
});


// Executing System services by command
app.post('/service', async (req, res) => {
    const action = req.body.action;

    try {
        const { stdout, stderr } = await execAsync(`systemctl ${action} isc-dhcp-server`);

        if (stderr) {
            console.error(`❗stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        res.json({ message: '✅ Command Executed Successfully', output: stdout });
    } catch (error) {
        console.error(`❌ Command failed:`, error);
        res.status(500).json({
            error: '❌ Failed to execute command',
            details: error.message,
        });
    }
});


// For handling OMAPI key generation

//  function to return the selected algorithm
function getAlgorithm(algorithmName) {
    switch (algorithmName) {
        case '1':
            return "md5";
        case '2':
            return "sha1";
        default:
            throw new Error('Unsupported algorithm');
    }
}
// Endpoint to generate key using selected algorithm
app.post('/generateKey', (req, res) => {
    const key = "sujit";
    try {
        const algorithmName = req.body.omapialgo;
        const algorithm = getAlgorithm(algorithmName);
        const hmac_key = crypto.createHmac(algorithm, key).digest('hex');
        res.status(200).send({ hmac_key });
    } catch (error) {
        res.status(500).send("Error in generation of key");
    }
});


// Endpoint to store Static Mappings data

app.get("/staticMappings", (req, res) => {
    res.json(staticMappings);
});

app.get("/staticMappings/:id", (req, res) => {
    const found = staticMappings.find((i) => i.id == req.params.id);
    found ? res.json(found) : res.status(404).json({ error: "Not found" });
});

function appendHostConfig() {
    const config = [];

    if (staticMappings.length > 0) {
        staticMappings.map((staticMap) => {
            config.push(`\n
host ${staticMap.hostname} {
    hardware ethernet ${staticMap.macAddress};
    fixed-address ${staticMap.ipAddress};
}
                
`);
        })
    }
    return config.join('\n');
}

app.post('/staticMappings', async (req, res) => {
    const newEntry = { ...req.body, id: stnextId++ };
    staticMappings.push(newEntry);
    // Write data to a file
    const dhcpFilePath = "/etc/dhcp/dhcpd.conf";
    const tempFilePath = "./temp.conf";
    const dhcpConfig = generateDhcpConfig();
    //Configuration Syntax check
    try {
        fs.writeFile(tempFilePath, dhcpConfig, function (err) {
            if (err) {
                console.error('Error writing to file:', err);
                res.status(500).send({ message: 'Error writing to file' });
            }
        });
        const { stderr } = await execAsync(`dhcpd -t -cf ${tempFilePath}`);
        // Writing to file after syntaxcheck
        fs.writeFile(dhcpFilePath, dhcpConfig, function (err) {
            if (err) {
                console.error('Error writing to file:', err);
                res.status(500).send({ message: 'Error writing to file' });
            } else {
                console.log('DHCP configuration Data is saved to a file location ', dhcpFilePath);
                res.send({ message: 'DHCP Data is saved successfully.' });
            }
        });
    }
    catch (err) {
        console.error('Syntax Error', err);
        res.status(500).send({ message: `${err}` });
    }
});


app.put("/staticMappings/:id", async (req, res) => {
    const index = staticMappings.findIndex((i) => i.id == req.params.id);
    if (index !== -1) {
        const prestaticMapping = staticMappings[index];
        if (JSON.stringify(req.body) !== JSON.stringify(prestaticMapping)) {
            staticMappings[index] = { ...req.body, id: staticMappings[index].id };
            // Write data to a file
            const dhcpFilePath = "/etc/dhcp/dhcpd.conf";
            const tempFilePath = "./temp.conf";
            const dhcpConfig = generateDhcpConfig();
            //Configuration Syntax check
            try {
                fs.writeFile(tempFilePath, dhcpConfig, function (err) {
                    if (err) {
                        console.error('Error writing to file:', err);
                        res.status(500).send({ message: 'Error writing to file' });
                    }
                });
                const { stderr } = await execAsync(`dhcpd -t -cf ${tempFilePath}`);
                // Writing to file after syntaxcheck
                fs.writeFile(dhcpFilePath, dhcpConfig, function (err) {
                    if (err) {
                        console.error('Error writing to file:', err);
                        res.status(500).send({ message: 'Error writing to file' });
                    } else {
                        console.log('DHCP configuration Data is saved to a file location ', dhcpFilePath);
                        res.send({ message: 'DHCP Data is saved successfully.' });
                    }
                });
            }
            catch (err) {
                console.error('Syntax Error', err);
                res.status(500).send({ message: `${err}` });
            }
        }
        res.json(staticMappings[index]);
    } else {
        res.status(404).json({ error: "Not found" });
    }
});

app.delete("/staticMappings/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = staticMappings.findIndex((i) => i.id === id);
    if (index !== -1) {
        staticMappings.splice(index, 1);
        res.json({ message: "Deleted successfully" });
    } else {
        res.status(404).json({ error: "Not found" });
    }
});

app.post("/staticMappings/myMacAddress", (req, res) => {

    macaddress.one((err, mac) => {
        if (err) {
            console.error('Error fetching MAC address:', err);
            return res.status(500).json({ error: 'Unable to get MAC address' });
        }

        res.json({ macAddress: mac });
    });
});

module.exports = app;