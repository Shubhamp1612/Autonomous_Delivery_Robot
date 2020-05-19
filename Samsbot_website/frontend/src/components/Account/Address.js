import React, { Component } from 'react';
import './Address.css';
import AddressModal from './AddressModal';
import axios from 'axios';


class Address extends Component {

    constructor(props) {
        super(props);

        this.state = {
            street_address: "",
            apt: "",
            city: "",
            state: "",
            zip_code: "",
            phone: "",
            cross_street: "",
            delivery_instructions: "",
            address_name: "",
            showAddressModal: false,
            authFlag: false,
            btnType: ""
        }

        this.showAddressModal = this.showAddressModal.bind(this);
        this.streetAddressChangeHandler = this.streetAddressChangeHandler.bind(this);
        this.aptChangeHandler = this.aptChangeHandler.bind(this);
        this.cityChangeHandler = this.cityChangeHandler.bind(this);
        this.stateChangeHandler = this.stateChangeHandler.bind(this);
        this.zipCodeChangeHandler = this.zipCodeChangeHandler.bind(this);
        this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
        this.crossStreetChangeHandler = this.crossStreetChangeHandler.bind(this);
        this.deliveryInstructionsChangeHandler = this.deliveryInstructionsChangeHandler.bind(this);
        this.addressNameChangeHandler = this.addressNameChangeHandler.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.addAddress = this.addAddress.bind(this);
        this.btnTypeClicked = this.btnTypeClicked.bind(this);
    }

    componentDidMount() {
        axios.get('http://3.88.193.169:3001/addressUpdate')
            .then((response) => {
                console.log((response.data))
                this.setState({
                    street_address: (response.data[0]).street_address,
                    apt: (response.data[0]).apt,
                    city: (response.data[0]).city,
                    state: (response.data[0]).state,
                    zip_code: (response.data[0]).zip_code,
                    phone: (response.data[0]).phone,
                    cross_street: (response.data[0]).cross_street,
                    delivery_instructions: (response.data[0]).delivery_instructions,
                    address_name: (response.data[0]).address_name
                });
            })
    }

    showAddressModal() {
        this.setState({
            showAddressModal: !this.state.showAddressModal
        })
    }

    streetAddressChangeHandler = (e) => {
        this.setState({
            street_address: e.target.value
        })
    }

    aptChangeHandler = (e) => {
        this.setState({
            apt: e.target.value
        })
    }

    cityChangeHandler = (e) => {
        this.setState({
            city: e.target.value
        })
    }

    stateChangeHandler = (e) => {
        this.setState({
            state: e.target.value
        })
    }

    zipCodeChangeHandler = (e) => {
        this.setState({
            zip_code: e.target.value
        })
    }

    phoneChangeHandler = (e) => {
        this.setState({
            phone: e.target.value
        })
    }

    crossStreetChangeHandler = (e) => {
        this.setState({
            cross_street: e.target.value
        })
    }

    deliveryInstructionsChangeHandler = (e) => {
        this.setState({
            delivery_instructions: e.target.value
        })
    }

    addressNameChangeHandler = (e) => {
        this.setState({
            address_name: e.target.value
        })
    }

    btnTypeClicked = (e) => {
        this.setState({
            btnType: e.target.name
        });
        this.showAddressModal()
    }

    //submit Login handler to send a request to the node backend
    updateAddress = (e) => {
        //prevent page from refresh
        e.preventDefault();
        const data = {
            street_address: this.state.street_address,
            apt: this.state.apt,
            city: this.state.city,
            state: this.state.state,
            zip_code: this.state.zip_code,
            phone: this.state.phone,
            cross_street: this.state.cross_street,
            delivery_instructions: this.state.delivery_instructions,
            address_name: this.state.address_name
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://3.88.193.169:3001/userUpdateAddress', data)
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
        this.showAddressModal()

    };

    addAddress = (e) => {
        //prevent page from refresh
        e.preventDefault();
        const data = {
            street_address: this.state.street_address,
            apt: this.state.apt,
            city: this.state.city,
            state: this.state.state,
            zip_code: this.state.zip_code,
            phone: this.state.phone,
            cross_street: this.state.cross_street,
            delivery_instructions: this.state.delivery_instructions,
            address_name: this.state.address_name
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://3.88.193.169:3001/userAddAddress', data)
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
        this.showAddressModal()
    };

    render() {

        console.log(this.state.btnType);

        let address = null;
        if (this.state.street_address) {
            address =
                <div>
                    <p>{this.state.address_name}</p>
                    <p>{this.state.street_address} {this.state.apt}</p>
                    <button onClick={this.btnTypeClicked} className="btn btn-link" type="button" name="Update">Edit</button>
                </div>
        } else {
            address = <p className="card-text">You don't have any saved addresses.</p>
        }

        return (
            <div className="divStyle">
                <div className="card">
                    <div className="card-body">
                        {!this.state.showAddressModal ?
                            <div>
                                <h6 className="card-title">Addresses</h6>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">{address}</li>
                                    <li className="list-group-item">
                                        <button onClick={this.btnTypeClicked} name="Add" className="btn btn-link" type="button">+ Add a new address</button>
                                    </li>
                                </ul>
                            </div>
                            :
                            <AddressModal
                                isOpen={this.state.showAddressModal}
                                street_address={this.state.street_address}
                                apt={this.state.apt}
                                city={this.state.city}
                                state={this.state.state}
                                zip_code={this.state.zip_code}
                                phone={this.state.phone}
                                cross_street={this.state.cross_street}
                                delivery_instructions={this.state.delivery_instructions}
                                address_name={this.state.address_name}
                                streetAddressChangeHandler={this.streetAddressChangeHandler}
                                aptChangeHandler={this.aptChangeHandler}
                                cityChangeHandler={this.cityChangeHandler}
                                stateChangeHandler={this.stateChangeHandler}
                                zipCodeChangeHandler={this.zipCodeChangeHandler}
                                phoneChangeHandler={this.phoneChangeHandler}
                                crossStreetChangeHandler={this.crossStreetChangeHandler}
                                deliveryInstructionsChangeHandler={this.deliveryInstructionsChangeHandler}
                                addressNameChangeHandler={this.addressNameChangeHandler}
                                submitAddress={this.state.btnType === 'Add' ? this.addAddress : this.updateAddress}
                                showAddressModal={this.showAddressModal}
                                btnType={this.state.btnType}
                            />
                        }
                    </div>
                </div>
            </div>

        );
    }
}

export default Address;
