import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import { useContext, useEffect, useState } from "react";
import CheckoutSteps from "./CheckoutStepsScreen";
import Button from "react-bootstrap/esm/Button";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";


export default function PaymentMethod(){
    const {state,dispatch:ctxDispatch}=useContext(Store);
    const {shippingAddress,paymentMethod}=state;
    const [paymentMethodName,setPaymentMethod]=useState(paymentMethod || '');
  
    const navigate=useNavigate();

    useEffect(()=>{
        if(!shippingAddress.address)
        {
            navigate("/shipping");
        }
    },[navigate,shippingAddress]);


    const submitHandler=(e)=>{
        ctxDispatch({type:'SAVE_PAYMENT_METHOD',playload:paymentMethodName});
        localStorage.setItem("paymentMethod",paymentMethodName);
        navigate('/placeorder');
    }


    return(
        <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </div>
    );
}