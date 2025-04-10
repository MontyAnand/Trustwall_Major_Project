const { Router } = require('express');
const {getForwardRules,addForwardRule,updateForwardRule,deleteForwardRule} = require('../Controllers/firewall_forward_controller');
const router = Router();

router.get('/getForwardRules',getForwardRules);
router.post('/addForwardRule',addForwardRule);
router.put('/updateForwardRule',updateForwardRule);
router.delete('/deleteForwardRule',deleteForwardRule);

module.exports = router;