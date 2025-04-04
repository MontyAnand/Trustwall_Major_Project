const Database = require('better-sqlite3');

const db = new Database('Firewall.db');

// Table for Custom Rules

db.exec(`CREATE TABLE IF NOT EXISTS CUSTOM_RULES (
    ID TEXT PRIMARY KEY ,
    SADDR_TYPE INTEGER ,
    SADDR TEXT ,
    SMASK INTEGER ,
    SPORT_TYPE INTEGER ,
    SPORT TEXT ,
    DADDR_TYPE INTEGER ,
    DADDR TEXT ,
    DMASK INTEGER ,
    DPORT_TYPE INTEGER ,
    DPORT TEXT ,
    PROTOCOL TEXT ,
    INTERFACE TEXT ,
    RATE INTEGER ,
    UNIT TEXT ,
    BURST INTEGER ,
    ACTION TEXT
    )`);

// Table for Forwarding Rules

db.exec(`CREATE TABLE IF NOT EXISTS FORWARD (
    ID TEXT PRIMARY KEY ,
    INTERFACE TEXT,
    SADDR_TYPE INTEGER ,
    SADDR TEXT ,
    MASK INTEGER ,
    PROTOCOL TEXT ,
    DPORT INTEGER ,
    REDIRECTED_IP TEXT ,
    REDIRECTED_PORT INTEGER
    )`);

// Table for Set info

db.exec(`CREATE TABLE IF NOT EXISTS SET_INFO (
    NAME TEXT PRIMARY KEY ,
    TYPE TEXT
    )`);


// Table for MAC Based rule

db.exec(`CREATE TABLE IF NOT EXISTS MAC_BASED_RULES (
    ID TEXT PRIMARY KEY ,
    MAC TEXT ,
    INTERFACE TEXT ,
    TYPE INTEGER ,
    ACTION TEXT
    )`);

// Table for representing Set

module.exports.createSetTable = ({ setName, type }) => {
    let TYPE = 'TEXT';
    if (type === 'PORT') {
        TYPE = 'INTEGER'
    }
    db.exec(`CREATE TABLE IF NOT EXISTS ${setName} (
        ELEMENT ${TYPE} PRIMARY KEY
        )`);

    const smt = db.prepare(`INSERT INTO SET_INFO (NAME , TYPE) VALUES (?,?)`);
    const result = smt.run(setName, type);
    return result.changes;
}

module.exports.deleteSetTable = (setName) => {
    db.exec(`DROP TABLE IF EXISTS ${setName}`);
}

module.exports.addElementIntoSet = (setName, value) => {
    const smt = db.prepare(`INSERT INTO ${setName} (ELEMENT) VALUES (?)`);
    const result = smt.run(value);
    return result.changes;
}

module.exports.deleteRowByPrimaryKey = (TABLE, COLUMN, VALUE) => {
    const smt = db.prepare(`DELETE FROM ${TABLE} WHERE ${COLUMN} = ?`);
    const result = smt.run(VALUE);
    return result.changes;
}

module.exports.checkIfExistsUsingPrimaryKey = (TABLE, COLUMN, VALUE) => {
    const smt = db.prepare(`SELECT EXISTS(SELECT 1 FROM ${TABLE} WHERE ${COLUMN} = ?) AS found`);
    const result = smt.get(VALUE);
    return result.found;
}

module.exports.getAllRows = (TABLE) => {
    const smt = db.prepare(`SELECT * FROM ${TABLE}`);
    return smt.all();
}

module.exports.addRuleToForwardTABLE = ({ ID, interface, saddrType, saddr, mask, protocol, dport, redirectedIP, redirectedPORT }) => {
    const smt = db.prepare(`INSERT INTO FORWARD (ID, INTERFACE, SADDR_TYPE, SADDR, MASK, PROTOCOL, DPORT, REDIRECTED_IP, REDIRECTED_PORT) VALUES (?,?,?,?,?,?,?,?,?)`);
    const result = smt.run(ID, interface, saddrType, saddr, mask, protocol, dport, redirectedIP, redirectedPORT);
    return result.changes;
}

module.exports.updateRuleToForwardTABLE = ({ ID, interface, saddrType, saddr, mask, protocol, dport, redirectedIP, redirectedPORT }) => {
    const smt = db.prepare('UPDATE FORWARD SET INTERFACE = ?, SADDR_TYPE = ?, SADDR = ?, MASK = ?, PROTOCOL = ?, DPORT = ?, REDIRECTED_IP = ?, REDIRECTED_PORT = ? WHERE ID = ?');
    const result = smt.run(interface, saddrType, saddr, mask, protocol, dport, redirectedIP, redirectedPORT, ID);
    return result.changes;
}

module.exports.addMACRules = ({ ID, mac, interface, type, action }) => {
    const smt = db.prepare(`INSERT INTO MAC_BASED_RULES (ID,MAC,INTERFACE,TYPE,ACTION) VALUES (?,?,?,?,?)`);
    const result = smt.run(ID, mac, interface, type, action);
    return result.changes;
}

module.exports.updateMACRules = ({ ID, mac, interface, type, action }) => {
    const smt = db.prepare('UPDATE MAC_BASED_RULES SET MAC = ?, INTERFACE = ?, TYPE = ?, ACTION = ? WHERE ID = ?');
    const result = smt.run(mac, interface, type, action, ID);
    return result.changes;
}

module.exports.addCustomRules = ({ ID, saddr_type, saddr,smask, sport_type, sport, daddr_type, daddr,dmask, dport_type, dport, protocol, interface, rate, unit, burst, action }) => {
    const smt = db.prepare('INSERT INTO CUSTOM_RULES (ID,SADDR_TYPE,SADDR,SMASK,SPORT_TYPE,SPORT,DADDR_TYPE,DADDR,DMASK,DPORT_TYPE,DPORT,PROTOCOL,INTERFACE,RATE,UNIT,BURST,ACTION) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    const result = smt.run(ID, saddr_type, saddr, smask ,sport_type, sport, daddr_type, daddr, dmask, dport_type, dport, protocol, interface, rate, unit, burst, action);
    return result.changes;
}

module.exports.updateCustomRules = ({ ID, saddr_type, saddr, smask,sport_type, sport, daddr_type, daddr, dmask,dport_type, dport, protocol, interface, rate, unit, burst, action }) => {
    const smt = db.prepare('UPDATE CUSTOM_RULES SET SADDR_TYPE = ?, SADDR = ?, SMASK = ?, SPORT_TYPE = ?, SPORT = ?, DADDR_TYPE = ?, DADDR = ?, DMASK = ?, DPORT_TYPE = ?, DPORT = ?, PROTOCOL = ?, INTERFACE = ?, RATE = ?, UNIT = ?, BURST = ?, ACTION = ? WHERE ID = ?');
    const result = smt.run(saddr_type, saddr,smask, sport_type, sport, daddr_type, daddr, dmask,dport_type, dport, protocol, interface, rate, unit, burst, action,ID);
    return result.changes;
}
module.exports.closeDB = () => {
    db.close();
}