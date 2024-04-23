
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

const Purchase = () => {
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

  const getGarment = () => {
    const res = axios.post(base_url + "garment/list?take=&&skip=", {}).then((response) => {
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


  useEffect(() => { getSupplier(); getGarment();
  
    let temp=localStorage.getItem("cart");
    if(temp){
      setcart(JSON.parse(temp))
    }

    let total=0
    let temp_obj=JSON.parse(temp)
    for(let k=0; k<temp_obj?.length;k++){
      total=total+(temp_obj[k].purchase_price*temp_obj[k].quantity)
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


  return (
    <Fragment>
      <ContentBox className="analytics">




        <Grid container spacing={2} columns={16} style={{  padding:"35px"}}>
          <Grid item xs={5}>


            <p> <b>Select Supplier: </b> </p>
            <Select
              placeholder={"Select Supplier"}
              defaultValue={""}
              onChange={(choice) => {
                setsupplier_id(choice.value)
              }} options={supplier} />


            <p> <b>Select Delivery Status: </b> </p>
            <Select
              placeholder={"Select Delivery Status"}
              defaultValue={""}
              onChange={(choice) => {
                setdelivery_status(choice.value)
              }} options={delivery_status_list} />



            <p> <b>Select Payment Status: </b> </p>
            <Select
              placeholder={"Select Payment Status"}
              defaultValue={""}
              onChange={(choice) => {
                setpayment_status(choice.value)
              }} options={payment_status_list} />


            <p></p>

            <p> <b>Cart List: </b> </p>
            <table>
 
              <tbody>
              {cart.map((child, index) => (
                <tr style={{ background: "aliceblue", borderTop: "2px solid black", }}>
                  <td class="b_zero" style={{ width: "5%", textAlign: "right", padding: "25px" }} >
                 
                  {index+1}
                  </td>
                  <td class="b_zero" style={{ width: "45%", textAlign: "left", padding: "25px" }} >
                  {child.name}
                  </td>
                  <td class="b_zero" style={{ width: "20%", textAlign: "right", padding: "20px" }}  >
                    <x>৳{child. purchase_price}</x>
                  </td>
                  <td class="b_zero" style={{ width: "20%", textAlign: "right", padding: "20px" }}  >
                  Qty: {child.quantity}
                  </td>
                </tr>
              ))}

 
                {cart.length > 0 && <>
                  <tr style={{ background: "aliceblue", borderTop: "2px solid black", }}>
                    <td class="b_zero" colspan="4" style={{ width: "100%", textAlign: "center", padding: "20px" }}  >
                      <Button
                        variant="outlined"
                        onClick={() => {
                          localStorage.setItem("cart", JSON.stringify([]));
                          setcart([])
                          setcart_total(0)
                        }
                        }
                        color={'secondary'}
                      >
                        Clear Cart
                      </Button>
                    </td>
                  </tr>
                </>
                }

              </tbody>
            </table>

            {cart_total > 0 && <>
              <p style={{ width: "100%", textAlign: "center", padding: "20px" , color: "green"}}>
                <p>Total= ৳{cart_total}</p>
              </p>
            </>
            }


            {cart_total == 0 && <>
              <p style={{ width: "100%", textAlign: "center", padding: "20px" , color: "red"}}>
                <i>Cart is empty</i>
              </p>
            </>
            }

          {supplier_id > 0 && delivery_status !=null && payment_status !=null  &&  cart_total > 0 && <>
              <p style={{ width: "100%", textAlign: "center", padding: "0px" , color: "green"}}>
         
                      <Button
                        variant="outlined"
                      
                        onClick={() => {

                          let gar_list=[]
                          for(let k=0;k<cart.length;k++){
                            gar_list.push({
                              "garment_id":cart[k].garment_id,  "quantity":cart[k].quantity
                            })
                          }

                          const res = axios.post(base_url + "purchase/create", {

                            "supplier_id":supplier_id,
                            "delivery_status":delivery_status,
                            "payment_status":payment_status,
                            "date":new Date(),
                            "purchase_details": gar_list

                          }).then((response) => {
                            toast.success('Purchase Successful');
                            localStorage.setItem("cart", JSON.stringify([]));
                            setcart([])
                            setcart_total(0)
                            getGarment()
                          }).catch(function (error) {
                              toast.error('Purchase Unsuccessful'); // Show error message
                          });

                        }
                        }
                        color={'primary'}
                      >
                        Confirm Purchase
                        
                      </Button>
              </p>
            </>
            }


          </Grid>


          <Grid item xs={11}  style={{ Padding: "2px", }}>
          <p style={{"text-align":"center"}}> <b>Garments List </b> </p>
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
                          <Img alt="complex" src="/assets/images/fab1.png" />
                        </ButtonBase>
                      </Grid>
                      <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                          <Grid item xs>
                            <Typography gutterBottom variant="subtitle1" component="div">
                              {child.name}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              Stock: {child.stock}
                            </Typography>
                          </Grid>
 
                          
                          <Grid item>
                            <Typography sx={{ cursor: 'pointer' }} variant="body2">

                              <Button
                                variant="outlined"
                                onClick={() => {
                                    let temp_obj=[]
                                    let temp=localStorage.getItem("cart");
                                    let flag=0
                                    if(temp){
                                      let temp_obj_0=JSON.parse(temp)
                                        for(let j=0; j<temp_obj_0.length;j++){
                                            if(temp_obj_0[j].garment_id==child.id){
                                              flag=1
                                              temp_obj.push({
                                                garment_id:child.id,
                                                name:child.name,
                                                 purchase_price:child. purchase_price,
                                                quantity:temp_obj_0[j].quantity+1
                                              })
                                            }else{
                                              temp_obj.push({
                                                garment_id:temp_obj_0[j].garment_id,
                                                name:temp_obj_0[j].name,
                                                 purchase_price:temp_obj_0[j]. purchase_price,
                                                quantity:temp_obj_0[j].quantity
                                              })
                                            }
                                        }

                                    }else{
                                      flag=0
                                    }

                                        if(flag==0){
                                          let new_col=temp_obj.push({
                                            garment_id:child.id,
                                            name:child.name,
                                             purchase_price:child. purchase_price,
                                            quantity:1
                                          })
                                        }
let total=0
for(let k=0; k<temp_obj?.length;k++){
  total=total+(temp_obj[k].purchase_price*temp_obj[k].quantity)
}
setcart_total(total)

                                    localStorage.setItem("cart", JSON.stringify(temp_obj));
                                    setcart(temp_obj)   
                                 }
                                }
                                color={'secondary'}
                              >
                                Add to cart
                              </Button>
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle1" component="div">
                            ${child. purchase_price}
                          </Typography>
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
export default Purchase