import React, { Component } from 'react';

class OrderPlaced extends Component {
    render() {
        console.log(this.props)
        let card = null;
        if (this.props.location.state.emptyCart) {
            card =
                <>
                    <div className="card-header">
                        Cart is empty
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Add items to cart</h5>
                    </div>
                </>
        } else {
            card =
                <>
                    <div className="card-header">
                        Congratulations!!!!! Your Order has been placed
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Order ID : {this.props.location.state.order_id}</h5>
                        <p className="card-text">Order Total : {this.props.location.state.cart_totalPrice}</p>
                    </div>
                </>
        }


        return (
            <div className="container">
                <br />
                <br />
                <br />
                <div className="card card-accent-success mb-3">
                    {card}
                </div>
            </div>
        );
    }
}

export default OrderPlaced;