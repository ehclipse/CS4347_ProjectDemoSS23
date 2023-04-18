const express = require('express')


const app = express()

const PORT = 8080;

app.get('/', (req, res) => {
    res.status(200).send("Hi")
})


const serviceRequestRouter = require('./routes/serviceRequests')
app.use('/serviceRequests', serviceRequestRouter)

const customersRequestRouter = require('./routes/customers')
app.use('/customers', customersRequestRouter)

const employeesRequestRouter = require('./routes/employees')
app.use('/employees', employeesRequestRouter)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
