const { generateID, runCommand, getHandle, deleteRule } = require('../utility/firewallUtility');
const { getAllRows, addRuleToForwardTABLE, deleteRowByPrimaryKey, updateRuleToForwardTABLE } = require('../Database/db_controllers')

module.exports.getForwardRules = (req, res) => {
    const data = getAllRows('FORWARD');
    res.status(200).send(data);
}

module.exports.addForwardRule = (req, res) => {
    if (!req.body.dport) {
        res.status(400).send({ 'error': 'Destination Port is required' });
        return;
    }
    if (!req.body.redirectedIP) {
        res.status(400).send({ 'error': 'Redirected IP is required' });
        return;
    }
    if (!req.body.redirectedPORT) {
        res.status(400).send({ 'error': 'Redirected Port is required' });
        return;
    }
    if (!req.body.interface) {
        res.status(400).send({ 'error': 'Inteerface is required' });
        return;
    }
    if (!req.body.protocol) {
        req.body.protocol = 'tcp';
    }
    if (req.body.saddrType){
        if(!req.body.mask){
            req.body.mask = 32;
        }
    }
    let command = `sudo nft add rule ip USER_TABLE REDIRECT iifname "${req.body.interface}" `;

    if (req.body.saddrType === "SET") { // if saddrType === 0 then saddr is single IP, if saddrType === 1, saddr is a Set
        command = command + `ip saddr @${req.body.saddr} `
    }
    else if (req.body.saddrType === "IP") {
        command = command + `ip saddr ${req.body.saddr}/${req.body.mask} `;
    }

    command = command + `${req.body.protocol} dport ${req.body.dport} dnat to ${req.body.redirectedIP}:${req.body.redirectedPORT} `;

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
    if (!req.body.dport) {
        res.status(400).send({ 'error': 'Destination Port is required' });
        return;
    }
    if (!req.body.redirectedIP) {
        res.status(400).send({ 'error': 'Redirected IP is required' });
        return;
    }
    if (!req.body.redirectedPORT) {
        res.status(400).send({ 'error': 'Redirected Port is required' });
        return;
    }
    if (!req.body.ID) {
        res.status(400).send({ 'error': 'ID is requied' });
        return;
    }
    if (!req.body.protocol) {
        req.body.protocol = 'tcp';
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

    let command = `sudo nft add rule ip USER_TABLE REDIRECT iifname "${req.body.interface}" `;

    if (req.body.saddrType === "SET") { // if saddrType === 0 then saddr is single IP, if saddrType === 1, saddr is a Set
        command = command + `ip saddr @${req.body.saddr} `
    }
    else if (req.body.saddrType === "IP") {
        command = command + `ip saddr ${req.body.saddr}/${req.body.mask} `;
    }

    command = command + `${req.body.protocol} dport ${req.body.dport} dnat to ${req.body.redirectedIP}:${req.body.redirectedPORT} `;
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