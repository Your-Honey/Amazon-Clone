import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/esm/Button";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import { toast } from "react-toastify";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";

const reducer=(state,action)=>{
    switch(action.type){
        case "FETCH_REQUEST":
            return {...state,loading:true};
        case "FETCH_SUCCESS":
            return {...state,loading:false};
        case "FETCH_FAIL":
            return {...state,loading:false,error:action.payload};

        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };
            
        default:
            return {...state};
    }
}

export default function UserEditScreen(){
    const {id:userId}=useParams();

    const {state}=useContext(Store);
    const {userInfo}=state;

    const navigate=useNavigate();

    const [{loading,error,loadingUpdate},dispatch]=useReducer(reducer,{loading:true,error:'',loadingUpdate:false});

    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [isAdmin,setIsAdmin]=useState(false);

    useEffect(()=>{
        try{
            dispatch({type:"FETCH_REQUEST"});
            const fetchData=async()=>{
                const {data}=await axios.get(`/api/users/${userId}`,
                {headers:{Authorization: `Bearer ${userInfo.token}`}})
                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin);
            }
            dispatch({type:"FETCH_SUCCESS"});
            fetchData();

        }
        catch(err)
        {
            dispatch({type:"FETCH_FAIL",payload:getError(err)});
            toast.error(getError(err));
        }
    },[userId,userInfo])
    
    const sumbitHandler=async(e)=>{
        e.preventDefault();
        try{
         dispatch({type:"UPDATE_REQUEST"});

        await axios.put(`/api/users/${userId}`,{
            _id:userId,name,email,isAdmin
        },{
            headers:{Authorization: `Bearer ${userInfo.token}`}
        });

        dispatch({type:"UPDATE_SUCCESS"});
        navigate("/admin/user");
        toast.success("Update Success");
    }
    catch(err){
        dispatch({type:'UPDATE_FAIL'});
        toast.error(getError(err));
    }
    }

    return (<>
        <Helmet>
            <title>Edit User {userId}</title>
        </Helmet>
        <h1>Edit User {userId}</h1>
        {loading ? <LoadingBox></LoadingBox>:
        error?<MessageBox variant="danger">{error}</MessageBox>:
        <Form onSubmit={sumbitHandler}>
            <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control value={name} onChange={(e)=>setName(e.target.value)} ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control value={email} onChange={(e)=>setName(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Check
            className="mb-3"
            type="checkbox"
            id="isAdmin"
            label="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
            <div className="mb-3">
                <Button disabled={loadingUpdate} type="submit">Update</Button>
                {loadingUpdate&&<LoadingBox></LoadingBox>}
            </div>
        </Form>
    }
        </>);
}