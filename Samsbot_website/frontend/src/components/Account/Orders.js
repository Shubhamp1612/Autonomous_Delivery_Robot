import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Orders.css';

class Orders extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const listItems = this.props.orders.map(order => {
            return (
                <div className="card mb-3" key={order.order_id}>
                    <div className="orderLayout">
                        <div className="flexLayout1">
                            <h3>Order ID : {order.order_id}</h3>
                            {this.props.type === 'Upcoming orders' ?
                                <div>
                                    <button id={order.order_id} onClick={this.props.cancelBtnHandler} className="btn btn-danger" type="button">Cancel Order</button>
                                </div>
                                : null}
                        </div>
                        <p>Delivery address : {order.client_address}</p>
                        <p>Restaurant : {order.rest_name}</p>
                        <p>Order total : ${order.order_bill}</p>
                        <p>Status : {order.status}</p>
                        {this.props.order_details.map((item) => {
                            if (item.order_id === order.order_id) {
                                return (
                                    <div key={item.item_id}>
                                        <div className="orderItemLayout">
                                            <img className="orderItemImage" src={item.item_image} title={item.item_name}/>
                                            <div className="orderItemDetails">
                                                <h5>Item name : {item.item_name}</h5>
                                                <h6>Quantity : {item.item_quantity}</h6>
                                                <p>Total Price : {item.item_total_price}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            )
        })

        return (
            <div className="container">
                <h1>{this.props.type}</h1>
                <div>
                    <ul className="list-group list-group-flush">{listItems}</ul>
                </div>
            </div>
        );
    }
}


Orders.propTypes = {
    type: PropTypes.string,
    orders: PropTypes.array,
    order_details: PropTypes.array,
    cancelBtnHandler: PropTypes.func
};

export default Orders;