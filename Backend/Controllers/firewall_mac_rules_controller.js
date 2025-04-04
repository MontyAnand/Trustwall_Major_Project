const { generateID, getHandle, runCommand, deleteRule } = require('../utility/firewallUtility');
const { addMACRules, updateMACRules, getAllRows, deleteRowByPrimaryKey } = require('../Database/db_controllers');

module.exports.getMACRules = (req, res) => {
    const data = getAllRows('MAC_BASED_RULES');
    res.status(200).send(data);
}

module.exports.addMACRule = (req, res) => {
    if (!req.body.mac) {
        res.status(400).send({ 'error': "MAC is required" });
        return;
    }
    if (!req.body.interface) {
        res.status(400).send({ 'error': "Interface is required" });
        return;
    }
    if (!req.body.type) {
        res.status(400).send({ 'error': "Type is required" });
        return;
    }
    if (!req.body.action) {
        res.status(400).send({ 'error': "Action is required" });
        return;
    }
    let command = `sudo nft add rule ip USER_TABLE MAC_RULES iifname "${req.body.interface}" ether saddr `;
    if (req.body.type === 1) {
        command = command + `@${req.body.mac} `;
    }
    else if (req.body.type === 0) {
        command = command + `${req.body.mac} `;
    }
    const ID = generateID();
    command = command + `comment "${ID}"`;
    const success = runCommand(command);

    if (success) {
        req.body.ID = ID;
        addMACRules(req.body);
        res.status(200).send({ 'status': true });
    }
    else {
        res.status(500).send({ 'status': false });
    }
}

module.exports.updateMACRule = (req,res)=>{
    if (!req.body.mac) {
        res.status(400).send({ 'error': "MAC is required" });
        return;
    }
    if (!req.body.interface) {
        res.status(400).send({ 'error': "Interface is required" });
        return;
    }
    if (!req.body.type) {
        res.status(400).send({ 'error': "Type is required" });
        return;
    }
    if (!req.body.action) {
        res.status(400).send({ 'error': "Action is required" });
        return;
    }
    if (!req.body.ID) {
        res.status(400).send({ 'error': "ID is required" });
        return;
    }
    const handle = getHandle(req.body.ID);
    if (handle == -1) {
        res.status(400).send({ 'error': 'Invalid ID' });
        return;
    }

    const isDeleted = deleteRule('ip', 'USER_TABLE', 'MAC_RULES', handle);
    if (!isDeleted) {
        res.status(500).send({ 'success': false });
        return;
    }
    let command = `sudo nft add rule ip USER_TABLE MAC_RULES iifname "${req.body.interface}" ether saddr `;
    if (req.body.type === 1) {
        command = command + `@${req.body.mac} `;
    }
    else if (req.body.type === 0) {
        command = command + `${req.body.mac} `;
    }
    command = command + `comment "${req.body.ID}"`;
    const success = runCommand(command);

    if (success) {
        updateMACRules(req.body);
        res.status(200).send({ 'status': true });
    }
    else {
        res.status(500).send({ 'status': false });
    }
}

module.exports.deleteMACRule = (req,res)=>{
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
    const isDeleted = deleteRule('ip', 'USER_TABLE', 'MAC_RULES', handle);
    if (isDeleted) {
        deleteRowByPrimaryKey('MAC_BASED_RULES', 'ID', ID);
        res.status(200).send({ 'success': true });
    }
    else {
        res.status(500).send({ 'success': false });
    }
}