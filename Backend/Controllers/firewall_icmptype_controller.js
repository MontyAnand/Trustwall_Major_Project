const { runCommand } = require('./runCommand')
const { reloadFirewall } = require('./firewall_controller');

// icmptype information

module.exports.getICMPTypes = (req, res) => {
    runCommand('sudo firewall-cmd --get-icmptypes', res);
}

module.exports.getICMPType = (req, res) => {
    const { icmptype } = req.body;
    const cmd = `sudo firewall-cmd --info-icmptype=${icmptype}`;
    runCommand(cmd, res);
}

module.exports.loadDefaultSettingsICMPType = (req, res) => {
    const { icmptype } = req.body;
    const cmd = `sudo firewall-cmd --permanent --load-icmptype-defaults=${icmptype}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.getPathICMPType = (req, res) => {
    const { icmptype } = req.body;
    const cmd = `sudo firewall-cmd --permanent --path-icmptype=${icmptype}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// description

module.exports.getDescription = (req, res) => {
    const { icmptype } = req.body;
    const cmd = `sudo firewall-cmd --permanent --icmptype=${icmptype} --get-description`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.setDescription = (req, res) => {
    const { icmptype, description } = req.body;
    const cmd = `sudo firewall-cmd --permanent --icmptype=${icmptype} --set-description=${description}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// short

module.exports.getShort = (req, res) => {
    const { icmptype } = req.body;
    const cmd = `sudo firewall-cmd --permanent --icmptype=${icmptype} --get-short`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.setShort = (req, res) => {
    const { icmptype, short } = req.body;
    const cmd = `sudo firewall-cmd --permanent --icmptype=${icmptype} --set-short=${short}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// destinations

module.exports.getDestinations = (req, res) => {
    const { icmptype } = req.body;
    const cmd = `sudo firewall-cmd --permanent --icmptype=${icmptype} --get-destinations`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryDestination = (req, res) => {
    const { icmptype, ipv } = req.body;
    const cmd = `sudo firewall-cmd --permanent --icmptype=${icmptype} --query-destination=${ipv}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addDestination = (req, res) => {
    const { icmptype, ipv } = req.body;
    const cmd = `sudo firewall-cmd --permanent --icmptype=${icmptype} --add-destination=${ipv}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeDestination = (req, res) => {
    const { icmptype, ipv } = req.body;
    const cmd = `sudo firewall-cmd --permanent --icmptype=${icmptype} --remove-destination=${ipv}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// create new icmptype

module.exports.newICMPType = (req, res) => {
    const { icmptype } = req.body;
    const cmd = `sudo firewall-cmd --permanent --new-icmptype=${icmptype}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.newICMPTypeFromFile = (req, res) => {
    const {icmptype, filename } = req.body;
    var cmd = `sudo firewall-cmd --permanent --new-icmptype-from-file=${filename}`;
    if(icmptype) cmd += ` --name=${icmptype}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// delete icmptype

module.exports.deleteICMPType = (req, res) => {
    const { icmptype } = req.body;
    const cmd = `sudo firewall-cmd --permanent --delete-icmptype=${icmptype}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}