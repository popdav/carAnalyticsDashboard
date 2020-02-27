import React, { Component } from 'react';

import './bootstrap.min.css'
import './App.css';




class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }


    render() {

        return (
            <div className="jumbotron jumbotron-fluid text-white bg-primary footer">
                    <div className=" text-center ">
                        Kontakt: <br/>
                        info@autoanaliza.com<br/>
                        +381 62 107 76 67
                    </div>

            </div>
        );
    }
}


export default Footer;

