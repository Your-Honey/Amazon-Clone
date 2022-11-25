import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import { useContext, useReducer, useState } from "react";
import { Store } from "../Store";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";

const reducer=(state,action)=>{
    switch (action.type) {

        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
             return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };

        default:
            return state;

    }
}


export default function ProfileScreen(){
    const [{loadingUpdate},dispatch]=useReducer(reducer,{loadingUpdate:false});
    const {state,dispatch:ctxDispatch}=useContext(Store);
    const {userInfo}= state;
    const [name,setName]=useState(userInfo.name);
    const [email,setEmail]=useState(userInfo.email);
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');

    const submitHandler= async(e)=>
    {
        e.preventDefault();
        try {
            if(password !==confirmPassword)
            {
                toast.error('Password Dont match...!!!');
                return;
            }
            const {data}= await axios.put("/api/users/profile",{
                name,
                email,
                password
            },
            {
                headers:{Authorization:`Bearer ${userInfo.token}`}
            });
            dispatch({type: 'UPDATE_SUCCESS',});
            ctxDispatch({type:'USER_SIGNIN',playload:data});
            localStorage.setItem("userInfo",JSON.stringify(data));
            toast.success('User update successfully');

        } catch (error) {
            dispatch({type: 'FETCH_FAIL',});
            toast.error(getError(error));
        }
    }
    return(<div className="container small-container">
        <Helmet>
        <title>User Profile</title>
        </Helmet>
        <h1>User Profile</h1>
        <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control value={name} onChange={(e)=>setName(e.target.value)} required/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="Password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required/>
        </Form.Group>
        <div className="mb-3">
        <Button type="submit">Update</Button>
    </div>
        </Form>
        </div>);
}