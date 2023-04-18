// routes for customer
const express = require('express');
const router = express.Router();

const db = require('../database');

// GET Requests
router.get('/', async (req, res) => {
    const group_by_attributes = req.query.group_by_attributes; // the groupby condition if any
    const fields = req.query.fields; // which attributes to get
    const count = req.query.count; // whether to use the count() aggregate function, attribute for executing count on
    const join = req.query.join; // whether to join a table 
    const where = req.query.where ? req.query.where.split(',') : null;// for where conditions
    var results = null;

    if(group_by_attributes && fields && count)
        results = await db.query(`SELECT ${fields}, count(${count}) FROM EMPLOYEES GROUP BY ${group_by_attributes};`)
    else if(fields && where && join){
        var parsedWhere = "";
        for(var i = 0; i < where.length-1; i+=2){
            parsedWhere +=  `${where[i]}=${where[i+1]}`;
            if(i+2 < where.length-1)
                parsedWhere += " and "
        }
        results = await db.query(`SELECT ${fields} FROM EMPLOYEES JOIN ${join} WHERE ${parsedWhere}`)
    }
    else
        results = await db.query(`SELECT * FROM EMPLOYEES;`)
    
    res.status(200).send(results[0]);
})

module.exports = router