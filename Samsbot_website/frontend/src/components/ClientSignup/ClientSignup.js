import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
// import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import './ClientSignup.css';

class ClientSignup extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            authFlag: false
        }
        //Bind the handlers to this class
        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitCreate = this.submitCreate.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }
    //first name change handler to update state variable with the text entered by the user
    firstNameChangeHandler = (e) => {
        this.setState({
            firstName: e.target.value
        })
    }
    //last name change handler to update state variable with the text entered by the user
    lastNameChangeHandler = (e) => {
        this.setState({
            lastName: e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    emailChangeHandler = (e) => {
        this.setState({
            email: e.target.value
        })
    }
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    submitCreate = (e) => {
        //prevent page from refresh
        e.preventDefault();
        const data = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://3.88.193.169:3001/clientSignup', data)
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
        let redirectvar;
        if (this.state.authFlag) {
            redirectvar = <Redirect to="/login" />;
        }
        return (
            <div>
                {redirectvar}
                <br />
                <br />
                <br />
                <div className="container">
                    <div className="login-form">
                        <div className="main-div">
                            <div className="panel">
                                <h2>Customer Signup</h2>
                            </div>
                            <br />
                            <form onSubmit={this.submitCreate}>
                                <div className="namesFlex">
                                    <div style={{ width: '49%' }} className="form-group">
                                        <input onChange={this.firstNameChangeHandler} type="text" className="form-control" name="firstName" placeholder="First Name" required />
                                    </div>
                                    <div style={{ width: '49%' }} className="form-group">
                                        <input onChange={this.lastNameChangeHandler} type="text" className="form-control" name="lastName" placeholder="Last Name" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <input onChange={this.emailChangeHandler} type="email" className="form-control" name="email" placeholder="Email" required />
                                </div>
                                <div className="form-group">
                                    <input onChange={this.passwordChangeHandler} type="password" className="form-control" name="password" placeholder="Password" required />
                                </div>
                                <div>
                                    <button className="btn btn-success" type="submit">Sign up</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}


export default ClientSignup;
