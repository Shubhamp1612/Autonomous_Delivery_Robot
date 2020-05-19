import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EditProfile extends Component {
    render() {
        return (
            <div className="card-body">
                <h3 className="card-title">Edit Profile</h3>
                <form onSubmit={this.props.submitUpdate}>
                    <div style={{ width: '30%' }} className="form-group">
                        <label>First Name</label>
                        <input value={this.props.firstName} type="text" className="form-control" name="firstName" onChange={this.props.firstNameChangeHandler} />
                    </div>
                    <div style={{ width: '30%' }} className="form-group">
                        <label>Last Name</label>
                        <input value={this.props.lastName} type="text" className="form-control" name="lastName" onChange={this.props.lastNameChangeHandler} />
                    </div>
                    <div style={{ width: '30%' }} className="form-group">
                        <label>Email</label>
                        <input value={this.props.email} type="text" className="form-control" name="email" onChange={this.props.emailChangeHandler} />
                    </div>
                    <div style={{ width: '30%' }} className="form-group">
                        <label>Phone</label>
                        <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="e.g. 555-555-1212" className="form-control" value={this.props.phone} name="phone" onChange={this.props.phoneChangeHandler} />
                    </div>
                    <div style={{ width: '30%' }} className="form-group">
                        <label>Restaurant Name</label>
                        <input value={this.props.restName} type="text" className="form-control" name="email" onChange={this.props.restNameChangeHandler} />
                    </div>
                    <div style={{ width: '30%' }} className="form-group">
                        <label>Cuisine</label>
                        <input value={this.props.cuisine} type="text" className="form-control" name="email" onChange={this.props.cuisineChangeHandler} />
                    </div>
                    <div style={{ width: '30%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <button className="btn btn-primary" type="submit">Update</button>
                        <button onClick={this.props.showEditName} className="btn btn-primary" type="submit">Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}

EditProfile.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    restName: PropTypes.string,
    cuisine: PropTypes.string,
    firstNameChangeHandler: PropTypes.func,
    lastNameChangeHandler: PropTypes.func,
    emailChangeHandler: PropTypes.func,
    phoneChangeHandler: PropTypes.func,
    restNameChangeHandler: PropTypes.func,
    cuisineChangeHandler: PropTypes.func,
    submitUpdate: PropTypes.func,
    showEdit: PropTypes.func
};

export default EditProfile;