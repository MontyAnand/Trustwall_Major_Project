const { generateID, runCommand, getHandle, deleteRule } = require('../utility/firewallUtility');
const { addCustomRules, updateCustomRules, getAllRows, deleteRowByPrimaryKey } = require('../Database/db_controllers');

module.exports.getCustomRules = (req, res) => {
    const data = getAllRows('CUSTOM_RULES');
    res.status(200).send(data);
}

module.exports.addCustomRule = (req, res) => {
    if (!req.body.PROTOCOL) {
        res.status(400).send({ 'error': "Protocol is required" });
        return;
    }
    if (!req.body.INPUT_INTERFACE) {
        res.status(400).send({ 'error': "Input Interface is required" });
        return;
    }
    if (!req.body.OUTPUT_INTERFACE) {
        res.status(400).send({ 'error': "Output Interface is required" });
        return;
    }
    if (!req.body.ACTION) {
        res.status(400).send({ 'error': "Action is required" });
        return;
    }
    if (!req.body.SMASK) {
        req.body.SMASK = 32;
    }
    if (!req.body.DMASK) {
        req.body.DMASK = 32;
    }
    let command = `sudo nft add rule ip USER_TABLE CUSTOM_RULES `;
    if (req.body.SADDR_TYPE === "SET" && req.body.SADDR) {
        command = command + `ip saddr @${req.body.SADDR} `;
    }
    else if (req.body.SADDR_TYPE === "IP" && req.body.SADDR) {
        command = command + `ip saddr ${req.body.SADDR}/${req.body.SMASK} `
    }
    if (req.body.SPORT_TYPE === "SET" && req.body.SPORT) {
        command = command + `${req.body.PROTOCOL} sport @${req.body.SPORT} `;
    }
    else if (req.body.SPORT_TYPE === "PORT" && req.body.SPORT) {
        command = command + `${req.body.PROTOCOL} sport ${req.body.SPORT} `;
    }

    if (req.body.DADDR_TYPE === "SET" && req.body.DADDR) {
        command = command + `ip daddr @${req.body.DADDR} `;
    }
    else if (req.body.DADDR_TYPE === "IP" && req.body.DADDR) {
        command = command + `ip daddr ${req.body.DADDR}/${req.body.DMASK} `
    }
    if (req.body.DPORT_TYPE === "SET" && req.body.DPORT) {
        command = command + `${req.body.PROTOCOL} dport @${req.body.DPORT} `;
    }
    else if (req.body.DPORT_TYPE === "PORT" && req.body.DPORT) {
        command = command + `${req.body.PROTOCOL} dport ${req.body.DPORT} `;
    }
    if (!req.body.SPORT && !req.body.DPORT && req.body.PROTOCOL){
        command = command + `ip protocol ${req.body.PROTOCOL} `;
    }
    command = command + `iifname "${req.body.INPUT_INTERFACE}" `;
    command = command + `oifname "${req.body.OUTPUT_INTERFACE}" `;
    if (req.body.RATE) {
        command = command + `limit rate ${req.body.RATE}/${req.body.UNIT} `;
    }
    if (req.body.BURST) {
        command = command + `burst ${req.body.BURST} packets `;
    }
    command = command + `counter ${req.body.ACTION} `;
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
    if (!req.body.PROTOCOL) {
        res.status(400).send({ 'error': "Protocol is required" });
        return;
    }
    if (!req.body.INPUT_INTERFACE) {
        res.status(400).send({ 'error': "Input Interface is required" });
        return;
    }
    if (!req.body.OUTPUT_INTERFACE) {
        res.status(400).send({ 'error': "Output Interface is required" });
        return;
    }
    if (!req.body.ACTION) {
        res.status(400).send({ 'error': "Action is required" });
        return;
    }
    if (!req.body.SMASK) {
        req.body.SMASK = 32;
    }
    if (!req.body.DMASK) {
        req.body.DMASK = 32;
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
    if (req.body.SADDR_TYPE === "SET" && req.body.SADDR) {
        command = command + `ip saddr @${req.body.SADDR} `;
    }
    else if (req.body.SADDR_TYPE === "IP" && req.body.SADDR) {
        command = command + `ip saddr ${req.body.SADDR}/${req.body.SMASK} `
    }
    if (req.body.SPORT_TYPE === "SET" && req.body.SPORT) {
        command = command + `${req.body.PROTOCOL} sport @${req.body.SPORT} `;
    }
    else if (req.body.SPORT_TYPE === "PORT" && req.body.SPORT) {
        command = command + `${req.body.PROTOCOL} sport ${req.body.SPORT} `;
    }

    if (req.body.DADDR_TYPE === "SET" && req.body.DADDR) {
        command = command + `ip daddr @${req.body.DADDR} `;
    }
    else if (req.body.DADDR_TYPE === "IP" && req.body.DADDR) {
        command = command + `ip daddr ${req.body.DADDR}/${req.body.DMASK} `
    }
    if (req.body.DPORT_TYPE === "SET" && req.body.DPORT) {
        command = command + `${req.body.PROTOCOL} dport @${req.body.DPORT} `;
    }
    else if (req.body.DPORT_TYPE === "PORT" && req.body.DPORT) {
        command = command + `${req.body.PROTOCOL} dport ${req.body.DPORT} `;
    }
    if (!req.body.SPORT && !req.body.DPORT && req.body.PROTOCOL){
        command = command + `ip protocol ${req.body.PROTOCOL} `;
    }
    command = command + `iifname "${req.body.INPUT_INTERFACE}" `;
    command = command + `oifname "${req.body.OUTPUT_INTERFACE}" `;
    if (req.body.RATE) {
        command = command + `limit rate ${req.body.RATE}/${req.body.UNIT} `;
    }
    if (req.body.BURST) {
        command = command + `burst ${req.body.BURST} packets `;
    }
    command = command + `${req.body.ACTION} `;
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