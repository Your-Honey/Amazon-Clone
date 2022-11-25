import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import LoadingBox from '../Components/LoadingBox';
import MessageBox from '../Components/MessageBox';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [{ loading, error, products, pages,loadingCreate,loadingDelete,successDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { search} = useLocation();
  const navigate=useNavigate();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/product/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);


  const deleteHandler=async(product)=>{
    if(window.confirm("Are you sure to delete?")){
      dispatch({type:'DELETE_REQUEST'});
      try {
        axios.delete(`/api/product/${product._id}`,{
          headers:{Authorization:`Bearer ${userInfo.token}`},
        });
        toast.success('product deleted successfully');
        dispatch({type:'DELETE_SUCCESS'});
      } catch (error) {
        dispatch({type:'DELETE_FAIL'});
        toast.error(getError(error));
      }
    }
  };

  const createHandler=async()=>{
    if(window.confirm("Are You sure to create?")){
      try{
        dispatch({type:"CREATE_REQUEST"});
        const {data}=await axios.post("/api/product",
        {},
        {
          headers:{Authorization:`Bearer ${userInfo.token}`}
        });
        toast.success("product created successfully");
        dispatch({type:"CREATE_SUCCESS"});
        navigate(`/admin/product/${data.product._id}`);
      }
      catch(err){
        toast.error(getError(error));
        dispatch({type:"CREATE_FAIL"});
      }
    }
  };

  return (
    <div>
    <Row>
      <Col>
        <h1>Products</h1>
      </Col>
      <Col>
        <div>
          <Button type="Button" onClick={createHandler}>
            Create Product
          </Button>
        </div>
      </Col>
    </Row>
    {loadingCreate && <LoadingBox></LoadingBox>}
    {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button type="button" variant="light" onClick={()=>navigate(`/admin/product/${product._id}`)}>Edit</Button>{' '}
                    <Button type="button" variant="light" onClick={()=>deleteHandler(product)}>Delete</Button>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/product?page=${x + 1}`}
                >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}