// routes for customer
const express = require('express');
const router = express.Router();

const db = require('../database');

// GET Requests
router.get('/', async (req, res) => {
    const results = await db.query(`SELECT * FROM CUSTOMERS;`)
    res.status(200).send(results[0]);
})

router.get('/:id', (req, res) => {
    res.send(`Gets customers with ID ${req.params.id}`)
})



// POST Requests
router.post('/', (req, res) => {
    res.send('Create customers')
})


// DELETE Requests
router.post('/:id', (req, res) => {
    res.send(`Delete customers with ID ${req.params.id}`)
})


module.exports = router