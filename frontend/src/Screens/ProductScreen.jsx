import axios from "axios";
import { useEffect, useReducer,useContext } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { useParams } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import { Helmet } from 'react-helmet-async';
import Rating from "../Components/Rating";
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import LoadingBox from '../Components/LoadingBox';
import MessageBox from '../Components/MessageBox';
import { getError } from '../utils';
import { Store } from "../Store";


const reducer=(state,action)=>{
    switch (action.type) {
        case 'FETCH_REQUEST':
           return {...state,loading:true};
        
        case 'FETCH_SUCCESS':
            return {...state,product:action.playload,loading:false};

        case 'FETCH_FAIL':
            return {...state,error:action.playload,loading:false};
        default:
            return state;
           
    }
}

const intitalstate={
    loading:true,
    error:'',
    product:{}
}

function ProductScreen(){

    const[{loading,error,product},dispatch]=useReducer(reducer,intitalstate)
    const pram= useParams();
    const slug=pram.slug;

   

    useEffect(()=>{
        dispatch({type:'FETCH_REQUEST'});
        const FetchData=async()=>{
            try{
            const result= await axios.get(`/api/product/slug/${slug}`);
            dispatch({type:'FETCH_SUCCESS',playload:result.data});
            }
            catch(err){
                dispatch({type:'FETCH_FAIL',playload:getError(err)});
            }
        }
        FetchData();
    },[slug]);

    const {state,dispatch:crtDispatch}=useContext(Store);
    const {cartItems} = state;

    const addToCart = async ()=>{
        const {data}= await axios.get(`/api/product/${product._id}`);
        const existItem=cartItems.find(x=>x._id===product._id);
        const quantity= existItem?existItem.quantity+1:1;

        if(data.countInStock<quantity)
        {
          window.alert('Sorry. Product is out of stock');
          return;
        }
        crtDispatch({type:'CART_ADD_ITEM',playload:{...product,quantity}});
        console.log(state.cartItems);
    };

    return(<div>
        {loading?<LoadingBox/>
        :error
        ?<MessageBox variant="danger">{error}</MessageBox>
        :<div>
            <Row>
                <Col md={6}>
                    <img
                        className="img-large"
                        src={product.image}
                        alt={product.name}
                    ></img>
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Helmet>
                                <title>{product.name}</title>
                            </Helmet>
                            <h1>{product.name}</h1>
                        </ListGroup.Item>
                        <ListGroup.Item>
                        <Rating
                          rating={product.rating}
                          numReviews={product.numReviews}
                        ></Rating>
                      </ListGroup.Item>
                      <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                      <ListGroup.Item>
                        Description:
                        <p>{product.description}</p>
                      </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                <Card>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>${product.price}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {product.countInStock > 0 ? (
                            <Badge bg="success">In Stock</Badge>
                          ) : (
                            <Badge bg="danger">Unavailable</Badge>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>
    
                    {product.countInStock > 0 && (
                      <ListGroup.Item>
                        <div className="d-grid">
                          <Button onClick={addToCart} variant="primary">Add to Cart</Button>
                        </div>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
                </Col>
            </Row>
        </div>
    }
        </div>
    );
}

export default ProductScreen