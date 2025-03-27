const { Router } = require('express');
const {
    getZones,
    getZonesInfo,
    getZoneInfo,
    getDefaultZone,
    setDefaultZone,
    getActiveZones,
    loadDefaultSettingsZone,
    getPathZone,
    getTarget,
    setTarget,
    getDescription,
    setDescription,
    getShort,
    setShort,
    queryICMPBlockInversion,
    addICMPBlockInversion,
    removeICMPBlockInversion,
    queryForward,
    addForward,
    removeForward,
    listInterfaces,
    queryInterface,
    addInterface,
    changeInterface,
    removeInterface,
    getZoneOfInterface,
    listSources,
    querySource,
    addSource,
    changeSource,
    removeSource,
    getZoneOfSource,
    listServices,
    queryService,
    addService,
    removeService,
    listPorts,
    queryPort,
    addPort,
    removePort,
    listProtocols,
    queryProtocol,
    addProtocol,
    removeProtocol,
    listSourcePorts,
    querySourcePort,
    addSourcePort,
    removeSourcePort,
    listICMPBlocks,
    queryICMPBlock,
    addICMPBlock,
    removeICMPBlock,
    listForwardPorts,
    queryForwardPort,
    addForwardPort,
    removeForwardPort,
    queryMasquerade,
    addMasquerade,
    removeMasquerade,
    listRichRules,
    queryRichRule,
    addRichRule,
    removeRichRule,
    newZone,
    newZoneFromFile,
    deleteZone
} = require('../Controllers/firewall_zone_controller');

const router = Router();

router.get('/firewall_zones/get_zones', getZones);
router.get('/firewall_zones/get_zones_info', getZonesInfo);
router.get('/firewall_zones/get_zone_info', getZoneInfo);
router.get('/firewall_zones/get_default_zone', getDefaultZone);
router.put('/firewall_zones/set_default_zone', setDefaultZone);
router.get('/firewall_zones/get_active_zones', getActiveZones);
router.get('/firewall_zones/load_default_settings_zone', loadDefaultSettingsZone);
router.get('/firewall_zones/get_path_zone', getPathZone);
router.get('/firewall_zones/get_target', getTarget);
router.put('/firewall_zones/set_target', setTarget);
router.get('/firewall_zones/get_description', getDescription);
router.put('/firewall_zones/set_description', setDescription);
router.get('/firewall_zones/get_short', getShort);
router.put('/firewall_zones/set_short', setShort);
router.get('/firewall_zones/query_icmpblockinversion', queryICMPBlockInversion);
router.put('/firewall_zones/add_icmpblockinversion', addICMPBlockInversion);
router.put('/firewall_zones/remove_icmpblockinversion', removeICMPBlockInversion);
router.get('/firewall_zones/query_forward', queryForward);
router.put('/firewall_zones/add_forward', addForward);
router.put('/firewall_zones/remove_forward', removeForward);
router.get('/firewall_zones/list_interfaces', listInterfaces);
router.get('/firewall_zones/query_interface', queryInterface);
router.put('/firewall_zones/add_interface', addInterface);
router.put('/firewall_zones/change_interface', changeInterface);
router.put('/firewall_zones/remove_interface', removeInterface);
router.get('/firewall_zones/get_zone_of_interface', getZoneOfInterface);
router.get('/firewall_zones/list_sources', listSources);
router.get('/firewall_zones/query_source', querySource);
router.put('/firewall_zones/add_source', addSource);
router.put('/firewall_zones/change_source', changeSource);
router.put('/firewall_zones/remove_source', removeSource);
router.post('/firewall_zones/get_zone_of_source', getZoneOfSource);
router.post('/firewall_zones/list_services', listServices);
router.post('/firewall_zones/query_service', queryService);
router.post('/firewall_zones/add_service', addService);
router.post('/firewall_zones/remove_service', removeService);
router.post('/firewall_zones/list_ports', listPorts);
router.post('/firewall_zones/query_port', queryPort);
router.post('/firewall_zones/add_port', addPort);
router.post('/firewall_zones/remove_port', removePort);
router.post('/firewall_zones/list_protocols', listProtocols);
router.post('/firewall_zones/query_protocol', queryProtocol);
router.post('/firewall_zones/add_protocol', addProtocol);
router.post('/firewall_zones/remove_protocol', removeProtocol);
router.post('/firewall_zones/list_sourceports', listSourcePorts);
router.post('/firewall_zones/query_sourceport', querySourcePort);
router.post('/firewall_zones/add_sourceport', addSourcePort);
router.post('/firewall_zones/remove_sourceport', removeSourcePort);
router.post('/firewall_zones/list_icmpblocks', listICMPBlocks);
router.post('/firewall_zones/query_icmpblock', queryICMPBlock);
router.post('/firewall_zones/add_icmpblock', addICMPBlock);
router.post('/firewall_zones/remove_icmpblock', removeICMPBlock);
router.post('/firewall_zones/list_forwardports', listForwardPorts);
router.post('/firewall_zones/query_forwardport', queryForwardPort);
router.post('/firewall_zones/add_forwardport', addForwardPort);
router.post('/firewall_zones/remove_forwardport', removeForwardPort);
router.post('/firewall_zones/query_masquerade', queryMasquerade);
router.post('/firewall_zones/add_masquerade', addMasquerade);
router.post('/firewall_zones/remove_masquerade', removeMasquerade);
router.post('/firewall_zones/list_richrules', listRichRules);
router.post('/firewall_zones/query_richrule', queryRichRule);
router.post('/firewall_zones/add_richrule', addRichRule);
router.post('/firewall_zones/remove_richrule', removeRichRule);
router.post('/firewall_zones/new_zone', newZone);
router.post('/firewall_zones/new_zone_from_file', newZoneFromFile);
router.post('/firewall_zones/delete_zone', deleteZone);

module.exports = router;