const { Router } = require('express');
const {getSets, createSet,deleteSet,getSetElements,addElementToSet,removeElementFromSet,} = require('../Controllers/firewall_set_controller');
const router = Router();

router.get('/getSets',getSets);
router.post('/createSet',createSet);
router.put('/deleteSet',deleteSet);
router.get('/getSetElements',getSetElements);
router.post('/addElementToSet',addElementToSet);
router.put('/removeElementFromSet',removeElementFromSet);

module.exports = router;

