import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class OwnerHomePage extends Component {
    render() {

        //if not logged in go to login page
        let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/"/>
        }

        return(
            <div>
            {redirectVar}
                <div className="container">
                    <h1>user home page comes here</h1>
                </div>
            </div>
        );
    }
}

export default OwnerHomePage;