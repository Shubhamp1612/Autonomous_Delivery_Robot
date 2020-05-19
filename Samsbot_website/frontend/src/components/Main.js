import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ClientLogin from './ClientLogin/ClientLogin';
import ClientSignup from './ClientSignup/ClientSignup';
import OwnerLogin from './OwnerLogin/OwnerLogin';
import OwnerSignup from './OwnerSignup/OwnerSignup';
import ClientHomePage from './ClientHomePage/ClientHomePage';
import Account from './Account/Account';
import OwnerAccount from './OwnerAccount/OwnerAccount';
import AddItem from './OwnerAccount/AddItem';
import Navbar from './Navbar/Navbar';
import RestaurantMenu from './ClientHomePage/RestaurantMenu';
import Cart from './ClientHomePage/Cart';
import OrderPlaced from './ClientHomePage/OrderPlaced';

class Main extends Component {
    render() {
        return (
            <div>
                <Route path="/" component={ Navbar }/>
                <Route path="/login" component={ ClientLogin } />
                <Route path="/signup" component={ ClientSignup } />
                <Route path="/ownerLogin" component={ OwnerLogin } />
                <Route path="/ownerSignup" component={ OwnerSignup }/>
                <Switch>
                <Route path="/home/:restaurantId/cart" component={ Cart }/>
                <Route path="/home/:restaurantId" component = { RestaurantMenu }/>
                <Route path="/home" component = { ClientHomePage }/>
                <Route path="/orderPlaced" component = { OrderPlaced } />
                <Route path="/account" component={ Account } />
                <Route path="/ownerAccount" component={ OwnerAccount } />
                <Route path="/addItem" component={ AddItem }/>
                </Switch>  
            </div>
        );
    }
}

export default Main;