// routes for service requests
const express = require('express');
const router = express.Router();

const db = require('../database');

// GET Requests
router.get('/', async (req, res) => {

    const group_by_attributes = req.query.group_by_attributes; // the groupby condition if any
    const fields = req.query.fields; // which attributes to get
    const count = req.query.count; // whether to use the count() aggregate function
    const join = req.query.join; // tables to join 

    var results = null;
    
    if(group_by_attributes && count && join)
        results = await db.query(`SELECT ${fields}, count(${count}) FROM SERVICE_REQUESTS NATURAL JOIN ${join} GROUP BY ${group_by_attributes} ORDER BY count(${count}) DESC, vehicle_id ASC`) // should get a total number of vehicles and the total number of requests they have as well as their make
    else if(group_by_attributes)
        results = await db.query(`SELECT ${fields} FROM SERVICE_REQUESTS GROUP BY ${group_by_attributes}`)
    else
        results = await db.query(`SELECT ${fields} FROM SERVICE_REQUESTS`)

    res.status(200).send(results[0]);
})


module.exports = router