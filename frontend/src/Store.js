import { createContext, useReducer } from "react";

export const Store=createContext();

const intitalState={
    userInfo:localStorage.getItem("userInfo")
                ?JSON.parse(localStorage.getItem("userInfo"))
                :null,
    
    cartItems:localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    :[],

    shippingAddress:localStorage.getItem("shippingAddress")
                    ?JSON.parse(localStorage.getItem("shippingAddress"))
                    :{},

    paymentMethod: localStorage.getItem("paymentMethod")
                    ?localStorage.getItem("paymentMethod")
                    :''
    
};

function reducer(state,action){
    switch(action.type){
        case 'CART_ADD_ITEM':
            //add to cart
            const newItem=action.playload;
            const existItem=state.cartItems.find(x=>x._id===newItem._id);

            const cartItem= existItem 
            ? state.cartItems.map(item=>
                item._id===existItem._id ?newItem:item
                )
                :[...state.cartItems,newItem];

                localStorage.setItem("cartItems",JSON.stringify(cartItem));
            return {
                ...state,
                
                cartItems:cartItem
            }
        
        case 'CART_REMOVE_ITEM':{
            const cartItem= state.cartItems.filter(item=>{
                return item._id !== action.playload._id;
            });

            localStorage.setItem("cartItems",JSON.stringify(cartItem));

            return {...state,cartItems:cartItem};
        }

        case 'USER_SIGNIN':
            return{...state,userInfo:action.playload};

        case 'USER_SIGNOUT':
            return{...state,userInfo:null,cartItems:[],shippingAddress:{},paymentMethod:''};

        case "SAVE_SHIPPING_ADDRESS":
            return{...state , shippingAddress:action.playload};

        case "SAVE_PAYMENT_METHOD":
            return {...state,paymentMethod:action.playload};

        case "CART_CLEAR":
            return {...state,cartItem:[]};
        
        default:
           return state;
    }
}

export function StoreProvider(props){
    const [state,dispatch]=useReducer(reducer,intitalState);
    const value={state,dispatch};
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}