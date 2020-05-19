import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Orders.css';

class Orders extends Component {

    constructor(props) {
        super(props);
    }


    render() {

        const statuses = ['New', 'Preparing', 'Ready', 'Delivered']
        var options = statuses.map(status => {
            return (
                <option value={status} key={status}>{status}</option>
            )
        })

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
                            : null }
                        </div>
                        <p>Client name : {order.client_first_name} {order.client_last_name}</p>
                        <p>Delivery address : {order.client_address}</p>
                        <p>Order total : ${order.order_bill}</p>
                        <p>Status : {order.status}</p>
                        <div className="flexLayout1">
                            <span>Update order status</span>
                            <div className="statusDropdown">
                                {this.props.type === 'Upcoming orders' ?
                                    <select id={order.order_id} name="selectStatus"
                                        value={order.status}
                                        className="form-control"
                                        onChange={this.props.statusChangeHandler}>
                                        {options}
                                    </select>
                                    : null}
                            </div>
                        </div>
                        <br />
                        <span>Items</span>
                        {this.props.order_details.map((item) => {
                            if (item.order_id === order.order_id) {
                                return (
                                    <div key={item.item_id}>
                                        <div className="orderItemLayout">
                                            <img className="orderItemImage" src={item.item_image} title={item.item_name}/>
                                            <div className="orderItemDetails">
                                                <h5>Item Name : {item.item_name}</h5>
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
    status: PropTypes.string,
    statusChangeHandler: PropTypes.func,
    cancelBtnHandler: PropTypes.func
};

export default Orders;