import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';

class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            orderId: "",
            cart_total: 0,
            r_id: 0,
            authFlag: false,
            emptyCart: false
        }

        this.submitOrder = this.submitOrder.bind(this);

    }

    componentDidMount() {

        this.setState({
            r_id: this.props.match.params.restaurantId
        });

        axios.get('http://3.88.193.169:3001/cartItems')
            .then((response) => {
                console.log(response.data);
                if (response.data === 'Cart is empty') {
                    this.setState({
                        emptyCart: true
                    });
                } else {
                    this.setState({
                        items: response.data,
                        orderId: response.data[0].order_id,
                        emptyCart: false
                    });
                }
            });

        axios.get('http://3.88.193.169:3001/cartTotal')
            .then((response) => {
                console.log(response.data);
                this.setState({
                    cart_totalPrice: response.data
                });
            });
    }

    submitOrder = (e) => {
        //prevent page from refresh
        e.preventDefault();
        const data = {
            order_id: this.state.orderId,
            r_id: this.state.r_id,
            cart_totalPrice: this.state.cart_totalPrice
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        // make a post request with the user data
        axios.post('http://3.88.193.169:3001/submitOrder', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        authFlag: true
                    })
                } else {
                    this.setState({
                        authFlag: false
                    })
                }
            });
    };

    render() {

        let redirectVar = null;

        if(this.state.emptyCart) {
            redirectVar = <Redirect to={{
                pathname: "/orderPlaced",
                state: {
                    emptyCart: this.state.emptyCart
                }
            }}
            />
        }

        if (this.state.authFlag) {
            redirectVar = <Redirect to={{
                pathname: "/orderPlaced",
                state: {
                    order_id: this.state.orderId,
                    cart_totalPrice: this.state.cart_totalPrice
                }
            }}
            />
        }

        return (
            <div className="container">
                {redirectVar}
                <div className="card text-center">
                    <div className="card-header">
                        Review order
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Order items</h5>
                        {
                            this.state.items.map((item) => {
                                return (
                                    <li className="list-group-item" key={item.item_id}>
                                        {/* <div className="card"> */}
                                        {/* <img className="card-img-top" src="..." alt="Card image cap"> */}
                                        <h5 className="card-text">{item.item_name}</h5>
                                        <h6 className="card-text">Quantity: {item.item_quantity}</h6>
                                        <p className="card-text">Total Price: {item.item_total_price}</p>
                                        {/* </div> */}
                                    </li>
                                );
                            }
                            )}
                    </div>
                    <div className="card-footer text-muted">
                        Total: {this.state.cart_totalPrice}
                        <br />
                        <button onClick={this.submitOrder} className="btn btn-success" type="button" name="Order">Place Order</button>
                    </div>
                </div>
            </div>
        );
    }

}

export default Cart;