// const process = require('node:process')
const { runCommand } = require('./runCommand')
const { reloadFirewall } = require('./firewall_controller');

// ipset information

module.exports.getIPSets = (req, res) => {
    runCommand('sudo firewall-cmd --get-ipsets', res);
}

module.exports.getIPSet = (req, res) => {
    const { ipset } = req.body;
    const cmd = `sudo firewall-cmd --info-ipset=${ipset}`;
    runCommand(cmd, res);
}

module.exports.getIPSetTypes = (req, res) => {
    runCommand('sudo firewall-cmd --get-ipset-types', res);
}

module.exports.loadDefaultSettingsIPSet = (req, res) => {
    const { ipset } = req.body;
    const cmd = `sudo firewall-cmd --permanent --load-ipset-defaults=${ipset}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.getPathIPSet = (req, res) => {
    const { ipset } = req.body;
    const cmd = `sudo firewall-cmd --permanent --path-ipset=${ipset}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// description

module.exports.getDescription = (req, res) => {
    const { ipset } = req.body;
    const cmd = `sudo firewall-cmd --permanent --ipset=${ipset} --get-description`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.setDescription = (req, res) => {
    const { ipset, description } = req.body;
    const cmd = `sudo firewall-cmd --permanent --ipset=${ipset} --set-description=${description}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// short

module.exports.getShort = (req, res) => {
    const { ipset } = req.body;
    const cmd = `sudo firewall-cmd --permanent --ipset=${ipset} --get-short`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.setShort = (req, res) => {
    const { ipset, short } = req.body;
    const cmd = `sudo firewall-cmd --permanent --ipset=${ipset} --set-short=${short}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// entry

module.exports.getEntries = (req, res) => {
    const { ipset } = req.body;
    const cmd = `sudo firewall-cmd --permanent --ipset=${ipset} --get-entries`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryEntry = (req, res) => {
    const { ipset, entry } = req.body;
    const cmd = `sudo firewall-cmd --permanent --ipset=${ipset} --query-entry=${entry}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addEntry = (req, res) => {
    const { ipset, entry } = req.body;
    const cmd = `sudo firewall-cmd --permanent --ipset=${ipset} --add-entry=${entry}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeEntry = (req, res) => {
    const { ipset, entry } = req.body;
    const cmd = `sudo firewall-cmd --permanent --ipset=${ipset} --remove-entry=${entry}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// entry from file

module.exports.addEntriesFromFile = (req, res) => {
    const { ipset, filename } = req.body;
    const cmd = `sudo firewall-cmd --permanent --ipset=${ipset} --add-entries-from-file=${filename}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeEntriesFromFile = (req, res) => {
    const { ipset, filename } = req.body;
    const cmd = `sudo firewall-cmd --permanent --ipset=${ipset} --remove-entries-from-file=${filename}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// create new ipset

module.exports.newIPSet = (req, res) => {
    const { ipset, type, family, option } = req.body;
    var cmd = `sudo firewall-cmd --permanent --new-ipset=${ipset} --type=${type}`;
    if(family) cmd += ` --family=${family}`;
    if(option) {
        Object.entries(option).forEach(([key, value]) => {
            if(value) cmd += ` --option=${key}=${value}`;
            else cmd += ` --option=${key}`;
        })
    }
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.newIPSetFromFile = (req, res) => {
    const { ipset, filename } = req.body;
    var cmd = `sudo firewall-cmd --permanent --new-ipset-from-file=${filename}`;
    if(ipset) cmd += ` --name=${ipset}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// delete ipset

module.exports.deleteIPSet = (req, res) => {
    const { ipset } = req.body;
    const cmd = `sudo firewall-cmd --permanent --delete-ipset=${ipset}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}