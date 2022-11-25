import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeScreen from "./Screens/HomeScreen";
import ProductScreen from "./Screens/ProductScreen";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import {useContext, useEffect, useState} from "react";
import { Store } from './Store';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import CartScreen from './Screens/CartScreen';
import SingninScreen from './Screens/SigninScreen';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ShippingAddress from './Screens/ShippingAddressScreen';
import SignupScreen from './Screens/SignupScreen';
import PaymentMethod from './Screens/PaymentMethodScreen';
import PlaceOrderScreen from './Screens/PlaceOrderScreen';
import OrderScreen from './Screens/OrderScreen';
import OrderHistoryScreen from './Screens/OrderHistoryScreen';
import ProfileScreen from './Screens/ProfileScreen';
import axios from 'axios';
import { getError } from './utils';
import Button from 'react-bootstrap/Button';
import SearchBox from './Components/SearchBox';
import SearchScreen from './Screens/SearchScreen';
import Protectedroute from "./Components/ProtectedRoute";
import AdminRoute from "./Components/AdminRoute";
import DashboardScreen from "./Screens/DashboardScreen";
import ProductListScreen from './Screens/ProductListScreen';
import ProductEditScreen from './Screens/ProductEditScreen';
import OrderListScreen from './Screens/OrderListScreen';
import UserListScreen from './Screens/UserListScreen';
import UserEditScreen from './Screens/UserEditScreen';

function App() {
  const {state,dispatch:ctxDispatch}=useContext(Store);
  const {cartItems,userInfo}=state;

  const signoutHandler=()=>{
    ctxDispatch({type:'USER_SIGNOUT'});
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = '/signin';
  }

  const [sidebarIsOpen,setSidebarIsOpen]=useState(false);
  const [categories,setCategories]=useState([]);

  useEffect(()=>{
    const fetchCategories= async ()=>{
      try {
        const {data}= await axios.get("/api/product/categories");
        setCategories(data);
      } catch (error) {
        toast.error(getError(error));
        
      }
      
    }
    fetchCategories();

  },[]);

  return (
    <BrowserRouter>
    <div
    className={
      sidebarIsOpen
        ? 'd-flex flex-column site-container active-cont'
        : 'd-flex flex-column site-container'
    }
  >
        <ToastContainer position="bottom-center" limit={1}/>
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
            <Button
            variant="dark"
            onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
          >
            <i className="fas fa-bars"></i>
          </Button>
              <LinkContainer to="/">
                <Navbar.Brand>amazona</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
              <SearchBox/>
                <Nav className="me-auto  w-100  justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/product">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/order">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/user">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path="/cart" element={<CartScreen/>}/>
              <Route path="/search" element={<SearchScreen/>}/>
              <Route path="/signin" element={<SingninScreen/>}/>
              <Route path="/signup" element={<SignupScreen/>}/>
              <Route path="/shipping" element={<ShippingAddress/>}/>
              <Route path="/payment" element={<PaymentMethod/>}/>
              <Route path="/placeorder" element={<PlaceOrderScreen/>}/>
              <Route path="/order/:id" element={<Protectedroute><OrderScreen/></Protectedroute>}/>
              <Route path="/orderhistory" element={<Protectedroute><OrderHistoryScreen/></Protectedroute>}/>
              <Route path="/profile" element={<Protectedroute> <ProfileScreen/></Protectedroute>}/>
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminRoute><DashboardScreen/></AdminRoute>}/>
              <Route path="/admin/product" element={<AdminRoute><ProductListScreen/></AdminRoute>}/>
              <Route path="/admin/product/:id" element={<AdminRoute><ProductEditScreen/></AdminRoute>}/>
              <Route path="/admin/order" element={<AdminRoute><OrderListScreen></OrderListScreen></AdminRoute>}/>
              <Route path="/admin/user" element={<AdminRoute><UserListScreen></UserListScreen></AdminRoute>}/>
              <Route path="/admin/user/:id" element={<AdminRoute><UserEditScreen></UserEditScreen></AdminRoute>}/>
            </Routes>
          </Container>
        </main>

        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>

      </div>
    </BrowserRouter>
  );
}

export default App;
