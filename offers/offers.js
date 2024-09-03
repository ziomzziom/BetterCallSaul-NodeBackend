const express = require('express');
const router = express.Router();
const { create, getAll, getOne, update, deleteOffer } = require('./controllers/create');

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', deleteOffer);

module.exports = router;