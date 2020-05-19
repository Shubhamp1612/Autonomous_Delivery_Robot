import React, { Component } from 'react';
import axios from 'axios';
import './OwnerProfile.css';
import './Menu.css';

class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sections: [],
            items: []
        }
    }

    componentDidMount() {

        axios.get('http://3.88.193.169:3001/ownerSections')
            .then((response) => {
                console.log(response.data);
                this.setState({
                    sections: response.data
                });
            });

        axios.get('http://3.88.193.169:3001/ownerItemsList')
            .then((response) => {
                console.log(response.data);
                this.setState({
                    items: response.data
                });
            });

    }

    submitDeleteItem = (e) => {
        //prevent page from refresh
        e.preventDefault();
        const data = {
            deleteId: e.target.id
        }
        console.log(data.deleteId)
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://3.88.193.169:3001/ownerDeleteItem', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        deletedMessage: true
                    })
                } else {
                    this.setState({
                        authFlag: false,
                        errorMessage: true
                    })
                }
            });
        window.location.reload();

    };

    render() {

        let message = null;

        if (this.state.errorMessage) {
            message = <p>Failed, try again!</p>
        }

        if (this.state.deletedMessage) {
            message = <p>Item successfully deleted!</p>
        }

        const listItems = this.state.sections.map((section) =>
            <li className="list-group-item" key={section.section_id}>
                <h3>{section.section_name}</h3>
                <p>{section.section_description}</p>
                <ul className="list-group list-group-flush">
                    {this.state.items.map((item) => {
                        if (item.section_id === section.section_id) {
                            return (
                                <li className="list-group-item" key={item.item_id}>
                                    <div className="card">
                                        <div className="itemLayout">
                                            <img className="itemImage" src={item.item_image} title={item.item_name}/>
                                            <div className="itemDetails">
                                                <h5 className="card-title">{item.item_name}</h5>
                                                <h6 className="card-subtitle">{item.item_description}</h6>
                                                <p className="card-text">{item.item_price}</p>
                                                <button onClick={this.submitDeleteItem} id={item.item_id} className="btn btn-link" type="button" name="Update">Delete</button>
                                            </div>
                                        </div>
                                    </div>

                                </li>
                            );
                        }
                    })}
                </ul>
            </li>
        );

        return (
            <div className="divStyle">
                {message}
                <div className="card">
                    <ul className="list-group list-group-flush">{listItems}</ul>
                </div>
            </div>
        );
    }
}

export default Menu;