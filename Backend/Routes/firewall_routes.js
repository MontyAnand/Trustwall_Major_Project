const { Router }  = require('express');
const {
    startFirewall,
    startFirewallAtSystemStart,
    stopFirewall,
    stopFirewallAtSystemStart,
    getStatusFirewall,
    getDetailStatusFirewall,
    checkConfigFirewall,
    runtimeConfig,
    reloadFirewall
} = require('../Controllers/firewall_controller')

const router = Router();

router.post('/firewall/start', startFirewall);
router.post('/firewall/start_at_system_start', startFirewallAtSystemStart);
router.post('/firewall/stop', stopFirewall);
router.post('/firewall/stop_at_system_start', stopFirewallAtSystemStart);
router.post('/firewall/get_status', getStatusFirewall);
router.post('/firewall/get_detail_status', getDetailStatusFirewall);
router.post('/firewall/check_config', checkConfigFirewall);
router.post('/firewall/runtime_config', runtimeConfig);
router.post('/firewall/reload', reloadFirewall);

module.exports = router;