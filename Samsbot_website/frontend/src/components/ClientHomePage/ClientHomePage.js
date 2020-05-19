import React, { Component } from 'react';
import cookie from 'react-cookies';
import { Redirect, withRouter } from 'react-router';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ClientHomePage.css';

class ClientHomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            restaurants: [],
            cuisines: [],
            filterCuisine: "",
            searchItem: "",
            authFlag: false
        }

        this.searchBoxChangeHandler = this.searchBoxChangeHandler.bind(this);
        this.cuisineFilterChangeHandler = this.cuisineFilterChangeHandler.bind(this);
        this.submitSearch = this.submitSearch.bind(this);

    }

    componentDidMount() {
        axios.get('http://3.88.193.169:3001/restaurantList')
            .then((response) => {
                console.log(response.data);
                this.setState({
                    restaurants: response.data
                });
            });

        axios.get('http://3.88.193.169:3001/nextOrderId')
            .then((response) => {
                console.log(response.data);
                this.setState({
                    nextOrderId: response.data
                });
            });

        axios.get('http://3.88.193.169:3001/distinctCuisines')
            .then((response) => {
                console.log(response.data);
                this.setState({
                    cuisines: response.data
                });
            });
    }

    submitSearch = (e) => {
        //prevent page from refresh
        // e.preventDefault();
        const data = {
            searchItem: this.state.searchItem,
            filterCuisine: this.state.filterCuisine
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        // make a post request with the user data
        axios.post('http://3.88.193.169:3001/searchItem', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log(response.data);
                    this.setState({
                        restaurants: response.data
                    });
                } else {
                    this.setState({
                        authFlag: false
                    })
                }
            });
    };

    cuisineFilterChangeHandler = (e) => {
        this.setState({
            filterCuisine: e.target.value
        },
            this.submitSearch
        );
    }

    searchBoxChangeHandler = (e) => {
        this.setState({
            searchItem: e.target.value
        })
    }

    render() {

        //if not logged in go to login page
        let redirectVar = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }

        var options = [<option value="---" key="null">---</option>];
        var moreOptions = this.state.cuisines.map(cuisine => {
            return (
                <option value={cuisine.cuisine} key={cuisine.cuisine}>{cuisine.cuisine}</option>
            )
        })

        options = options.concat(moreOptions);

        const restaurantsList = this.state.restaurants.map((restaurant) =>
            <Link to={`/home/${restaurant.r_id}`} key={restaurant.r_id} className="nav-link">
                <div className="card mb-3" >
                    <img className="restImage" src={restaurant.rest_image} alt={restaurant.rest_image}/>
                    <div className="card-body">
                        <h5 className="card-title">{restaurant.rest_name}</h5>
                        <p className="card-text">{restaurant.cuisine}</p>
                        <p className="card-text"><small className="text-muted">{restaurant.rest_zip_code}</small></p>
                    </div>
                </div>
            </Link>
        );

        return (
            <div className="container">
                {redirectVar}
                <div className="searchLayout">
                    <input type="text" className="form-control" name="searchBox" onChange={this.searchBoxChangeHandler} placeholder="Item name (E.g. Pizza)" />
                    <button onClick={this.submitSearch} className="searchbar">
                        <img src="search.png" className="searchBtn" alt="Search"/>
                    </button>
                    <select
                        id="cuisine"
                        name="selectCuisine"
                        className="form-control"
                        onChange={this.cuisineFilterChangeHandler}
                    >
                        {options}
                    </select>
                </div>
                {restaurantsList}
            </div>
        );
    }
}

export default withRouter(ClientHomePage);

