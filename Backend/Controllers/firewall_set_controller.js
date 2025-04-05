const { runCommand } = require('../utility/firewallUtility');
const { getAllRows, createSetTable, checkIfExistsUsingPrimaryKey, deleteSetTable, deleteRowByPrimaryKey , addElementIntoSet} = require('../Database/db_controllers');


module.exports.getSets = (req, res) => {
    const data = getAllRows('SET_INFO');
    res.status(200).send(data);
}

module.exports.createSet = (req, res) => {
    if (!req.body.setName) {
        res.status(400).send({ 'error': "Set's Name is Required" });
        return;
    }
    if (!req.body.type) {
        res.status(400).send({ 'error': "Set's type is missing" });
        return;
    }
    if (checkIfExistsUsingPrimaryKey('SET_INFO', 'NAME', req.body.setName)) {
        res.status(400).send({ 'error': "Set already exists" });
        return;
    }

    let command = `sudo nft add set ip USER_TABLE ${req.body.setName} `;

    if (req.body.type === 'IP') {
        command = command + `'{type ipv4_addr; flags interval;}'`;
    }
    else if (req.body.type === 'PORT') {
        command = command + `'{ type inet_service; }'`
    }
    else if (req.body.type === 'MAC') {
        command = command + `'{ type ether_addr; }'`;
    }
    else {
        res.status(400).send({ 'error': "Invalid Type" });
        return;
    }
    const success = runCommand(command);
    if (success) {
        createSetTable(req.body);
        res.status(200).send({ 'success': true });
    }
    else {
        res.status(500).send({ 'success': false });
    }
}

module.exports.deleteSet = (req, res) => {
    if (!req.body.setName) {
        res.status(400).send({ 'error': "Set's Name is required" });
        return;
    }
    if(! checkIfExistsUsingPrimaryKey('SET_INFO', 'NAME', req.body.setName)){
        res.status(400).send({'error':"Set doesn't exists"});
        return;
    }
    const command = `sudo nft delete set ip USER_TABLE ${req.body.setName}`;
    const success = runCommand(command);
    if (success) {
        deleteSetTable(req.body.setName);
        deleteRowByPrimaryKey('SET_INFO', 'NAME', req.body.setName);
        res.status(200).send({ 'success': true });
    }
    else {
        res.status(500).send({ 'success': false });
    }
}

module.exports.getSetElements = (req, res) => {
    const { setName } = req.query;
    if (!setName) {
        res.status(400).send({ 'error': "Set's Name is required" });
        return;
    }
    if(! checkIfExistsUsingPrimaryKey('SET_INFO', 'NAME', setName)){
        res.status(400).send({'error':"Set doesn't exists"});
        return;
    }
    const data = getAllRows(setName);
    res.status(200).send(data);
}

module.exports.addElementToSet = (req, res) => {
    if(!req.body.setName){
        res.status(400).send({ 'error': "Set's Name is required" });
        return;
    }
    if(!req.body.element){
        res.status(400).send({'error':"Nothing to add into the set"});
        return;
    }
    if(! checkIfExistsUsingPrimaryKey('SET_INFO', 'NAME', req.body.setName)){
        res.status(400).send({'error':"Set doesn't exists"});
        return;
    }
    const command = `sudo nft add element ip USER_TABLE ${req.body.setName} '{ ${req.body.element} }'`;
    const success = runCommand(command);
    if(success){
        addElementIntoSet(req.body.setName, req.body.element);
        res.status(200).send({'success':true});
    }
    else{
        res.status(500).send({'success':false});
    }
}

module.exports.removeElementFromSet = (req, res) => {
    if(!req.body.setName){
        res.status(400).send({ 'error': "Set's Name is required" });
        return;
    }
    if(!req.body.element){
        res.status(400).send({'error':"Nothing to remove from the set"});
        return;
    }
    if(! checkIfExistsUsingPrimaryKey('SET_INFO', 'NAME', req.body.setName)){
        res.status(400).send({'error':"Set doesn't exixts"});
        return;
    }
    const command = `sudo nft delete element ip USER_TABLE ${req.body.setName} '{ ${req.body.element} }'`;
    const success = runCommand(command);
    if(success){
        deleteRowByPrimaryKey(req.body.setName,'ELEMENT',req.body.element);
        res.status(200).send({'success':true});
    }
    else{
        res.status(500).send({'success':false});
    }
}

