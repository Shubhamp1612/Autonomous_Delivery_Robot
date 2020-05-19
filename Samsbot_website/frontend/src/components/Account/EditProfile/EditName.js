import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EditName extends Component {
    render() {
        return (
            <div className="card-body">
                <h3 className="card-title">Edit Name</h3>
                <form>
                    <div style={{ width: '30%' }} className="form-group">
                        <label>First Name</label>
                        <input value={this.props.firstName} type="text" className="form-control" name="firstName" onChange={this.props.firstNameChangeHandler} />
                    </div>
                    <div style={{ width: '30%' }} className="form-group">
                        <label>Last Name</label>
                        <input value={this.props.lastName} type="text" className="form-control" name="lastName" onChange={this.props.lastNameChangeHandler} />
                    </div>
                    <div style={{ width: '30%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <button onClick={this.props.submitUpdateName} className="btn btn-primary" type="submit">Update Name</button>
                        <button onClick={this.props.showEditName} className="btn btn-primary" type="submit">Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}

EditName.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    firstNameChangeHandler: PropTypes.func,
    lastNameChangeHandler: PropTypes.func,
    submitUpdateName: PropTypes.func,
    showEditName: PropTypes.func
};

export default EditName;