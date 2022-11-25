import { Link, useNavigate, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function SingninScreen() {
    const {search}=useLocation();
    const navigate=useNavigate();
    const redirectUrl= new URLSearchParams(search).get('redirect');
    const redirect=redirectUrl?redirectUrl:"/";
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const {state,dispatch:ctxDispatch}=useContext(Store);
    const {userInfo}=state;

    const submitHandler= async (e)=>{
        e.preventDefault();
        try{
        const {data}= await axios.post("/api/users/signin",{
            email,
            password
        });
        ctxDispatch({type:'USER_SIGNIN',playload:data});
        localStorage.setItem("userInfo",JSON.stringify(data));
        navigate(redirect || '/');
        }
        catch(err){
            toast.error(getError(err));
        }
        
    };

    useEffect(()=>{
        if(userInfo)
        {
            navigate(redirect);
        }
    },[navigate,redirect,userInfo]);

    return (
        <Container className="small-container">

            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control onChange={(e)=>setEmail(e.target.value)} type="email" required/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={(e)=>setPassword(e.target.value)} type="password" required/>
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Sign In</Button>
                </div>
                <div className="mb-3">
                    New customer?{' '}
                    <Link to={`/Signup?redirect=${redirect}`}>Create your account</Link>
                </div>
            </Form>
        </Container>
    );

}