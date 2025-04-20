const { Router } = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const crypto = require('crypto');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const app = Router();


// This part is to manage DHCP configuration

// Middleware to parse JSON bodies
app.use(bodyParser.json());


// Function to generate DHCP configuration
function generateDhcpConfig(data) {
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

    if (data.Omapi_port && data.Omapi_key) {
        configLines.push(`
# Enable OMAPI on port ${data.Omapi_port}
omapi-port ${data.Omapi_port};

# Optional: Secure with authentication key
key omapi_key {
    algorithm HMAC-MD5;
    secret "${data.Omapi_key}";
};

`);
    }

    if (data.Dhcp_lease_time_format_UTC_to_Local_enable === true) {
        configLines.push(`# This will change time format from UTC to Local in DHCP lease file`);
        configLines.push(`db-time-format local;`);
        configLines.push(`\n`);
    }

    if (data.Bootp_enable === true) {
        configLines.push(`# This will ignore all BOOTP queries coming to the server`);
        configLines.push(`ignore bootp;`);
        configLines.push(`\n`);
    }

    if (data.Deny_unknown_clients === 1) {
        configLines.push(`# This will not allow any Unknown DHCP clients from any interface`);
        configLines.push(`deny unknown-clients;`);
        configLines.push(`\n`);
    }

    if (data.Ignore_client_identifier === true) {
        configLines.push(`# This will not record any UID for a specific client, only record MAC address in client's lease data`);
        configLines.push(`ignore client-updates;`);
        configLines.push(`\n`);
    }

    if (data.Static_arp_entries_enable === true) {
        configLines.push(`# This will force the system to keep static ARP entries.Clients must mactch ARP entries to get a IP`);
        configLines.push(`option arp-cache-timeout 0;`);
        configLines.push(`\n`);
    }

    if (data.Ping_check_disable === true) {
        configLines.push(`# This will disable ping check for a  IP address `);
        configLines.push(`ping-check false;`);
        configLines.push(`ping-timeout ${data.Ping_check_timeout};`);
    }

    if (data.Subnet && data.Subnet_mask) {
        configLines.push(`\n
# Subnet Specific Configuration
`);

        configLines.push(`subnet ${data.Subnet} netmask ${data.Subnet_mask} {`);

        if (data.StartIP && data.EndIP) {
            configLines.push(`  range ${data.StartIP} ${data.EndIP};`);
        }
        if (data.Dns0 || data.Dns1 || data.Dns2 | data.Dns3) {
            configLines.push(`  option domain-name-servers ${data.Dns0 ? data.Dns0 : ''} ${data.Dns1 ? ', ' + data.Dns1 : ''} ${data.Dns2 ? ', ' + data.Dns2 : ''} ${data.Dns3 ? ', ' + data.Dns3 : ''};`);
        }

        if (data.Domain_name) {
            configLines.push(`  option domain-name "${data.Domain_name}";`);
        }

        if (data.Domain_search_list) {
            configLines.push(`  option domain-search "${data.Domain_search_list}";`);
        }

        if (data.Gateway) {
            configLines.push(`  option routers ${data.Gateway};`);
        }

        if (data.Wins1 || data.Wins2) {
            configLines.push(`  option netbios-name-servers ${data.Wins1 ? data.Wins1 : ''} ${data.Wins2 ? ', ' + data.Wins2 : ''};`);
        }


        if (data.Default_lease_time) {
            configLines.push(`  default-lease-time ${data.Default_lease_time};`);
        }

        if (data.Maximum_lease_time) {
            configLines.push(`  max-lease-time ${data.Maximum_lease_time};`);
        }

        configLines.push("}"); // Close subnet block
    }

    return configLines.join("\n");
}


// Define the backend route
app.post('/save', function (req, res) {
    const data = req.body;
    // Write data to a file
    const dhcpFilePath = "/etc/dhcp/dhcpd.conf";
    const dhcpConfig = generateDhcpConfig(data);
    fs.writeFile(dhcpFilePath, dhcpConfig, function (err) {
        if (err) {
            console.error('Error writing to file:', err);
            res.status(500).send({ message: 'Error writing to file' });
        } else {
            console.log('DHCP configuration Data is saved to a file location ', dhcpFilePath);
            res.send({ message: 'DHCP Data is saved successfully.' });
        }
    });
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
    const  action  = req.body.action;

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

module.exports = app;