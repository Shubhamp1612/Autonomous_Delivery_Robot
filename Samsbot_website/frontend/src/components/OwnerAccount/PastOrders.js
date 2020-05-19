import React, { Component } from 'react';
import Orders from './Orders';
import axios from 'axios';

class PastOrders extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            order_ids: [],
            order_details: [],
            authFlag: false
        }

    }

    componentDidMount() {

        axios.get('http://3.88.193.169:3001/pastOrdersForOwner')
            .then((response) => {
                console.log(response.data);
                let orderIds = response.data.map(obj => {
                    return obj.order_id;
                });
                this.setState({
                    orders: response.data,
                    order_ids: orderIds
                });
            }).then(() => {
                console.log(this.state.order_ids);
                const data = {
                    order_ids: this.state.order_ids
                }

                //set the with credentials to true
                axios.defaults.withCredentials = true;
                //make a post request with the user data
                axios.post('http://3.88.193.169:3001/itemsInOrders', data)
                    .then(response => {
                        console.log("Status Code : ", response.status);
                        if (response.status === 200) {
                            console.log(response.data);
                            this.setState({
                                order_details: response.data,
                                authFlag: true
                            })
                        } else {
                            this.setState({
                                authFlag: false
                            })
                        }
                    });
            });
    }


    render() {
        return (
            <div className="container">
                <Orders
                    orders={this.state.orders}
                    order_details={this.state.order_details}
                    type="Past orders" />
            </div>
        );
    }
}

export default PastOrders;