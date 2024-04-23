import { Autocomplete, Box, Card, Grid, Icon, CardContent, Typography, IconButton, styled, Tooltip, useTheme } from '@mui/material';
import { Breadcrumb } from "app/components";
import Checkbox from '@mui/material/Checkbox';
import { Small } from 'app/components/Typography';
import useAuth from 'app/hooks/useAuth';
import axios from "axios";
import * as React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { base_url } from '../../utils/constant';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { DatePicker, Select } from 'antd';
 
import dayjs from 'dayjs';

import StatusCard from './StatusCard';


axios.defaults.headers.common['authorization'] = 'JWT ' + window.localStorage.getItem('authorization');

const TextField = styled(TextValidator)(() => ({ width: "100%", marginBottom: "16px", }));
const { format } = require('date-fns');
const Title = styled('span')(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginRight: '.5rem',
  textTransform: 'capitalize',
}));

const cardStyle = {
  padding: '12px',
  marginBottom: '10px',
  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
  borderRadius: '8px',
  background: '#fafafa',
};

const SubTitle = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

const H4 = styled('h4')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginBottom: '16px',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px !important',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: { padding: '16px !important' },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  '& small': { color: theme.palette.text.secondary },
  '& .icon': { opacity: 0.6, fontSize: '44px', color: theme.palette.primary.main },
}));

const Heading = styled('h6')(({ theme }) => ({
  margin: 0,
  marginTop: '4px',
  fontSize: '14px',
  fontWeight: '500',
  color: theme.palette.primary.main,
}));

const Analytics = () => {

  const [total_sells, settotal_sells] = useState(0);
  const [total_purchase, settotal_purchase] = useState(0);
  const [total_sells_paid, settotal_sells_paid] = useState(0);
  const [total_sells_unpaid, settotal_sells_unpaid] = useState(0);
  const [total_sells_profit, settotal_sells_profit] = useState(0);

 
 
  const { logout, user } = useAuth();
  const filterItems = (arr, field, value) => { try { if (field != null) { return arr.filter((item) => { return item[field].includes(value) }) } } catch (error) { console.error(error); } }
  const filterItemsequal = (arr, field, value) => { try { if (field != null) { return arr.filter((item) => { return item[field] == value }) } } catch (error) { console.error(error); } }

  const getpurchase = () => {
    const res = axios.post(base_url + "purchase/list?take=&&skip=", {}).then((response) => {
      let _total_purchase=0
      for (let x = 0; x < response.data.data.length; x++) {
        let this_d = response.data.data[x]
        _total_purchase=_total_purchase+this_d.grand_total
      }
      settotal_purchase(_total_purchase)
    }).catch(function (error) {
    });
  };

  const getorder = () => {
    const res = axios.post(base_url + "order/list?take=&&skip=", {}).then((response) => {
      let _total_order=0
      let _total_Paid_order=0
      let _total_UnPaidorder=0
      let _profit=0
      for (let x = 0; x < response.data.data.length; x++) {
        let this_d = response.data.data[x]
        _total_order=_total_order+this_d.grand_total
        console.log(this_d.payment_status,'kkk')
        if(this_d.payment_status=="Paid"){
          _total_Paid_order=_total_Paid_order+this_d.grand_total
        }else{
          _total_UnPaidorder=_total_UnPaidorder+this_d.grand_total
        }

        for(let k=0; k<this_d.order_detail_orders.length;k++){
          let this_order_detail_orders = this_d.order_detail_orders[k]
           _profit=_profit+(this_order_detail_orders.price*this_order_detail_orders.quantity)-(this_order_detail_orders.garments.purchase_price*this_order_detail_orders.quantity)
          }
      }
      settotal_sells_profit(_profit)
      console.log(_total_Paid_order,_total_UnPaidorder,'kkk')

      settotal_sells(_total_order)
      settotal_sells_paid(_total_Paid_order)
      settotal_sells_unpaid(_total_UnPaidorder)

    }).catch(function (error) {
    });
  };

  useEffect(() => {

    getpurchase()
    getorder()
 
  }, []);





  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={6}>

          <Grid item lg={12} md={12} sm={12} xs={12}>


            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div style={{ margin: "2%", borderRadius: "3px", padding: "10px", }}>
                <Grid container spacing={3} >


                  <Grid item lg={4} md={4} sm={12} xs={12}>
                    {(total_sells_paid>0 || total_sells_unpaid) &&
                        <StatusCard  
                        total_sells_paid={total_sells_paid} 
                        total_sells_unpaid={total_sells_unpaid}
                        />                    
                    }

                  </Grid>
            

                    <Grid item lg={4} md={4} sm={12} xs={12}>
                      <Card style={cardStyle}>


                        <CardContent >
                          <div style={{ marginBottom: '20px', }}>
                            
                          </div>
                          <div style={{ marginTop: '30px', textAlign: 'center', background: '#ffffff', }}>

                            <Card sx={{ minWidth: 275, background: '#ffffff', marginTop: '10px', }} >
                                <Box ml="12px">
                                  <Typography variant="h6">Total Sells</Typography>
                                  <Heading >৳{total_sells}</Heading>
                                </Box>
                            </Card>

                            <Card sx={{ minWidth: 275, background: '#ffffff', marginTop: '10px', }} >
                                <Box ml="12px">
                                  <Typography variant="h6">Total Purchase</Typography>
                                  <Heading >৳{total_purchase}</Heading>
                                </Box>
                            </Card>


                          </div>
                        </CardContent >
                      </Card>
                    </Grid>
                 


                  <Grid item lg={2} md={2} sm={12} xs={12}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Grid container spacing={3} sx={{ mb: '24px' }}>
                          <Grid item xs={12} md={12}  >
                            <StyledCard elevation={6}>
                              <ContentBox>
                                <Icon className="icon">sss</Icon>
                                <Box ml="12px">
                                  <Small>Sells Profit</Small>
                                  <Heading >৳{total_sells_profit}</Heading>
                                </Box>
                              </ContentBox>
                            </StyledCard>
                          </Grid>
                      </Grid>
                    </Grid>
                  </Grid> 

                </Grid>




              </div>
            </Grid>




          </Grid>
        </Grid>
      </ContentBox >

    </Fragment >
  );
};

export default Analytics;
