import { Helmet } from "react-helmet-async";
import  Form  from 'react-bootstrap/Form';
import CheckoutSteps from "./CheckoutStepsScreen";
import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";

export default function ShippingAddress(){

    const {state, dispatch:ctxDispatch}=useContext(Store);
    const navigate=useNavigate();

    const {userInfo,shippingAddress}=state;


    const [fullName,setFullName]=useState(shippingAddress.fullName || '');
    const [address,setAddress]=useState(shippingAddress.address ||'');
    const [city,setCity]=useState(shippingAddress.city ||'');
    const [postalCode,setPostalCode]=useState(shippingAddress.postalCode ||'');
    const [country,setCountry]=useState(shippingAddress.country ||'');

    const submitHandler=(e)=>{
        ctxDispatch({type:"SAVE_SHIPPING_ADDRESS",playload:{
            fullName,
            address,
            city,
            postalCode,
            country, 
        }});
        localStorage.setItem("shippingAddress",JSON.stringify({fullName,
            address,
            city,
            postalCode,
            country,}));

            navigate("/payment");
    }

    useEffect(()=>{
        if(!userInfo){
            navigate("/signin?redirect=/shipping");
        }
    },[navigate,userInfo]);

    return (
        <div>
        <Helmet>
        <title>Shipping Address</title>
        </Helmet>

        <CheckoutSteps step1 step2></CheckoutSteps>
        <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="fullName">
        <Form.Label>Full Name</Form.Label>
        <Form.Control
        value={fullName}
        onChange={(e)=>setFullName(e.target.value)}
        required
        />
        </Form.Group>
        <Form.Group className="mb-3" controlId="address">
        <Form.Label>Address</Form.Label>
        <Form.Control 
        value={address}
        onChange={(e)=>setAddress(e.target.value)}
        required
        />
        </Form.Group>
        <Form.Group className="mb-3" controlId="city">
        <Form.Label>City</Form.Label>
        <Form.Control 
        value={city}
        onChange={(e)=>setCity(e.target.value)}
        required
        />
        </Form.Group>
        <Form.Group className="mb-3" controlId="postalcode">
        <Form.Label>PIN Code</Form.Label>
        <Form.Control 
        value={postalCode}
        onChange={(e)=>setPostalCode(e.target.value)}
        required
        />
        </Form.Group>
        <Form.Group className="mb-3" controlId="country">
        <Form.Label>Country</Form.Label>
        <Form.Control 
        value={country}
        onChange={(e)=>setCountry(e.target.value)}
        required
        />
        </Form.Group>
        <div className="mb-3">
        <Button variant="primary" type="submit">
        Continue
        </Button>
        </div>
        </Form>
        </div>
        </div>
    );
}