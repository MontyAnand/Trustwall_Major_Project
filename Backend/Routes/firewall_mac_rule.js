const { Router } = require('express');
const {getMACRules,addMACRule,updateMACRule,deleteMACRule} = require('../Controllers/firewall_mac_rules_controller');
const router = Router();
router.get('/getMACRules',getMACRules);
router.post('/addMACRule',addMACRule);
router.put('/updateMACRule',updateMACRule);
router.delete('/deleteMACRule',deleteMACRule);

module.exports = router;