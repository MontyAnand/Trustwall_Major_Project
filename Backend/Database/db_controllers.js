const Database = require('better-sqlite3');

const db = new Database('Firewall.db');

// Table for Custom Rules

db.exec(`CREATE TABLE IF NOT EXISTS CUSTOM_RULES (
    ID TEXT PRIMARY KEY ,
    SADDR_TYPE  TEXT ,
    SADDR TEXT ,
    SMASK INTEGER ,
    SPORT_TYPE TEXT ,
    SPORT TEXT ,
    DADDR_TYPE TEXT ,
    DADDR TEXT ,
    DMASK INTEGER ,
    DPORT_TYPE TEXT ,
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
    SADDR_TYPE TEXT ,
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
    TYPE TEXT ,
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

module.exports.addRuleToForwardTABLE = ({ ID, INTERFACE, SADDR_TYPE, SADDR, SMASK, PROTOCOL, DPORT, REDIRECT_IP, REDIRECT_PORT }) => {
    const smt = db.prepare(`INSERT INTO FORWARD (ID, INTERFACE, SADDR_TYPE, SADDR, MASK, PROTOCOL, DPORT, REDIRECTED_IP, REDIRECTED_PORT) VALUES (?,?,?,?,?,?,?,?,?)`);
    const result = smt.run(ID, INTERFACE, SADDR_TYPE, SADDR, SMASK, PROTOCOL, DPORT, REDIRECT_IP, REDIRECT_PORT);
    return result.changes;
};

module.exports.updateRuleToForwardTABLE = ({ ID, INTERFACE, SADDR_TYPE, SADDR, SMASK, PROTOCOL, DPORT, REDIRECT_IP, REDIRECT_PORT }) => {
    const smt = db.prepare('UPDATE FORWARD SET INTERFACE = ?, SADDR_TYPE = ?, SADDR = ?, MASK = ?, PROTOCOL = ?, DPORT = ?, REDIRECTED_IP = ?, REDIRECTED_PORT = ? WHERE ID = ?');
    const result = smt.run(INTERFACE, SADDR_TYPE, SADDR, SMASK, PROTOCOL, DPORT, REDIRECT_IP, REDIRECT_PORT, ID);
    return result.changes;
};


module.exports.addMACRules = ({ ID, TYPE, MAC, INTERFACE, ACTION }) => {
    const smt = db.prepare(`INSERT INTO MAC_BASED_RULES (ID, MAC, INTERFACE, TYPE, ACTION) VALUES (?, ?, ?, ?, ?)`);
    const result = smt.run(ID, MAC, INTERFACE, TYPE, ACTION);
    return result.changes;
};

module.exports.updateMACRules = ({ ID, TYPE, MAC, INTERFACE, ACTION }) => {
    const smt = db.prepare('UPDATE MAC_BASED_RULES SET MAC = ?, INTERFACE = ?, TYPE = ?, ACTION = ? WHERE ID = ?');
    const result = smt.run(MAC, INTERFACE, TYPE, ACTION, ID);
    return result.changes;
};

module.exports.addCustomRules = ({
    ID,
    SADDR_TYPE,
    SADDR,
    SMASK,
    SPORT_TYPE,
    SPORT,
    DADDR_TYPE,
    DADDR,
    DMASK,
    DPORT_TYPE,
    DPORT,
    PROTOCOL,
    INTERFACE,
    RATE,
    UNIT,
    BURST,
    ACTION
}) => {
    const smt = db.prepare(`INSERT INTO CUSTOM_RULES (
      ID, SADDR_TYPE, SADDR, SMASK,
      SPORT_TYPE, SPORT,
      DADDR_TYPE, DADDR, DMASK,
      DPORT_TYPE, DPORT,
      PROTOCOL, INTERFACE,
      RATE, UNIT, BURST,
      ACTION
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const result = smt.run(
        ID, SADDR_TYPE, SADDR, SMASK,
        SPORT_TYPE, SPORT,
        DADDR_TYPE, DADDR, DMASK,
        DPORT_TYPE, DPORT,
        PROTOCOL, INTERFACE,
        RATE, UNIT, BURST,
        ACTION
    );
    return result.changes;
};

module.exports.updateCustomRules = ({
    ID,
    SADDR_TYPE,
    SADDR,
    SMASK,
    SPORT_TYPE,
    SPORT,
    DADDR_TYPE,
    DADDR,
    DMASK,
    DPORT_TYPE,
    DPORT,
    PROTOCOL,
    INTERFACE,
    RATE,
    UNIT,
    BURST,
    ACTION
}) => {
    const smt = db.prepare(`UPDATE CUSTOM_RULES SET
      SADDR_TYPE = ?, SADDR = ?, SMASK = ?,
      SPORT_TYPE = ?, SPORT = ?,
      DADDR_TYPE = ?, DADDR = ?, DMASK = ?,
      DPORT_TYPE = ?, DPORT = ?,
      PROTOCOL = ?, INTERFACE = ?,
      RATE = ?, UNIT = ?, BURST = ?, ACTION = ?
      WHERE ID = ?`);

    const result = smt.run(
        SADDR_TYPE, SADDR, SMASK,
        SPORT_TYPE, SPORT,
        DADDR_TYPE, DADDR, DMASK,
        DPORT_TYPE, DPORT,
        PROTOCOL, INTERFACE,
        RATE, UNIT, BURST,
        ACTION, ID
    );
    return result.changes;
};

module.exports.closeDB = () => {
    db.close();
}