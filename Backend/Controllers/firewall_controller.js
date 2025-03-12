// const process = require('node:process');
const { runCommand } = require('./runCommand');

// Starting firewall

module.exports.startFirewall = (req, res) => {
    runCommand('sudo systemctl unmask firewalld', res);
    runCommand('sudo systemctl start firewalld', res);
}

module.exports.startFirewallAtSystemStart = (req, res) => {
    runCommand('sudo systemctl unmask firewalld', res);
    runCommand('sudo systemctl start firewalld', res);
    runCommand('sudo systemctl enable firewalld', res);
}

// Stopping firewall

module.exports.stopFirewall = (req, res) => {
    runCommand('sudo systemctl stop firewalld', res);
    runCommand('sudo systemctl mask firewalld', res);
}

module.exports.stopFirewallAtSystemStart = (req, res) => {
    runCommand('sudo systemctl stop firewalld', res);
    runCommand('sudo systemctl disable firewalld', res);
    runCommand('sudo systemctl mask firewalld', res);
}

// getting status of firewall

module.exports.getStatusFirewall = (req, res) => {
    runCommand('sudo firewall-cmd --state', res);
}

module.exports.getDetailStatusFirewall = (req, res) => {
    runCommand('sudo systemctl status firewalld', res);
}

module.exports.checkConfigFirewall = (req, res) => {
    runCommand('sudo firewall-cmd --check-config', res);
}

// firewall runtime and permanent configuration

module.exports.runtimeConfig = (req, res) => {
    runCommand('sudo firewall-cmd --runtime-to-permanent', res);
}

// Reload firewall

module.exports.reloadFirewall = (req, res) => {
    const { reload } = req.body;
    runCommand(`sudo firewall-cmd --${reload}`, res);
}