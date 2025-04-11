const { Router } = require('express');
const {getForwardRules,addForwardRule,updateForwardRule,deleteForwardRule} = require('../Controllers/firewall_forward_controller');
const router = Router();

router.get('/getForwardRules',getForwardRules);
router.post('/addForwardRule',addForwardRule);
router.put('/updateForwardRule',updateForwardRule);
router.delete('/deleteForwardRule',deleteForwardRule);

// router.get('/update-suricata-configuration',(req,res)=>{}); In place of router you can write app also.

module.exports = router;