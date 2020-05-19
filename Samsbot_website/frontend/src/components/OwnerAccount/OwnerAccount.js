import React, { Component } from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import './OwnerAccount.css';
import Sections from './Sections';
import AddItem from './AddItem';
import OwnerProfile from './OwnerProfile';
import Menu from './Menu';
import UpcomingOrders from './UpcomingOrders';
import PastOrders from './PastOrders';

class OwnerAccount extends Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                    <div className='layout'>
                        <div className='sidebar'>
                            <div className="card">
                                <div className="titleStyle">
                                <h5 className="card-title">Your Account</h5>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <Link to={`/owneraccount/profile`}>
                                        <li className="list-group-item">Profile</li>
                                    </Link>
                                    <Link to={`/owneraccount/menu`}>
                                    <li className="list-group-item">Menu</li>
                                    </Link>
                                    <Link to={`/owneraccount/sections`}>
                                        <li className="list-group-item">Sections</li>
                                    </Link>
                                    <Link to={`/owneraccount/addItem`}>
                                    <li className="list-group-item">Add Item</li>
                                    </Link>
                                    <Link to={`/owneraccount/upcomingOrders`}>
                                    <li className="list-group-item">Upcoming orders</li>
                                    </Link>
                                    <Link to={`/owneraccount/pastOrders`}>
                                    <li className="list-group-item">Past orders</li>
                                    </Link>
                                </ul>
                            </div>
                        </div>
                        <Route exact path="/owneraccount" component={OwnerProfile} />
                        <Route path="/owneraccount/profile" component={OwnerProfile} />
                        <Route path='/owneraccount/menu' component={Menu}/>
                        <Route path='/owneraccount/sections' component={Sections} />
                        <Route path='/owneraccount/addItem' component={AddItem} />
                        <Route path='/owneraccount/upcomingOrders' component={UpcomingOrders}/>
                        <Route path='/owneraccount/pastOrders' component={PastOrders}/>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default OwnerAccount;