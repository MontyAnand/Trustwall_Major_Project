const { Router } = require('express');
const {
    getICMPTypes,
    getICMPType,
    loadDefaultSettingsICMPType,
    getPathICMPType,
    getDescription,
    setDescription,
    getShort,
    setShort,
    getDestinations,
    queryDestination,
    addDestination,
    removeDestination,
    newICMPType,
    newICMPTypeFromFile,
    deleteICMPType
} = require('../Controllers/firewall_icmptype_controller');

const router = Router();

router.post('/firewall_icmptypes/get_icmptypes', getICMPTypes);
router.post('/firewall_icmptypes/get_icmptype', getICMPType);
router.post('/firewall_icmptypes/load_default_settings_icmptype', loadDefaultSettingsICMPType);
router.post('/firewall_icmptypes/get_path_icmptype', getPathICMPType);
router.post('/firewall_icmptypes/get_description', getDescription);
router.post('/firewall_icmptypes/set_description', setDescription);
router.post('/firewall_icmptypes/get_short', getShort);
router.post('/firewall_icmptypes/set_short', setShort);
router.post('/firewall_icmptypes/get_destinations', getDestinations);
router.post('/firewall_icmptypes/query_destination', queryDestination);
router.post('/firewall_icmptypes/add_destination', addDestination);
router.post('/firewall_icmptypes/remove_destination', removeDestination);
router.post('/firewall_icmptypes/new_icmptype', newICMPType);
router.post('/firewall_icmptypes/new_icmptype_from_file', newICMPTypeFromFile);
router.post('/firewall_icmptypes/delete_icmptype', deleteICMPType);

module.exports = router;