const { Router } = require('express');
const {
    getServices,
    getService,
    loadDefaultSettingsService,
    getPathService,
    getDescription,
    setDescription,
    getShort,
    setShort,
    getPorts,
    queryPort,
    addPort,
    removePort,
    getProtocols,
    queryProtocol,
    addProtocol,
    removeProtocol,
    getSourcePorts,
    querySourcePort,
    addSourcePort,
    removeSourcePort,
    getServiceHelpers,
    queryHelper,
    addHelper,
    removeHelper,
    getDestinations,
    queryDestination,
    setDestination,
    removeDestination,
    getIncludes,
    queryInclude,
    addInclude,
    removeInclude,
    newService,
    newServiceFromFile,
    deleteService
} = require('../Controllers/firewall_service_controller');

const router = Router();

router.post('/firewall_services/get_services', getServices);
router.post('/firewall_services/get_service', getService);
router.post('/firewall_services/load_default_settings_service', loadDefaultSettingsService);
router.post('/firewall_services/get_path_service', getPathService);
router.post('/firewall_services/get_description', getDescription);
router.post('/firewall_services/set_description', setDescription);
router.post('/firewall_services/get_short', getShort);
router.post('/firewall_services/set_short', setShort);
router.post('/firewall_services/get_ports', getPorts);
router.post('/firewall_services/query_port', queryPort);
router.post('/firewall_services/add_port', addPort);
router.post('/firewall_services/remove_port', removePort);
router.post('/firewall_services/get_protocols', getProtocols);
router.post('/firewall_services/query_protocol', queryProtocol);
router.post('/firewall_services/add_protocol', addProtocol);
router.post('/firewall_services/remove_protocol', removeProtocol);
router.post('/firewall_services/get_sourceports', getSourcePorts);
router.post('/firewall_services/query_sourceport', querySourcePort);
router.post('/firewall_services/add_sourceport', addSourcePort);
router.post('/firewall_services/remove_sourceport', removeSourcePort);
router.post('/firewall_services/get_servicehelpers', getServiceHelpers);
router.post('/firewall_services/query_helpers', queryHelper);
router.post('/firewall_services/add_helper', addHelper);
router.post('/firewall_services/remove_helper', removeHelper);
router.post('/firewall_services/get_destinations', getDestinations);
router.post('/firewall_services/query_destination', queryDestination);
router.post('/firewall_services/set_destination', setDestination);
router.post('/firewall_services/remove_destination', removeDestination);
router.post('/firewall_services/get_includes', getIncludes);
router.post('/firewall_services/query_include', queryInclude);
router.post('/firewall_services/add_include', addInclude);
router.post('/firewall_services/remove_include', removeInclude);
router.post('/firewall_services/new_service', newService);
router.post('/firewall_services/new_service_from_file', newServiceFromFile);
router.post('/firewall_services/delete_service', deleteService);

module.exports = router;