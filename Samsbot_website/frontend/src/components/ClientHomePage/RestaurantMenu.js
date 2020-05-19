import React, { Component } from 'react';
import cookie from 'react-cookies';
import { withRouter } from 'react-router';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RestaurantMenu.css';

class RestaurantMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sections: [],
            items: [],
            item_quantity: "",
            item_id: "",
            item_name: "",
            item_price: "",
            authFlag: false,
            addToCartSuccessful: false
        }

        this.quantityChangeHandler = this.quantityChangeHandler.bind(this);
        this.addItemToCart = this.addItemToCart.bind(this);

    }

    componentDidMount() {

        const data = {
            r_id: this.props.match.params.restaurantId
        }

        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://3.88.193.169:3001/menuItems', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log(response.data);
                    this.setState({
                        items: response.data,
                        authFlag: true
                    })
                } else {
                    this.setState({
                        authFlag: false
                    })
                }
            });

        axios.post('http://3.88.193.169:3001/menuSections', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log(response.data);
                    this.setState({
                        sections: response.data,
                        authFlag: true
                    })
                } else {
                    this.setState({
                        authFlag: false
                    })
                }
            });

    }

    quantityChangeHandler = (e) => {


        let item = JSON.parse(e.target.id);

        this.setState({
            item_quantity: e.target.value,
            item_id: item.item_id,
            item_name: e.target.name,
            item_price: item.item_price
        })
    }

    addItemToCart = (e) => {
        //prevent page from refresh
        e.preventDefault();
        const data = {
            item_quantity: this.state.item_quantity,
            item_id: this.state.item_id,
            item_name: this.state.item_name,
            item_price: this.state.item_price
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        // make a post request with the user data
        axios.post('http://3.88.193.169:3001/addItemToCart', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        addToCartSuccessful: true
                    })
                } else {
                    this.setState({
                        addToCartSuccessful: false
                    })
                }
            });
    };

    render() {

        const cart = '/cart.jpg'

        const r_id = this.props.match.params.restaurantId;

        const listItems = this.state.sections.map((section) => {
            return (
                <div className="card mb-3" key={section.section_id}>
                    <div className="sectionsLayout">
                        <h3>{section.section_name}</h3>
                        <p>{section.section_description}</p>
                    </div>
                    {this.state.items.map((item) => {
                        if (item.section_id === section.section_id) {
                            return (
                                <div className="card" key={item.item_id}>
                                    <div className="itemLayout">
                                        <img className="itemImageLayout" src={item.item_image} title={item.item_name} alt={item.item_name}/>
                                        <div className="itemDetails">
                                            <h5 className="card-title">{item.item_name}</h5>
                                            <h6 className="card-subtitle">{item.item_description}</h6>
                                            <p className="card-text">${item.item_price}</p>
                                            <div style={{ width: '150px' }} className="form-group">
                                                Qty:
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    className="form-control"
                                                    name={item.item_name}
                                                    min="0"
                                                    onChange={this.quantityChangeHandler}
                                                    id={JSON.stringify(item)}
                                                />
                                            </div>
                                            <div>
                                                <button type="button" onClick={this.addItemToCart} className="btn btn-success">Add to cart</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            )
        });

        return (
            <div>
                <div className="container">
                    <div className="menuLayout">
                        <div className="goToCart">
                            <Link to={`/home/${r_id}/cart`}>
                                <img className="cartIcon" src={cart} alt="Go to cart" />
                            </Link>
                            <br />
                            Go to cart
                        </div>
                        {listItems}
                    </div>
                </div>
            </div>

        );
    }

}

export default withRouter(RestaurantMenu);