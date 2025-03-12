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

router.post('/firewall_zones/get_zones', getZones);
router.post('/firewall_zones/get_zones_info', getZonesInfo);
router.post('/firewall_zones/get_zone_info', getZoneInfo);
router.post('/firewall_zones/get_default_zone', getDefaultZone);
router.post('/firewall_zones/set_default_zone', setDefaultZone);
router.post('/firewall_zones/get_active_zone', getActiveZones);
router.post('/firewall_zones/load_default_settings_zone', loadDefaultSettingsZone);
router.post('/firewall_zones/get_path_zone', getPathZone);
router.post('/firewall_zones/get_target', getTarget);
router.post('/firewall_zones/set_target', setTarget);
router.post('/firewall_zones/get_description', getDescription);
router.post('/firewall_zones/set_description', setDescription);
router.post('/firewall_zones/get_short', getShort);
router.post('/firewall_zones/set_short', setShort);
router.post('/firewall_zones/query_icmpblockinversion', queryICMPBlockInversion);
router.post('/firewall_zones/add_icmpblockinversion', addICMPBlockInversion);
router.post('/firewall_zones/remove_icmpblockinversion', removeICMPBlockInversion);
router.post('/firewall_zones/query_forward', queryForward);
router.post('/firewall_zones/add_forward', addForward);
router.post('/firewall_zones/remove_forward', removeForward);
router.post('/firewall_zones/list_interfaces', listInterfaces);
router.post('/firewall_zones/query_interface', queryInterface);
router.post('/firewall_zones/add_interface', addInterface);
router.post('/firewall_zones/change_interface', changeInterface);
router.post('/firewall_zones/remove_interface', removeInterface);
router.post('/firewall_zones/get_zone_of_interface', getZoneOfInterface);
router.post('/firewall_zones/list_sources', listSources);
router.post('/firewall_zones/query_source', querySource);
router.post('/firewall_zones/add_source', addSource);
router.post('/firewall_zones/change_source', changeSource);
router.post('/firewall_zones/remove_source', removeSource);
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