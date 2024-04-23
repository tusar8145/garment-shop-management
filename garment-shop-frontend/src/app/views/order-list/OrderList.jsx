
import { Autocomplete, Box, Button, Icon, IconButton, Grid, TextField, styled, } from '@mui/material';
import { Breadcrumb } from "app/components";
import useAuth from 'app/hooks/useAuth';
import axios from "axios";
import * as React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { base_url } from 'app/utils/constant';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as common from "../common";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import "../courier/myStyle.css";
import Modal from '@mui/material/Modal';
import Select from 'react-select'
import Paper from '@mui/material/Paper';
import toast, { Toaster } from 'react-hot-toast';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import convertToMonth from '../dashboard/shared/NumberToMonth';
import ButtonBase from '@mui/material/ButtonBase';
import { Padding } from '@mui/icons-material';

import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


//import { DatePicker } from 'antd';
//import dayjs from 'dayjs';
//import customParseFormat from 'dayjs/plugin/customParseFormat';

axios.defaults.headers.common['authorization'] = 'JWT ' + window.localStorage.getItem('authorization');
const ContentBox = styled(Box)(({ theme }) => ({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& small': { color: theme.palette.text.secondary }, '& .icon': { opacity: 0.6, fontSize: '44px', color: theme.palette.primary.main }, }));

const handleFocus = (event) => { event.target.select(); }






const Order = () => {
  const { logout, user } = useAuth();


  const [order, setpurchase] = useState([])


  const [delivery_status_list, setdelivery_status_list] = useState([
    { label: 'Pending', value: 'Pending', color: '#E38627' },
    { label: 'Confirmed', value: 'Confirmed', color: '#E38627' },
    { label: 'Pickedup', value: 'Pickedup', color: '#C13C37' },
    { label: 'Ontheway', value: 'Ontheway', color: '#C13C37' },
    { label: 'Delivered', value: 'Delivered', color: '#C13C37' },
    { label: 'Cancelled', value: 'Cancelled', color: '#C13C37' },
  ])

  const [payment_status_list, setpayment_status_list] = useState([
    { label: 'Paid', value: 'Paid', color: '#E38627' },
    { label: 'Unpaid', value: 'Unpaid', color: '#C13C37' },
  ])

  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });



  const getpurchase = () => {
    const res = axios.post(base_url + "order/list?take=&&skip=", {}).then((response) => {
      let filtered = []
      for (let x = 0; x < response.data.data.length; x++) {
        let this_d = response.data.data[x]
        filtered.push(this_d)
      }
      setpurchase(filtered)

    }).catch(function (error) {
      if (error.response) {
        console.log(error.response.data.data, 'error');
        toast.error('Error fetching Flat data'); // Show error message
      }
    });
  };


  useEffect(() => { getpurchase(); }, []);







  function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
    price: number,
  ) {
    return {
      name,
      calories,
      fat,
      carbs,
      protein,
      price,
      history: [
        {
          date: '2020-01-05',
          customerId: '11091700',
          amount: 3,
        },
        {
          date: '2020-01-02',
          customerId: 'Anonymous',
          amount: 1,
        },
      ],
    };
  }

  function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row?.id}
          </TableCell>
          <TableCell align="left">{common.date_formate(row?.date)}</TableCell>
          <TableCell align="left">{row?.customers?.name}</TableCell>
          <TableCell align="right">{row?.delivery_status}</TableCell>
          <TableCell align="right">{row?.payment_status}</TableCell>
          <TableCell align="right">৳{row?.grand_total}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Order Details
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Garment</TableCell>
                      <TableCell align="right">Purchase Price</TableCell>
                      <TableCell align="right">Order Value</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Total price ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row?.order_detail_orders?.map((history) => (
                      <TableRow key={history?.date}>
                        <TableCell component="th" scope="row">
                          {history?.garments?.name}
                        </TableCell>
                        <TableCell align="right">{history?.garments?.purchase_price}</TableCell>
                        <TableCell align="right">{history?.garments?.unit_price - history?.garments?.discount}</TableCell>
                        <TableCell align="right">{history?.quantity}</TableCell>
                        <TableCell align="right">
                          {Math.round((history?.garments?.unit_price-history?.garments?.discount) * history?.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  const rows = [
    createData('Frozen yoghurt', 1, 2, 24, 4.0, 3.99),
  ];

  return (
    <Fragment>
      <ContentBox className="analytics">




        <Grid container spacing={2} columns={12} style={{ marginLeft: "20px" }}>

          <Grid item xs={12} style={{ padding: "40px", }}>
            <p style={{ "text-align": "center" }}> <b>Order List </b> </p>
            <Grid container spacing={{ xs: 2, md: 3 }} style={{ marginTop: "20px", }} columns={{ xs: 8, sm: 8, md: 12 }}>



              <TableContainer component={Paper} style={{padding:"20px"}}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Order ID</TableCell>
                      <TableCell align="">Date</TableCell>
                      <TableCell align="left">customer</TableCell>
                      <TableCell align="right">Delivery Status</TableCell>
                      <TableCell align="right">Payment Status</TableCell>
                      <TableCell align="right">Grand Total</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.map((row) => (
                      <Row key={row?.id} row={row} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>


        <Toaster />

      </ContentBox>
    </Fragment >
  )
};
export default Order