import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import Button from "react-bootstrap/esm/Button";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";

const reducer=(state,action)=>{
    switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_REQUEST':
      return {...state,loadingDelete:true,deleteSuccess:false};
    case 'DELETE_SUCCESS':
        return {...state,loadingDelete:false,deleteSuccess:true};
    case "DELETE_FAIL":
        return {...state,loadingDelete:false};
    case "DELETE_RESET":
        return {...state,deleteSuccess:false};
    default:
      return state;
    }
}

export default function OrderListScreen(){
    const [{loading,error,orders,loadingDelete,deleteSuccess},dispatch]=useReducer(reducer,{loading:true,error:''});
    const {state}=useContext(Store);
    const {userInfo}=state;
    const navigate=useNavigate();

    useEffect(()=>{
        const fetchData=async()=>{
        try {
            dispatch({type:'FETCH_REQUEST'});
            
                const {data}=await axios.get('/api/orders',
                {
                    headers:{Authorization: `Bearer ${userInfo.token}`}
                });
                console.log(data);
                dispatch({type:'FETCH_SUCCESS',payload:data});
            }
            
         catch (error) {
            dispatch({type:'FETCH_FAIL'});
            toast.error(getError(error));
            
        }
    }
        if(deleteSuccess){
            dispatch({type:"DELETE_RESET"});
        }
        else{
        fetchData();
        }
        
    },[userInfo,deleteSuccess])

    const deleteHandler=async(order)=>{
        try {
            dispatch({type:"DELETE_REQUEST"});
            await axios.delete(`/api/orders/${order._id}`,{
                headers:{Authorization:`Bearer ${userInfo.token}`}
            });
            dispatch({type:"DELETE_SUCCESS"});
            toast.success("Delete Success");
        } catch (error) {
            dispatch({type:"DELETE_FAIL"});
            toast.error(getError(error));
        }
    };

    return (<div>
                <Helmet>
                    <title>Orders</title>
                </Helmet>
                <h1>Orders</h1>
                {loadingDelete && <LoadingBox></LoadingBox>}
                {loading ? <LoadingBox></LoadingBox>:
                error?<MessageBox variant="danger">{error}</MessageBox>:
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order=>{return(
                            <tr>
                                <td>{order._id}</td>
                                <td>{order.user ? order.user.name : 'DELETED USER'}</td>
                                <td>{order.createdAt.substring(0,10)}</td>
                                <td>{order.totalPrice}</td>
                                <td>{order.isPaid?order.paidAt.substring(0,10):"NO"}</td>
                                <td>{order.isDelivered?order.deliveredAt.substring(0,10):'NO'}</td>
                                <td><Button variant="light" onClick={()=>navigate(`/order/${order._id}`)}>Edit</Button>
                                    {' '}
                                    <Button variant="light" onClick={()=>deleteHandler(order)}>Delete</Button>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>}
           </div>);
}