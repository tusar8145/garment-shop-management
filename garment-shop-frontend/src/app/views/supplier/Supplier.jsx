
 
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
 

//import { DatePicker } from 'antd';
//import dayjs from 'dayjs';
//import customParseFormat from 'dayjs/plugin/customParseFormat';

axios.defaults.headers.common['authorization'] = 'JWT ' + window.localStorage.getItem('authorization');
const ContentBox = styled(Box)(({ theme }) => ({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& small': { color: theme.palette.text.secondary }, '& .icon': { opacity: 0.6, fontSize: '44px', color: theme.palette.primary.main }, }));

const handleFocus = (event) => { event.target.select(); }

const Supplier = () => {
  const { logout, user } = useAuth();

  const [cart, setcart] = useState([])
  const [cart_total, setcart_total] = useState(0)

  const [supplier_id, setsupplier_id] = useState(null)
  const [delivery_status, setdelivery_status] = useState(null)
  const [payment_status, setpayment_status] = useState(null)


  const [supplier, setsupplier] = useState([])
  const [garment, setgarment] = useState([])


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


  const getSupplier = () => {
    const res = axios.post(base_url + "supplier/list?take=&&skip=", {}).then((response) => {
      let filtered = []
      for (let x = 0; x < response.data.data.length; x++) {
        let this_d = response.data.data[x]
        filtered.push({
          label: this_d.name,
          value: this_d.id
        })
      }
      setsupplier(filtered)

    }).catch(function (error) {
      if (error.response) {
        console.log(error.response.data.data, 'error');
        toast.error('Error fetching Flat data'); // Show error message
      }
    });
  };

  const getCustomer = () => {
    const res = axios.post(base_url + "/supplier/list?take=&&skip=", {}).then((response) => {
      let filtered = []
      for (let x = 0; x < response.data.data.length; x++) {
        let this_d = response.data.data[x]
        filtered.push(this_d)
      }
      setgarment(filtered)

    }).catch(function (error) {
      if (error.response) {
        console.log(error.response.data.data, 'error');
        toast.error('Error fetching Flat data'); // Show error message
      }
    });
  };


  useEffect(() => { getSupplier(); getCustomer();
  
    let temp=localStorage.getItem("cart");
    if(temp){
      setcart(JSON.parse(temp))
    }

    let total=0
    let temp_obj=JSON.parse(temp)
    for(let k=0; k<temp_obj?.length;k++){
      total=total+(temp_obj[k].Customer_price*temp_obj[k].quantity)
    }
    setcart_total(total)
  
  }, []);



  const handleSubmit = (event) => {
    event.preventDefault();


    const res = axios.post(base_url + "supplier-create", {}).then((response) => {


    }).catch(function (error) {
      if (error.response) {
        console.log(error.response.data.data, 'error');
        // toast.error(' '); // Show error message
      }
    });
  };


  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');


 


  return (
    <Fragment>
      <ContentBox className="analytics">




        <Grid container spacing={2} columns={16} style={{  padding:"35px"}}>
          <Grid item xs={5}>

          <div style={{"padding":"15px", "background":"white", "border-radius":"5px"}}>
            <p> <b>Supplier Name: </b> </p>
            <TextField 
            label="Enter Name" 
            variant="outlined" 
            value={name} 
            onChange={
              (event) => {
                setName(event.target.value);
              }
            } 
            fullWidth
            margin="normal"
          />

            <p> <b>Supplier Email: </b> </p>
            <TextField 
            label="Enter Email" 
            variant="outlined" 
            value={email} 
            onChange={
              (event) => {
                setEmail(event.target.value);
              }
            } 
            fullWidth
            margin="normal"
          />
            <p> <b>Supplier Address: </b> </p>
            <TextField 
            label="Enter Address" 
            variant="outlined" 
            value={address} 
            onChange={
              (event) => {
                setAddress(event.target.value);
              }
            } 
            fullWidth
            margin="normal"
          />
            <p> <b>Supplier Phone: </b> </p>
            <TextField 
            label="Enter Phone" 
            variant="outlined" 
            value={phone} 
            onChange={
              (event) => {
                setPhone(event.target.value);
              }
            } 
            fullWidth
            margin="normal"
          />

            <p></p>
 
  
            <p style={{"text-align":"center"}}>


            {!(id>0) &&
                      <Button
                        variant="outlined"
                      
                        onClick={() => {

                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;




                          if(name && email && address && phone){


                              if (emailRegex.test(email)) {
                        
                                      const res = axios.post(base_url + "Supplier/create", {

                                        "name":name,
                                        "email":email,
                                        "address":address,
                                        "phone": phone

                                      }).then((response) => {

                                        if(response.data.success==false){
                                          toast.error(response.data.message);
                                        }else{
                                          toast.success(response.data.message);
                                        }
                                     
                                        setName("")
                                        setEmail("")
                                        setAddress("")
                                        setPhone("")

                                        getCustomer()
                                      }).catch(function (error) {
                                          toast.error('Supplier Fail to Create'); // Show error message
                                      });                         


                              } else {
                    
                                toast.error('Please enter a valid email address');
                              }





                          }else{
                            toast.error('Please input all field');
                          }
 

                        }
                        }
                        color={'primary'}
                      >
                         Create
                        
                      </Button>
                      }
 
{id>0 &&

                      <Button
                        variant="outlined"
                      
                        onClick={() => {

                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;




                          if(name && email && address && phone){


                              if (emailRegex.test(email)) {
                        
                                      const res = axios.post(base_url + "Supplier/update", {
                                        "id":id,
                                        "name":name,
                                        "email":email,
                                        "address":address,
                                        "phone": phone

                                      }).then((response) => {

                                        if(response.data.success==false){
                                          toast.error(response.data.message);
                                        }else{
                                          toast.success(response.data.message);
                                        }
                                        setId(null)
                                        setName("")
                                        setEmail("")
                                        setAddress("")
                                        setPhone("")

                                        getCustomer()
                                      }).catch(function (error) {
                                          toast.error('Supplier Fail to Update'); // Show error message
                                      });                         


                              } else {
                    
                                toast.error('Please enter a valid email address');
                              }





                          }else{
                            toast.error('Please input all field');
                          }
 

                        }
                        }
                        color={'primary'}
                      >
                         Update
                        
                      </Button>
}



                      </p>

</div>

          </Grid>


          <Grid item xs={11}  style={{ Padding: "2px", }}>
          <p style={{"text-align":"center"}}> <b>Suppliers </b> </p>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 8, sm: 8, md: 12 }}>
              {garment.map((child, index) => (
                <Grid item xs={4} sm={4} md={4} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      margin: 'auto',
                      maxWidth: 500,
                      flexGrow: 1,
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item>
                        <ButtonBase sx={{ width: 60, height: 60 }}>
                          <Img alt="complex" src="/assets/images/user.png" />
                        </ButtonBase>
                      </Grid>
                      <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                          <Grid item xs>
                            <Typography gutterBottom variant="subtitle1" component="div">
                              <b>Name:</b> {child.name}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                            <b>Email:</b> {child.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            <b>Address:</b> {child.address}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            <b>Phone:</b> {child.phone}
                            </Typography>
                          </Grid>
 
                          
                          <Grid item>
                            <Typography sx={{ cursor: 'pointer' }} variant="body2">

                              <Button
                                variant="outlined"
                                onClick={() => {
                                  const res = axios.post(base_url + "supplier/delete", {id:child.id}).then((response) => {
                                    toast.success('Delete Successfull'); 
                                    getCustomer();
                              
                                  }).catch(function (error) {
                                    if (error.response) {
                                      console.log(error.response, 'error2');
                                      toast.error('Unable to delete. This supplier have orders'); // Show error message
                                    }
                                  });   
                                 }
                                }
                                color={'secondary'}
                              >
                                Delete
                              </Button>
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setId(parseInt(child.id))
                                  setName(child.name)
                                  setEmail(child.email)
                                  setAddress(child.address)
                                  setPhone(child.phone)
                                 }
                                }
                                color={'primary'}
                              >
                                Edit
                              </Button>
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>

                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>


        <Toaster />

      </ContentBox>
    </Fragment >
  )
};
export default Supplier