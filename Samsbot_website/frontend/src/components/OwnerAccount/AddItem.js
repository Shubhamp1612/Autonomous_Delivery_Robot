import React, { Component } from 'react';
import './AddItem.css';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

class AddItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pictures: [],
            sections: [],
            item_name: '',
            item_decription: '',
            item_price: '',
            section_id: null,
            authFlag: false,
            errorMessage: false
        };

        this.onDrop = this.onDrop.bind(this);
        this.itemNameChangeHandler = this.itemNameChangeHandler.bind(this);
        this.itemDescriptionChangeHandler = this.itemDescriptionChangeHandler.bind(this);
        this.itemPriceChangeHandler = this.itemPriceChangeHandler.bind(this);
        this.itemSectionChangeHandler = this.itemSectionChangeHandler.bind(this);
        this.addItem = this.addItem.bind(this);
    }

    componentDidMount() {
        axios.get('http://3.88.193.169:3001/ownerSections')
            .then((response) => {
                console.log(response.data);
                this.setState({
                    sections: response.data
                });
            });
    }

    itemNameChangeHandler = (e) => {
        this.setState({
            item_name: e.target.value
        })
    }

    itemDescriptionChangeHandler = (e) => {
        this.setState({
            item_decription: e.target.value
        })
    }

    itemPriceChangeHandler = (e) => {
        this.setState({
            item_price: e.target.value
        })
    }

    itemSectionChangeHandler = (e) => {

        var sectionID = this.state.sections.filter(section => {
            if (e.target.value === section.section_name) {
                return section.section_id;
            }
        });

        this.setState({
            section_id: sectionID[0].section_id
        })

    }

    onDrop(picture) {
        this.setState({
            pictures: picture
        });
    }

    // submit handler to send a request to the node backend
    addItem = (e) => {
        //prevent page from refresh
        e.preventDefault();

        const uploaders = this.state.pictures.map(picture => {
            const data = new FormData();
            data.append("image", picture, picture.name);
            console.log(data)
            // Make an AJAX upload request using Axios
            axios.post('http://3.88.193.169:3001/upload', data)
                .then(response => {
                    this.setState({ imageUrl: response.data.imageUrl });
                }).then(() => {
                    const data = {
                        section_id: this.state.section_id,
                        item_name: this.state.item_name,
                        item_description: this.state.item_decription,
                        item_price: this.state.item_price,
                        item_image: this.state.imageUrl
                    }
                    console.log(data);
                    //set the with credentials to true
                    axios.defaults.withCredentials = true;
                    //make a post request with the user data
                    axios.post('http://3.88.193.169:3001/ownerAddItem', data)
                        .then(response => {
                            console.log("Status Code : ", response.status);
                            if (response.status === 200) {
                                this.setState({
                                    authFlag: true
                                })
                            } else {
                                this.setState({
                                    authFlag: false,
                                    errorMessage: true
                                })
                            }
                        });
                })
        });
    };

    render() {

        //if not logged in go to login page
        let redirectVar = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/" />
        }

        var options = [<option value="---" key="null">---</option>];
        var moreOptions = this.state.sections.map(section => {
            return (
                <option value={section.section_name} key={section.section_name}>{section.section_name}</option>
            )
        })

        options = options.concat(moreOptions);

        let message = null;
        if (this.state.authFlag) {
            message = <p>Item added !!!</p>
        }
        if (this.state.errorMessage) {
            message = <p>Cannot add section, try again!</p>
        }

        return (
            <div className="divStyle">
                {redirectVar}
                <form onSubmit={this.addItem}>
                    <div className="card">
                        <div className="card-body">
                            {message}
                            <h3 className="card-title">Item info</h3>
                            <p>Name your item and add a clear and informative description for your customers.</p>
                            <div>
                                <div>
                                    <p>Photo</p>
                                    <ImageUploader
                                        withIcon
                                        buttonText='Upload image'
                                        onChange={this.onDrop}
                                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                        maxFileSize={5242880}
                                        label='Upload a high quality photo of your item'
                                        withPreview
                                        singleImage
                                    />
                                </div>
                                <div>
                                    <div style={{ width: '50%' }} className="form-group">
                                        <label>Name</label>
                                        <input type="text" className="form-control" name="name" onChange={this.itemNameChangeHandler} />
                                    </div>
                                    <div style={{ width: '100%' }} className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            name="description"
                                            onChange={this.itemDescriptionChangeHandler} />
                                    </div>
                                    <div style={{ width: '50%' }} className="form-group">
                                        <label>Menu Section</label>
                                        <select
                                            id="section"
                                            name="selectSection"
                                            className="form-control"
                                            onChange={this.itemSectionChangeHandler}
                                        >
                                            {options}
                                        </select>
                                    </div>
                                    <div style={{ width: '30%' }} className="form-group">
                                        <label>Base Price</label>
                                        <input type="text" className="form-control" name="price" placeholder="$" onChange={this.itemPriceChangeHandler} />
                                    </div>
                                    <button className="btn btn-primary" type="submit">ADD ITEM</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

export default AddItem;