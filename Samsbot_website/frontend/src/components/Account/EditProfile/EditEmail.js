import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EditEmail extends Component {
    render() {
        return (
            <div className="card-body">
                <h3 className="card-title">Edit Email</h3>
                <form>
                    <div style={{ width: '30%' }} className="form-group">
                        <label>New Email</label>
                        <input value={this.props.email} type="text" className="form-control" name="email" onChange={this.props.emailChangeHandler} />
                    </div>
                    <div style={{ width: '30%' }} className="form-group">
                        <label>Confirm Email</label>
                        <input type="text" className="form-control" name="confirmEmail" onChange={this.props.confirmEmailChangeHandler} />
                    </div>
                    <div style={{ width: '30%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <button onClick={this.props.submitUpdateEmail} className="btn btn-primary" type="submit">Update Email</button>
                        <button onClick={this.props.showEditEmail} className="btn btn-primary" type="submit">Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}

EditEmail.propTypes = {
    email: PropTypes.string,
    emailChangeHandler: PropTypes.func,
    confirmEmailChangeHandler: PropTypes.func,
    submitUpdateEmail: PropTypes.func,
    showEditEmail: PropTypes.func
};

export default EditEmail;