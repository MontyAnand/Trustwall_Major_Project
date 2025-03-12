const { Router } = require('express');
const {
    getPolicies,
    getPoliciesInfo,
    getPolicyInfo,
    loadDefaultSettingsPolicy,
    getPathPolicy,
    getTarget,
    setTarget,
    getDescription,
    setDescription,
    getShort,
    setShort,
    getPriority,
    setPriority,
    listIngressPolicies,
    queryIngressPolicy,
    addIngressPolicy,
    removeIngressPolicy,
    listEgressPolicies,
    queryEgressPolicy,
    addEgressPolicy,
    removeEgressPolicy,
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
    newPolicy,
    newPolicyFromFile,
    deletePolicy
} = require('../Controllers/firewall_zone_controller');

const router = Router();

router.post('/firewall_policies/get_policies', getPolicies);
router.post('/firewall_policies/get_policies_info', getPoliciesInfo);
router.post('/firewall_policies/get_policy_info', getPolicyInfo);
router.post('/firewall_policies/load_default_settings_policy', loadDefaultSettingsPolicy);
router.post('/firewall_policies/get_path_policy', getPathPolicy);
router.post('/firewall_policies/get_target', getTarget);
router.post('/firewall_policies/set_target', setTarget);
router.post('/firewall_policies/get_description', getDescription);
router.post('/firewall_policies/set_description', setDescription);
router.post('/firewall_policies/get_short', getShort);
router.post('/firewall_policies/set_short', setShort);
router.post('/firewall_policies/get_priority', getPriority);
router.post('/firewall_policies/set_priority', setPriority);
router.post('/firewall_policies/list_ingresspolicies', listIngressPolicies);
router.post('/firewall_policies/query_ingresspolicy', queryIngressPolicy);
router.post('/firewall_policies/add_ingresspolicy', addIngressPolicy);
router.post('/firewall_policies/remove_ingresspolicy', removeIngressPolicy);
router.post('/firewall_policies/list_egresspolicies', listEgressPolicies);
router.post('/firewall_policies/query_egresspolicy', queryEgressPolicy);
router.post('/firewall_policies/add_egresspolicy', addEgressPolicy);
router.post('/firewall_policies/remove_egresspolicy', removeEgressPolicy);
router.post('/firewall_policies/list_services', listServices);
router.post('/firewall_policies/query_service', queryService);
router.post('/firewall_policies/add_service', addService);
router.post('/firewall_policies/remove_service', removeService);
router.post('/firewall_policies/list_ports', listPorts);
router.post('/firewall_policies/query_port', queryPort);
router.post('/firewall_policies/add_port', addPort);
router.post('/firewall_policies/remove_port', removePort);
router.post('/firewall_policies/list_protocols', listProtocols);
router.post('/firewall_policies/query_protocol', queryProtocol);
router.post('/firewall_policies/add_protocol', addProtocol);
router.post('/firewall_policies/remove_protocol', removeProtocol);
router.post('/firewall_policies/list_sourceports', listSourcePorts);
router.post('/firewall_policies/query_sourceport', querySourcePort);
router.post('/firewall_policies/add_sourceport', addSourcePort);
router.post('/firewall_policies/remove_sourceport', removeSourcePort);
router.post('/firewall_policies/list_icmpblocks', listICMPBlocks);
router.post('/firewall_policies/query_icmpblock', queryICMPBlock);
router.post('/firewall_policies/add_icmpblock', addICMPBlock);
router.post('/firewall_policies/remove_icmpblock', removeICMPBlock);
router.post('/firewall_policies/list_forwardports', listForwardPorts);
router.post('/firewall_policies/query_forwardport', queryForwardPort);
router.post('/firewall_policies/add_forwardport', addForwardPort);
router.post('/firewall_policies/remove_forwardport', removeForwardPort);
router.post('/firewall_policies/query_masquerade', queryMasquerade);
router.post('/firewall_policies/add_masquerade', addMasquerade);
router.post('/firewall_policies/remove_masquerade', removeMasquerade);
router.post('/firewall_policies/list_richrules', listRichRules);
router.post('/firewall_policies/query_richrule', queryRichRule);
router.post('/firewall_policies/add_richrule', addRichRule);
router.post('/firewall_policies/remove_richrule', removeRichRule);
router.post('/firewall_policies/new_policy', newPolicy);
router.post('/firewall_policies/new_policy_from_file', newPolicyFromFile);
router.post('/firewall_policies/delete_policy', deletePolicy);

module.exports = router;