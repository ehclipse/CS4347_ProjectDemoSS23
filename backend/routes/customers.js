// routes for customer
const express = require('express');
const router = express.Router();

const db = require('../database');

// GET Requests
router.get('/', async (req, res) => {
    const group_by_attributes = req.query.group_by_attributes; // the groupby condition if any
    const fields = req.query.fields; // which attributes to get
    const count = req.query.count; // whether to use the count() aggregate function, attributes for executing count on
    const join = req.query.join; // whether to join a table 
    const where = req.query.where ? req.query.where.split(',') : null;// for where conditions
    var results = null;
    const natjoin = req.query.natjoin; // indicate whether theres a natural join
    const orderBy = req.query.orderBy; // attributes to order by
    const limit = req.query.limit // how many tuples to get
    const sum = req.query.sum; // sum 
    const desc = req.query.desc;

    if(group_by_attributes && fields && count && natjoin && orderBy && limit && desc)
    {
        const parsedSum = sum.split(',');
        var processedSum = "";
        for(var i = 0; i < parsedSum.length; i++)
        {
            processedSum += `sum(${parsedSum[i]}),`;
        }
        results = await db.query(`SELECT ${processedSum} count(${count}), ${fields} FROM CUSTOMERS NATURAL JOIN ${natjoin} GROUP BY ${group_by_attributes} ORDER BY count(${orderBy}) ${desc} limit ${limit};`)
    }
    else
        results = await db.query(`SELECT * FROM CUSTOMERS;`)
    
    res.status(200).send(results[0]);
})


module.exports = router