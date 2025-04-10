const { generateID, runCommand, getHandle, deleteRule } = require('../utility/firewallUtility');
const { getAllRows, addRuleToForwardTABLE, deleteRowByPrimaryKey, updateRuleToForwardTABLE } = require('../Database/db_controllers')

module.exports.getForwardRules = (req, res) => {
    const data = getAllRows('FORWARD');
    res.status(200).send(data);
}

module.exports.addForwardRule = (req, res) => {
    if (!req.body.DPORT) {
        res.status(400).send({ 'error': 'Destination Port is required' });
        return;
    }
    if (!req.body.REDIRECT_IP) {
        res.status(400).send({ 'error': 'Redirected IP is required' });
        return;
    }
    if (!req.body.REDIRECT_PORT) {
        res.status(400).send({ 'error': 'Redirected Port is required' });
        return;
    }
    if (!req.body.INTERFACE) {
        res.status(400).send({ 'error': 'Interface is required' });
        return;
    }
    if (!req.body.PROTOCOL) {
        req.body.PROTOCOL = 'tcp';
    }
    if (req.body.SADDR_TYPE){
        if(!req.body.SMASK){
            req.body.SMASK = 32;
        }
    }
    let command = `sudo nft add rule ip USER_TABLE REDIRECT iifname "${req.body.INTERFACE}" `;

    if (req.body.SADDR_TYPE === "SET" && req.body.SADDR) { // if SADDRType === 0 then SADDR is single IP, if SADDRType === 1, SADDR is a Set
        command = command + `ip saddr @${req.body.SADDR} `
    }
    else if (req.body.SADDR_TYPE === "IP" && req.body.SADDR) {
        command = command + `ip saddr ${req.body.SADDR}/${req.body.SMASK} `;
    }

    command = command + `${req.body.PROTOCOL} dport ${req.body.DPORT} dnat to ${req.body.REDIRECT_IP}:${req.body.REDIRECT_PORT} `;

    const ID = generateID();
    command = command + `comment "${ID}"`;
    const success = runCommand(command);

    if (success) {
        req.body.ID = ID;
        addRuleToForwardTABLE(req.body);
        res.status(200).send({ 'status': true });
    }
    else {
        res.status(500).send({ 'status': false });
    }
}

module.exports.updateForwardRule = (req, res) => {
    if (!req.body.DPORT) {
        res.status(400).send({ 'error': 'Destination Port is required' });
        return;
    }
    if (!req.body.REDIRECT_IP) {
        res.status(400).send({ 'error': 'Redirected IP is required' });
        return;
    }
    if (!req.body.REDIRECT_PORT) {
        res.status(400).send({ 'error': 'Redirected Port is required' });
        return;
    }
    if (!req.body.ID) {
        res.status(400).send({ 'error': 'ID is requied' });
        return;
    }
    if (!req.body.PROTOCOL) {
        req.body.PROTOCOL = 'tcp';
    }

    const handle = getHandle(req.body.ID);
    if (handle == -1) {
        res.status(400).send({ 'error': 'Invalid ID' });
        return;
    }

    const isDeleted = deleteRule('ip', 'USER_TABLE', 'REDIRECT', handle);
    if (!isDeleted) {
        res.status(500).send({ 'success': false });
        return;
    }

    let command = `sudo nft add rule ip USER_TABLE REDIRECT iifname "${req.body.INTERFACE}" `;

    if (req.body.SADDR_TYPE === "SET" && req.body.SADDR) { // if SADDRType === 0 then SADDR is single IP, if SADDRType === 1, SADDR is a Set
        command = command + `ip saddr @${req.body.SADDR} `
    }
    else if (req.body.SADDR_TYPE === "IP" && req.body.SADDR) {
        command = command + `ip saddr ${req.body.SADDR}/${req.body.SMASK} `;
    }

    command = command + `${req.body.PROTOCOL} dport ${req.body.DPORT} dnat to ${req.body.REDIRECT_IP}:${req.body.REDIRECT_PORT} `;
    command = command + `comment "${req.body.ID}"`;

    const success = runCommand(command);

    if (success) {
        // Update rule in DB with respect to ID
        updateRuleToForwardTABLE(req.body);
        res.status(200).send({ 'status': true });
    }
    else {
        res.status(500).send({ 'status': false });
    }
}

module.exports.deleteForwardRule = (req, res) => {
    const { ID } = req.query;
    if (!ID) {
        res.status(400).send({ 'error': 'ID is required' });
        return;
    }
    const handle = getHandle(ID);
    if (handle == -1) {
        res.status(400).send({ 'error': 'Invalid ID' });
        return;
    }
    const isDeleted = deleteRule('ip', 'USER_TABLE', 'REDIRECT', handle);
    if (isDeleted) {
        deleteRowByPrimaryKey('FORWARD', 'ID', ID);
        res.status(200).send({ 'success': true });
    }
    else {
        res.status(500).send({ 'success': false });
    }
}