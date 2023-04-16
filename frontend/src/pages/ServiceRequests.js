// Service Requests page where users can get data regarding service requests

import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const ServiceRequests = () => {

    // Different kinds of queries we want our user to be able to do
    const serviceRequestQueryOptions = ['Problematic Vehicles'];
    
    const [selectedQuery, setSelectedQuery] = useState(null);

    const [data, setData] = useState(null);

    useEffect(() => {
        

        // if selectedQuery is not null then make a query to the api based on which query they selected
        if(selectedQuery){
            switch(selectedQuery){
                case "Problematic Vehicles":
                    // Make an api request for problematic vehicles
                    fetch('/serviceRequests', {
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
    }, [selectedQuery])
    



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

const optionsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '25rem',
    width: '40.625rem',
    backgroundImage: `url()`
 //   backgroundColor:'white',
    /*"-webkit-box-shadow": "10px 7px 20px 0px rgba(0,0,0,0.51)",
    "-moz-box-shadow": "10px 7px 20px 0px rgba(0,0,0,0.51)",
    "box-shadow": "10px 7px 20px 0px rgba(0,0,0,0.51)",*/
  
}

export default ServiceRequests