const { generateID, runCommand, getHandle, deleteRule } = require('../utility/firewallUtility');
const { addCustomRules, updateCustomRules, getAllRows, deleteRowByPrimaryKey } = require('../Database/db_controllers');

module.exports.getCustomRules = (req, res) => {
    const data = getAllRows('CUSTOM_RULES');
    res.status(200).send(data);
}

module.exports.addCustomRule = (req, res) => {
    if (!req.body.protocol) {
        res.status(400).send({ 'error': "Protocol is required" });
        return;
    }
    if (!req.body.interface) {
        res.status(400).send({ 'error': "Interface is required" });
        return;
    }
    if (!req.body.action) {
        res.status(400).send({ 'error': "Action is required" });
        return;
    }
    if (!req.body.smask) {
        req.body.smask = 32;
    }
    if (!req.body.dmask) {
        req.body.dmask = 32;
    }
    let command = `sudo nft add rule ip USER_TABLE CUSTOM_RULES `;
    if (req.body.saddr_type === 1) {
        command = command + `ip saddr @${req.body.saddr} `;
    }
    else if (req.body.saddr_type === 0) {
        command = command + `ip saddr ${req.body.saddr}/${req.body.smask} `
    }
    if (req.body.sport_type === 1) {
        command = command + `${req.body.protocol} sport @${req.body.sport} `;
    }
    else if (req.body.sport_type === 0) {
        command = command + `${req.body.protocol} sport ${req.body.sport} `;
    }

    if (req.body.daddr_type === 1) {
        command = command + `ip daddr @${req.body.daddr} `;
    }
    else if (req.body.daddr_type === 0) {
        command = command + `ip daddr ${req.body.daddr}/${req.body.dmask} `
    }
    if (req.body.dport_type === 1) {
        command = command + `${req.body.protocol} dport @${req.body.sport} `;
    }
    else if (req.body.dport_type === 0) {
        command = command + `${req.body.protocol} dport ${req.body.dport} `;
    }
    command = command + `iifname "${req.body.interface}" `
    if (req.body.rate) {
        command = command + `limit rate ${req.body.rate}/${req.body.unit} `;
    }
    if (req.body.burst) {
        command = command + `burst ${req.body.burst} packets `;
    }
    command = command + `counter ${req.body.action} `;
    const ID = generateID();
    command = command + `comment "${ID}"`;
    const success = runCommand(command);

    if (success) {
        req.body.ID = ID;
        addCustomRules(req.body);
        res.status(200).send({ 'status': true });
    }
    else {
        res.status(500).send({ 'status': false });
    }
}

module.exports.updateCustomRule = (req, res) => {
    if (!req.body.protocol) {
        res.status(400).send({ 'error': "Protocol is required" });
        return;
    }
    if (!req.body.interface) {
        res.status(400).send({ 'error': "Interface is required" });
        return;
    }
    if (!req.body.action) {
        res.status(400).send({ 'error': "Action is required" });
        return;
    }
    if (!req.body.smask) {
        req.body.smask = 32;
    }
    if (!req.body.dmask) {
        req.body.dmask = 32;
    }
    if (!req.body.ID) {
        res.status(400).send({ 'error': 'ID is requied' });
        return;
    }

    const handle = getHandle(req.body.ID);
    if (handle == -1) {
        res.status(400).send({ 'error': 'Invalid ID' });
        return;
    }

    const isDeleted = deleteRule('ip', 'USER_TABLE', 'CUSTOM_RULES', handle);
    if (!isDeleted) {
        res.status(500).send({ 'success': false });
        return;
    }

    let command = `sudo nft add rule ip USER_TABLE CUSTOM_RULES `;
    if (req.body.saddr_type === 1) {
        command = command + `ip saddr @${req.body.saddr} `;
    }
    else if (req.body.saddr_type === 0) {
        command = command + `ip saddr ${req.body.saddr}/${req.body.smask} `
    }
    if (req.body.sport_type === 1) {
        command = command + `${req.body.protocol} sport @${req.body.sport} `;
    }
    else if (req.body.sport_type === 0) {
        command = command + `${req.body.protocol} sport ${req.body.sport} `;
    }

    if (req.body.daddr_type === 1) {
        command = command + `ip daddr @${req.body.daddr} `;
    }
    else if (req.body.daddr_type === 0) {
        command = command + `ip daddr ${req.body.daddr}/${req.body.dmask} `
    }
    if (req.body.dport_type === 1) {
        command = command + `${req.body.protocol} dport @${req.body.sport} `;
    }
    else if (req.body.dport_type === 0) {
        command = command + `${req.body.protocol} dport ${req.body.dport} `;
    }
    command = command + `iifname "${req.body.interface}" `
    if (req.body.rate) {
        command = command + `limit rate ${req.body.rate}/${req.body.unit} `;
    }
    if (req.body.burst) {
        command = command + `burst ${req.body.burst} packets `;
    }
    command = command + `${req.body.action} `;
    command = command + `comment "${req.body.ID}"`;

    const success = runCommand(command);

    if (success) {
        // Update rule in DB with respect to ID
        updateCustomRules(req.body);
        res.status(200).send({ 'status': true });
    }
    else {
        res.status(500).send({ 'status': false });
    }
}

module.exports.deleteCustomRule = (req, res) => {
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
    const isDeleted = deleteRule('ip', 'USER_TABLE', 'CUSTOM_RULES', handle);
    if (isDeleted) {
        deleteRowByPrimaryKey('CUSTOM_RULES', 'ID', ID);
        res.status(200).send({ 'success': true });
    }
    else {
        res.status(500).send({ 'success': false });
    }
}