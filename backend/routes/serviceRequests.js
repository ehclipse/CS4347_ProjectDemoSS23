// routes for service requests
const express = require('express');
const router = express.Router();

// GET Requests
router.get('/', (req, res) => {
    res.send('service requests')
})

router.get('/:id', (req, res) => {
    res.send(`Gets service request with ID ${req.params.id}`)
})



// POST Requests
router.post('/', (req, res) => {
    res.send('Create service request')
})


// DELETE Requests
router.post('/:id', (req, res) => {
    res.send(`Delete service request with ID ${req.params.id}`)
})


module.exports = router