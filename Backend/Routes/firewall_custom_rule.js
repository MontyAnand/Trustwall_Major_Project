const { Router } = require('express');
const {getCustomRules, addCustomRule, updateCustomRule, deleteCustomRule } = require('../Controllers/firewall_custom_controller');
const router = Router();

router.get('/getCustomRules',getCustomRules);
router.post('/addCustomRule',addCustomRule);
router.put('/updateCustomRule',updateCustomRule);
router.delete('/deleteCustomRule',deleteCustomRule);

module.exports = router;