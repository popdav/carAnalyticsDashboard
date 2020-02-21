import React, { Component } from 'react';

import './bootstrap.min.css'
import './App.css';

import Octicon, {Gear, Person, Bell} from '@primer/octicons-react'



class NavigatorBar extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }


    render() {

        return (
            <div >
                <nav className="navbar navbar-dark bg-primary">
                    <div className="container">
                        <div className="navbar-brand font-weight-bold">AutoAnaliza.com</div>
                        {/*<span className="text-white">
                            <Octicon size="medium" icon={Person}/>
                            <span>{"   "}</span>
                            <Octicon size="medium" icon={Bell}/>
                            <span>{"   "}</span>
                            <Octicon size="medium" icon={Gear}/>
                        </span>*/}
                    </div>
                </nav>
                <br/>
            </div>
        );
    }
}


export default NavigatorBar;

