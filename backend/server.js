const express = require('express')


const app = express()

app.get('/', (req, res) => {
    console.log("Hello from")
    res.status(200).send("Hi")
})


const serviceRequestRouter = require('./routes/serviceRequests')
app.use('/serviceRequests', serviceRequestRouter)

app.listen(3000)
