const process = require('node:process')
const { runCommand } = require('./runCommand')
const { reloadFirewall } = require('./firewall_controller');

// service information

module.exports.getServices = (req, res) => {
    runCommand('sudo firewall-cmd --get-services', res);
}

module.exports.getService = (req, res) => {
    const { service } = req.body;
    const cmd = `sudo firewall-cmd --info-service=${service}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.loadDefaultSettingsService = (req, res) => {
    const { service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --load-service-defaults=${service}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.getPathService = (req, res) => {
    const { service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --path-service=${service}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// description

module.exports.getDescription = (req, res) => {
    const { service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --get-description`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.setDescription = (req, res) => {
    const { service, description } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --set-description=${description}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// short

module.exports.getShort = (req, res) => {
    const { service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --get-short`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.setShort = (req, res) => {
    const { service, short } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --set-short=${short}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// ports

module.exports.getPorts = (req, res) => {
    const { service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --get-ports`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryPort = (req, res) => {
    const { service, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --query-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addPort = (req, res) => {
    const { service, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --add-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removePort = (req, res) => {
    const { service, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --remove-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// protocols

module.exports.getProtocols = (req, res) => {
    const { service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --get-protocols`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryProtocol = (req, res) => {
    const { service, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --query-protocol=${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addProtocol = (req, res) => {
    const { service, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --add-protocol=${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeProtocol = (req, res) => {
    const { service, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --remove-protocol=${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// source ports

module.exports.getSourcePorts = (req, res) => {
    const { service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --get-source-ports`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.querySourcePort = (req, res) => {
    const { service, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --query-source-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addSourcePort = (req, res) => {
    const { service, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --add-source-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeSourcePort = (req, res) => {
    const { service, port, protocol } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --remove-source-port=${port}/${protocol}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// helpers

module.exports.getServiceHelpers = (req, res) => {
    const { service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --get-service-helpers`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryHelper = (req, res) => {
    const { service, helper } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --query-helper=${helper}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addHelper = (req, res) => {
    const { service, helper } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --add-helper=${helper}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeHelper = (req, res) => {
    const { service, helper } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --remove-helper=${helper}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// destinations

module.exports.getDestinations = (req, res) => {
    const { service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --get-destinations`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryDestination = (req, res) => {
    const { service, ipv, destinationAddress } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --query-destination=${ipv}:${destinationAddress}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.setDestination = (req, res) => {
    const { service, ipv, destinationAddress } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --set-destination=${ipv}:${destinationAddress}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeDestination = (req, res) => {
    const { service, ipv } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --remove-destination=${ipv}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// includes

module.exports.getIncludes = (req, res) => {
    const { service } = req.body;
    const cmd  = `sudo firewall-cmd --permanent --service=${service} --get-includes`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.queryInclude = (req, res) => {
    const { service, service1 } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --query-include=${service1}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.addInclude = (req, res) => {
    const { service, service1 } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --add-include=${service1}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.removeInclude = (req, res) => {
    const { service, service1 } = req.body;
    const cmd = `sudo firewall-cmd --permanent --service=${service} --remove-include=${service1}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// create new service

module.exports.newService = (req, res) => {
    const { service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --new-service=${service}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

module.exports.newServiceFromFile = (req, res) => {
    const { service, filename } = req.body;
    var cmd = `sudo firewall-cmd --permanent --new-service-from-file=${filename}`;
    if(service) cmd += ` --name=${service}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}

// delete service

module.exports.deleteService = (req, res) => {
    const { service } = req.body;
    const cmd = `sudo firewall-cmd --permanent --delete-service=${service}`;
    runCommand(cmd, res);
    req.body.reload = 'reload';
    reloadFirewall(req, res);
}