// routes for service requests
const express = require('express');
const router = express.Router();

const db = require('../database');

// GET Requests
router.get('/', async (req, res) => {
    const results = await db.query(`SELECT * FROM SERVICE_REQUESTS;`)
    res.status(200).send(results[0]);
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