import React, { Component } from 'react';

import './bootstrap.min.css'
import './App.css';

import Octicon, {Gear, Person, Bell, Mail} from '@primer/octicons-react'



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
                        Kontakt: info@autoanaliza.com
                    </div>

            </div>
        );
    }
}


export default Footer;
