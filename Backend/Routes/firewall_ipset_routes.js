const { Router } = require('express');
const {
    getIPSets,
    getIPSetInfo,
    getIPSetTypes,
    loadDefaultSettingsIPSet,
    getPathIPSet,
    getDescription,
    setDescription,
    getShort,
    setShort,
    getEntries,
    queryEntry,
    addEntry,
    removeEntry,
    addEntriesFromFile,
    removeEntriesFromFile,
    newIPSet,
    newIPSetFromFile,
    deleteIPSet
} = require('../Controllers/firewall_ipset_controller');

const router = Router();

router.post('/firewall_ipsets/get_ipsets', getIPSets);
router.post('/firewall_ipsets/get_ipset_info', getIPSetInfo);
router.post('/firewall_ipsets/get_ipsettypes', getIPSetTypes);
router.post('/firewall_ipsets/load_default_settings_ipset', loadDefaultSettingsIPSet);
router.post('/firewall_ipsets/get_path_ipset', getPathIPSet);
router.post('/firewall_ipsets/get_description', getDescription);
router.post('/firewall_ipsets/set_description', setDescription);
router.post('/firewall_ipsets/get_short', getShort);
router.post('/firewall_ipsets/set_short', setShort);
router.post('/firewall_ipsets/get_entries', getEntries);
router.post('/firewall_ipsets/query_entry', queryEntry);
router.post('/firewall_ipsets/add_entry', addEntry);
router.post('/firewall_ipsets/remove_entry', removeEntry);
router.post('/firewall_ipsets/add_entriesfromfile', addEntriesFromFile);
router.post('/firewall_ipsets/remove_entriesfromfile', removeEntriesFromFile);
router.post('/firewall_ipsets/new_ipset', newIPSet);
router.post('/firewall_ipsets/new_ipsetfromfile', newIPSetFromFile);
router.post('/firewall_ipsets/delete_ipset', deleteIPSet);

module.exports = router;