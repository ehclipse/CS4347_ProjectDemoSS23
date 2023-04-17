// Service Requests page where users can get data regarding service requests

import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import BarGraph from '../components/BarGraph';

const ServiceRequests = () => {

    // Different kinds of queries we want our user to be able to do
    const serviceRequestQueryOptions = ['Problematic Vehicles'];
    
    const [selectedQuery, setSelectedQuery] = useState(null);

    const [data, setData] = useState(null);
    const [chartData, setChartData] = useState({
        datasets: []
    }); // data used for the chart

    const [result, setResult] = useState(null);

    useEffect(() => {

        // setState() is always asynch so it may take time to update the component, so when the charData state is changed, it will call useeffect again, which will update the result component here
        if(chartData){
            setResult(<div style={barGraphContainer}><BarGraph data={chartData}/></div>);
        }
        // if selectedQuery is not null then make a query to the api based on which query they selected
        if(selectedQuery){
            switch(selectedQuery){
                case "Problematic Vehicles":
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
                                backgroundColor: ["rgba(108,207,246, 0.7)"]
                            }]
                        };
                        
                        setChartData(newChartData);
                        setResult(<div style={barGraphContainer}><BarGraph data={chartData}/></div>);
                        
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
                    renderInput={(params) => <TextField {...params} label="Service Request Queries" />}
                />
        
            </div>
            {data && chartData && result}
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

export default ServiceRequests