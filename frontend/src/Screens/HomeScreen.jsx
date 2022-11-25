import { useEffect,useReducer } from "react";
import { Helmet } from 'react-helmet-async';
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../Components/Product";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";

const reducer=(state,action)=>{
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state,loading:true};
            
        case 'FETCH_SUCCESS':
            return {...state,products:action.playload,loading:false};

        case 'FETCH_FAIL':
            return {...state,loading:false,error:action.playload};
    
        default:
            return state;
          
    }
}

const initialState={
    products: [],
    loading: true,
    error: '',
}
function HomeScreen(){
    

    
    //const [products,setProducts]=useState([]);
    const [{products,loading,error},dispatch]=useReducer(reducer, initialState);

    useEffect(()=>{
        dispatch({type:'FETCH_REQUEST'});
        const fetchDate = async ()=>{
         try{
            const result = await axios.get('/api/product');
            dispatch({type:'FETCH_SUCCESS',playload:result.data});
            }
            catch(err){
                dispatch({type:'FETCH_FAIL',playload:err.message});
            }
        };
        fetchDate();
    },[]);

    return (<div>
        <Helmet>
        <title>Amazona</title>
      </Helmet>
        <main>
          {loading?<LoadingBox/>:error?<MessageBox varient="danger">{error}</MessageBox>:<div>
            <h1>Product category</h1>
            <div className="products">
              <Row>
                {products.map((product)=>(
                <Col  key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
                </Col>)
                )}
              </Row>
            </div>
          </div>}
      
        </main>
      
      </div> );
}

export default HomeScreen;