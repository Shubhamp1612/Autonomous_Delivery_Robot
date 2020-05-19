import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SectionsModal.css';
import Modal from 'react-modal';

class SectionsModal extends Component {
    render() {

        let heading = null;
        if(this.props.btnType === 'Add') {
            heading = 'Add new section';
        } else {
            heading = 'Update section';
        }

        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                >
                    <div>
                        <div className="modal-header">
                            <h5 className="modal-title">{heading}</h5>
                            <button onClick={this.props.showSectionsModal} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="container">
                            <div className="modal-body">
                                <form onSubmit={this.props.submitSection}>
                                    <div style={{ width: '30%' }} className="form-group">
                                        <label>Section Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={this.props.sectionName}
                                            name="sectionName"
                                            onChange={this.props.sectionNameChangeHandler}
                                            required />
                                    </div>
                                    <div style={{ width: '100%' }} className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            value={this.props.sectionDescription}
                                            name="sectionDescription"
                                            onChange={this.props.sectionDescriptionChangeHandler}
                                            placeholder="Describe the types of menu items that will be found in this section" />
                                    </div>
                                    <div className="footerBtns">
                                        <button type="submit" className="btn btn-primary">{this.props.btnType}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

SectionsModal.propTypes = {
    isOpen: PropTypes.bool,
    sectionName: PropTypes.string,
    sectionDescription: PropTypes.string,
    showSectionsModal: PropTypes.func,
    sectionNameChangeHandler: PropTypes.func,
    sectionDescriptionChangeHandler: PropTypes.func,
    submitSection: PropTypes.func,
    btnType: PropTypes.string
}

export default SectionsModal;