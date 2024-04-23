import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, } from '@mui/material';
import axios from 'axios';
import { base_url } from 'app/utils/constant';


const StatusCard = (props) => {

  const currentDate = new Date();
  const currentYearString = currentDate.getFullYear().toString();

  const [paid, setPaid] = useState(0)
  const [unpaid, setUnpaid] = useState(0)

 

  useEffect(() => {
    
    setPaid(props.total_sells_paid)
    setUnpaid(props.total_sells_unpaid)
 


  }, []);


  const total = parseInt(paid + unpaid);
  const paidPercentage =  (paid / total) * 100;
  const unpaidPercentage = (unpaid / total) * 100;



  const cardStyle = {
    padding: '10px',
    marginBottom: '10px',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    borderRadius: '8px',
    background: '#fafafa',
  };

  const boxStyle = {
    paddingBottom: '10px',

  };

  const labelBoxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  };

  const underlineStyle = {
    borderBottom: '2px solid lightgrey', // Gray underline at the bottom
    marginBottom: '30px',
  };

  const progressBarWithLabel = (value, label, percentage, color) => (
    <Box style={boxStyle}>
      <Box style={labelBoxStyle}>
        <Typography style={{ color: color, fontWeight: "600" }}>{value} {label}</Typography>
        <Typography>{parseFloat(percentage.toFixed(2))|| 0}%</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          '&.MuiLinearProgress-root': {
            height: '10px',
            borderRadius: '5px',
            backgroundColor: 'lightgrey', // Empty bar color
          },
          '& .MuiLinearProgress-bar': {
            backgroundColor: color, // Filled bar color
          },
        }}
      />
    </Box>
  );







  return (
    <Card style={cardStyle}>

      <CardContent >
        <div style={{ marginBottom: '20px', }}>
          <Typography variant="h6">Sells Overview</Typography>
        </div>

        {progressBarWithLabel(paid, 'Paid',paidPercentage, '#198754')}
        {progressBarWithLabel(unpaid, 'Unpaid',unpaidPercentage, '#dc3545')}
      </CardContent>

    </Card>
  );
};

export default StatusCard;