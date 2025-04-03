const { execSync } = require('child_process');

module.exports.getHandle = (ID) => {
    const command = `sudo nft --handle list ruleset | grep 'comment "${ID}"' | awk '{print $(NF)}'`;
    try {
        const handle = execSync(command, { encoding: 'utf8' }).trim();
        if (handle) {
            return parseInt(handle, 10);
        }
        else {
            return -1;
        }
    } catch (error) {
        return -1;
    }
}

module.exports.generateID = () => {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

module.exports.runCommand = (command) => {
    try {
        execSync(command);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports.deleteRule = (TABLE_TYPE, TABLE, CHAIN, handle) => {
    const command = `sudo nft delete rule ${TABLE_TYPE} ${TABLE} ${CHAIN} handle ${handle}`;
    try {
        execSync(command);
        return true;
    } catch (error) {
        return false;
    }
}