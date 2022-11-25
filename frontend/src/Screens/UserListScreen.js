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
    switch(action.type)
    {
        case "FETCH_REQUEST":
            return {...state,loading:true};
        case "FETCH_SUCCESS":
            return {...state,loading:false,users:action.payload};
        case "FETCH_FAIL":
            return {...state,loading:false,error:action.payload};

        case "DELETE_REQUEST":
            return {...state,loadingDelete:true,successDelete:false};
        case "DELETE_SUCCESS":
            return {...state, loadingDelete:false,successDelete:true};
        case "DELETE_FAIL":
            return {...state,loadingDelete:false};

        case "DELETE_RESET":
            return {...state,successDelete:false};

        default:
            return {...state};
    }
}

export default function UserListScreen(){
    const [{users,loading,error,loadingDelete,successDelete},dispatch]=useReducer(reducer,{users:[],loading:true,error:''});

    const {state}=useContext(Store);
    const {userInfo}=state;

    const navigate=useNavigate();

    useEffect(()=>{
        try{
            dispatch({type:"FETCH_REQUEST"});
            const fetchData=async()=>{
                const {data}=await axios.get("/api/users",{
                    headers:{Authorization: `Bearer ${userInfo.token}`}
                });
                dispatch({type:"FETCH_SUCCESS",payload:data});

            }
            if(successDelete){
                dispatch({type:"DELETE_RESET"});
            }
            else{
            fetchData();
            }
        }
        catch(err){
            dispatch({type:"FETCH_FAIL",payload:getError(err)});
            toast.error(getError(err));
        }
    },[userInfo,successDelete]);

    const deleteHandler=async(userId)=>{
        try{
            dispatch({type:"DELETE_REQUEST"});
            await axios.delete(`/api/users/${userId}`,{
                headers:{Authorization: `Bearer ${userInfo.token}`}
            });
            dispatch({type:"DELETE_SUCCESS"});
            toast.success("DELETE SUCCESS");
        }
        catch(error){
            dispatch({type:"DELETE_FAIL"});
            toast.error(getError(error));
        }
    }

    return (<React.Fragment>
        <Helmet>
            <title>User List</title>
        </Helmet>
        <h1>User List</h1>
        {loadingDelete && <loadingDelete></loadingDelete>}
        {loading?<LoadingBox></LoadingBox>:
        error?<MessageBox variant="danger">{error}</MessageBox>:
        <table className="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>IS ADMIM</th>
                <th>ACTION</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user)=>{return(
                <tr>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin?"YES":"NO"}</td>
                    <td>
                        <Button variant="light" onClick={()=>navigate(`/admin/user/${user._id}`)} >Edit</Button>
                        {' '}
                        <Button variant="light" disabled={successDelete} onClick={()=>deleteHandler(user._id)}>Delete</Button>
                    </td>
                </tr>
            )})}
            </tbody>
       
        </table>}
        </React.Fragment>)

}