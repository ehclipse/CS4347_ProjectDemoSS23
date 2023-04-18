// Service Requests page where users can get data regarding service requests

import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import BarGraph from '../components/BarGraph';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const ServiceRequests = () => {

    // Different kinds of queries we want our user to be able to do
    const serviceRequestQueryOptions = ['Problematic Vehicles', 'Number of Cleaner, Technician and Mechanic Employees', 'List of Technicians', 'List of Cleaners', 'List of Mechanics', 'Top 10 Customers w/ Most Rides'];
    
    const [selectedQuery, setSelectedQuery] = useState(null);

    const [data, setData] = useState(null);
    const [chartData, setChartData] = useState({
        datasets: []
    }); // data used for the chart

    const [result, setResult] = useState(null);

    useEffect(() => {
        // setState() is always asynch so it may take time to update the component, so when the charData state is changed, it will call useeffect again, which will update the result component here
        if(chartData.labels){
            setResult(<div style={barGraphContainer}><BarGraph data={chartData}/></div>);
        }
        // if selectedQuery is not null then make a query to the api based on which query they selected
        if(selectedQuery){
            switch(selectedQuery){
                case "Problematic Vehicles":
                    setData(null);
                    // Make an api request for problematic vehicles
                    fetch('/serviceRequests?fields=*&group_by_attributes=vehicle_id&count=request_id&join=vehicles', {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                        }
                    })
                    .then(res => {
                        if(res.ok){
                            return res.json();
                        }
                        throw res;
                    })
                    .then(data => {
                        setData(data);
                        setSelectedQuery(null);
                        console.log(data);
                        const newChartData = {
                            labels: data.map((dataItem) => `${dataItem.vehicle_make} ${dataItem.vehicle_id}`),
                            datasets: [{
                                label: "Total Number of Service Requests",
                                data: data.map((dataItem) => dataItem["count(request_id)"]),
                                backgroundColor: ["rgba(108,207,246, 0.5)"],
                                borderColor: "rgba(108,207,246, 1)",
                                borderWidth: 2
                            }]
                        };
                        
                        setChartData(newChartData);
                        setResult(<div style={barGraphContainer}><BarGraph data={chartData}/></div>);
                        
                    })
                    .catch(error => {
                        console.error("Error fetching data", error);
                    })
                    break;
                case "Number of Cleaner, Technician and Mechanic Employees":
                    setData(null);
                     // Make an api request for total technicians, mechanics, cleaners
                     fetch('/employees?fields=job_title&group_by_attributes=job_title&count=job_title', {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                        }
                       
                    })
                    .then(res => {
                        if(res.ok){
                            return res.json();
                        }
                        throw res;
                    })
                    .then(data => {
                        setData(data);
                        setSelectedQuery(null);
                        console.log(data);
                        const newChartData = {
                            labels: data.map((dataItem) => `${dataItem.job_title}`),
                            datasets: [{
                                label: "Number of Cleaner, Technician and Mechanic Employees",
                                data: data.map((dataItem) => dataItem["count(job_title)"]),
                                backgroundColor: ["rgba(108,207,246, 0.5)"],
                                borderColor: "rgba(108,207,246, 1)",
                                borderWidth: 2
                            }]
                        };
                        
                        setChartData(newChartData);
                        setResult(<div style={barGraphContainer}><BarGraph data={chartData}/></div>);
                        
                    })
                    .catch(error => {
                        console.error("Error fetching data", error);
                    })
                    break;
                case "List of Technicians":
                    setData(null);
                    setSelectedQuery(null);
                     // Make an api request for total technicians, mechanics, cleaners
                     fetch('/employees?fields=employee_id,job_title,first_name,last_name,phone_number,email,pay_rate,shift,certifications&where=job_title,"technician",employee_id,technician_id&join=technicians', {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                        }
                       
                    })
                    .then(res => {
                        if(res.ok){
                            return res.json();
                        }
                        throw res;
                    })
                    .then(data => {
                        setData(data);
                        setSelectedQuery(null);
                        console.log(data);
                        setChartData({datasets: []});
                        setResult(
                            <div style={tableContainer}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>Employee ID</TableCell>
                                            <TableCell align="center">Job Title</TableCell>
                                            <TableCell align="center">First Name</TableCell>
                                            <TableCell align="center">Last Name</TableCell>
                                            <TableCell align="center">Phone Number</TableCell>
                                            <TableCell align="center">Email</TableCell>
                                            <TableCell align="center">Pay Rate</TableCell>
                                            <TableCell align="center">Shift</TableCell>
                                            <TableCell align="center">Certifications</TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {data.map((dataitem) => (
                                            <TableRow
                                            key={dataitem.employee_id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" align="center">{dataitem.employee_id}</TableCell>
                                                <TableCell align="center">{dataitem.job_title}</TableCell>
                                                <TableCell align="center">{dataitem.first_name}</TableCell>
                                                <TableCell align="center">{dataitem.last_name}</TableCell>
                                                <TableCell align="center">{dataitem.phone_number}</TableCell>
                                                <TableCell align="center">{dataitem.email}</TableCell>
                                                <TableCell align="center">{dataitem.pay_rate}</TableCell>
                                                <TableCell align="center">{dataitem.shift}</TableCell>
                                                <TableCell align="center">{dataitem.certifications}</TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        )
                        
                    })
                    .catch(error => {
                        console.error("Error fetching data", error);
                    })
                    break;
                case "List of Cleaners":
                    setData(null);
                    setSelectedQuery(null);
                        // Make an api request for total technicians, mechanics, cleaners
                        fetch('/employees?fields=employee_id,job_title,first_name,last_name,phone_number,email,pay_rate,shift,average_clean_time&where=job_title,"cleaner",employee_id,cleaner_id&join=cleaners', {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                        }
                        
                    })
                    .then(res => {
                        if(res.ok){
                            return res.json();
                        }
                        throw res;
                    })
                    .then(data => {
                        setData(data);
                        setSelectedQuery(null);
                        console.log(data);
                        setChartData({datasets: []});
                        setResult(
                            <div style={tableContainer}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>Employee ID</TableCell>
                                            <TableCell align="center">Job Title</TableCell>
                                            <TableCell align="center">First Name</TableCell>
                                            <TableCell align="center">Last Name</TableCell>
                                            <TableCell align="center">Phone Number</TableCell>
                                            <TableCell align="center">Email</TableCell>
                                            <TableCell align="center">Pay Rate</TableCell>
                                            <TableCell align="center">Shift</TableCell>
                                            <TableCell align="center">Average Cleaning Time</TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {data.map((dataitem) => (
                                            <TableRow
                                            key={dataitem.employee_id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" align="center">{dataitem.employee_id}</TableCell>
                                                <TableCell align="center">{dataitem.job_title}</TableCell>
                                                <TableCell align="center">{dataitem.first_name}</TableCell>
                                                <TableCell align="center">{dataitem.last_name}</TableCell>
                                                <TableCell align="center">{dataitem.phone_number}</TableCell>
                                                <TableCell align="center">{dataitem.email}</TableCell>
                                                <TableCell align="center">{dataitem.pay_rate}</TableCell>
                                                <TableCell align="center">{dataitem.shift}</TableCell>
                                                <TableCell align="center">{dataitem.average_clean_time}</TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        )
                        
                    })
                    .catch(error => {
                        console.error("Error fetching data", error);
                    })
                    break;
                case "List of Mechanics":
                    setData(null);
                    setSelectedQuery(null);
                     // Make an api request for total technicians, mechanics, cleaners
                     fetch('/employees?fields=employee_id,job_title,first_name,last_name,phone_number,email,pay_rate,shift,specialization&where=job_title,"mechanic",employee_id,mechanic_id&join=mechanics', {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                        }
                       
                    })
                    .then(res => {
                        if(res.ok){
                            return res.json();
                        }
                        throw res;
                    })
                    .then(data => {
                        setData(data);
                        setSelectedQuery(null);
                        console.log(data);
                        setChartData({datasets: []});
                        setResult(
                            <div style={tableContainer}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>Employee ID</TableCell>
                                            <TableCell align="center">Job Title</TableCell>
                                            <TableCell align="center">First Name</TableCell>
                                            <TableCell align="center">Last Name</TableCell>
                                            <TableCell align="center">Phone Number</TableCell>
                                            <TableCell align="center">Email</TableCell>
                                            <TableCell align="center">Pay Rate</TableCell>
                                            <TableCell align="center">Shift</TableCell>
                                            <TableCell align="center">Specialization</TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {data.map((dataitem) => (
                                            <TableRow
                                            key={dataitem.employee_id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" align="center">{dataitem.employee_id}</TableCell>
                                                <TableCell align="center">{dataitem.job_title}</TableCell>
                                                <TableCell align="center">{dataitem.first_name}</TableCell>
                                                <TableCell align="center">{dataitem.last_name}</TableCell>
                                                <TableCell align="center">{dataitem.phone_number}</TableCell>
                                                <TableCell align="center">{dataitem.email}</TableCell>
                                                <TableCell align="center">{dataitem.pay_rate}</TableCell>
                                                <TableCell align="center">{dataitem.shift}</TableCell>
                                                <TableCell align="center">{dataitem.specialization}</TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        )
                        
                    })
                    .catch(error => {
                        console.error("Error fetching data", error);
                    })
                    break;
                case "Top 10 Customers w/ Most Rides":
                    setData(null);
                    setSelectedQuery(null);
                     // Make an api request for total technicians, mechanics, cleaners
                     fetch('/customers?fields=customer_id,first_name,last_name&count=customer_id&sum=fare_cost,tip,distance_traveled&natjoin=rides&group_by_attributes=customer_id&orderBy=customer_id&limit=10&desc=desc', {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                        }
                       
                    })
                    .then(res => {
                        if(res.ok){
                            return res.json();
                        }
                        throw res;
                    })
                    .then(data => {
                        setData(data);
                        setSelectedQuery(null);
                        console.log(data);
                        setChartData({datasets: []});
                        setResult(
                            <div style={tableContainer}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>Customer ID</TableCell>
                                            <TableCell align="center">First Name</TableCell>
                                            <TableCell align="center">Last Name</TableCell>
                                            <TableCell align="center">Total Rides</TableCell>
                                            <TableCell align="center">Total Fare Cost</TableCell>
                                            <TableCell align="center">Total Tip</TableCell>
                                            <TableCell align="center">Total Distance Traveled</TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {data.map((dataitem) => (
                                            <TableRow
                                            key={dataitem.employee_id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" align="center">{dataitem.customer_id}</TableCell>
                                                <TableCell align="center">{dataitem.first_name}</TableCell>
                                                <TableCell align="center">{dataitem.last_name}</TableCell>
                                                <TableCell align="center">{dataitem["count(customer_id)"]}</TableCell>
                                                <TableCell align="center">{dataitem["sum(fare_cost)"]}</TableCell>
                                                <TableCell align="center">{dataitem["sum(tip)"]}</TableCell>
                                                <TableCell align="center">{dataitem["sum(distance_traveled)"]}</TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        )
                        
                    })
                    .catch(error => {
                        console.error("Error fetching data", error);
                    })
                    break;
                default:
                    break;
            }
        }

    
        return;
    }, [selectedQuery, chartData])
    



    return (
        <div style={containerStyle}>
            <h1 style={{fontSize: '40pt'}}>Select a Query</h1>
            <div>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={serviceRequestQueryOptions}
                    sx={{ width: 300, backgroundColor: 'white' }}
                    onChange={(event, value) => setSelectedQuery(value)}
                    renderInput={(params) => <TextField {...params} label="Queries" />}
                />
        
            </div>
            {data && result}

        </div>
    )
}

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100vw',

  
   // backgroundColor: '#FFAFAF'
}

const barGraphContainer = {
    width: '700px',
    margin: '50px 0',
    padding: '50px',
    "-webkit-box-shadow": "0px 10px 22px 0px rgba(0,0,0,0.36)",
    "-moz-box-shadow": "0px 10px 22px 0px rgba(0,0,0,0.36)",
    "box-shadow": "0px 10px 22px 0px rgba(0,0,0,0.36)"

}

const tableContainer = {
    margin: '50px 0',
    padding: '50px',
 /*   "-webkit-box-shadow": "0px 10px 22px 0px rgba(0,0,0,0.36)",
    "-moz-box-shadow": "0px 10px 22px 0px rgba(0,0,0,0.36)",
    "box-shadow": "0px 10px 22px 0px rgba(0,0,0,0.36)"*/
}



export default ServiceRequests