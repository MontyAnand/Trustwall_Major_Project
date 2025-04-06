const { generateID, getHandle, runCommand, deleteRule } = require('../utility/firewallUtility');
const { addMACRules, updateMACRules, getAllRows, deleteRowByPrimaryKey } = require('../Database/db_controllers');

module.exports.getMACRules = (req, res) => {
    const data = getAllRows('MAC_BASED_RULES');
    res.status(200).send(data);
}


module.exports.addMACRule = (req, res) => {
    if (!req.body.MAC) {
        res.status(400).send({ 'error': "MAC is required" });
        return;
    }
    if (!req.body.INTERFACE) {
        res.status(400).send({ 'error': "Interface is required" });
        return;
    }
    if (req.body.TYPE === undefined || req.body.TYPE === null) {
        res.status(400).send({ 'error': "Type is required" });
        return;
    }
    if (!req.body.ACTION) {
        res.status(400).send({ 'error': "Action is required" });
        return;
    }
    let command = `sudo nft add rule ip USER_TABLE MAC_RULES iifname "${req.body.INTERFACE}" ether saddr `;
    if (req.body.TYPE === "SET") {
        command = command + `@${req.body.MAC} `;
    }
    else if (req.body.TYPE === "MAC") {
        command = command + `${req.body.MAC} `;
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
    if (!req.body.MAC) {
        res.status(400).send({ 'error': "MAC is required" });
        return;
    }
    if (!req.body.INTERFACE) {
        res.status(400).send({ 'error': "Interface is required" });
        return;
    }
    if (req.body.TYPE === undefined || req.body.TYPE === null) {
        res.status(400).send({ 'error': "Type is required" });
        return;
    }
    if (!req.body.ACTION) {
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
    let command = `sudo nft add rule ip USER_TABLE MAC_RULES iifname "${req.body.INTERFACE}" ether saddr `;
    if (req.body.TYPE === "SET") {
        command = command + `@${req.body.MAC} `;
    }
    else if (req.body.TYPE === "MAC") {
        command = command + `${req.body.MAC} `;
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