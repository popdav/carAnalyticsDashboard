import React, { Component } from 'react';

import './bootstrap.min.css'
import './App.css';
import { connect } from 'react-redux'
import Plot from "react-plotly.js";
import Mapa from "./Mapa";


class Plots extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            show: false
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        console.log(nextProps.data)
        if(nextProps.data.length === 0)
            return;
        this.setState({
            data: [...nextProps.data[0].data],
            stylePlot: nextProps.data[0].style,
            x: nextProps.data[0].x,
            y: nextProps.data[0].y,
            show: true,
            name: nextProps.data[0].name
        })

    }


    render() {
        let styleT = {};
        if(!this.state.show)
            styleT = {display: "none"};

        return (
            <div style={styleT}>


                <div className=" plots" style={this.state.stylePlot}>

                    <Plot
                        data={
                            this.props.data.map((e, i) => {
                                return {
                                    type: 'line',
                                    x: e.x,
                                    y: e.y,
                                    name: e.name
                                };
                            })
                        }
                        layout={ { title: 'Prosecna cena po danima'} }
                    />
                    <Plot
                        data={
                            this.props.data.map((e, i) => {
                                return {
                                    type: 'bar',
                                    x: e.x,
                                    y: e.numberOf,
                                    name: e.name
                                };
                            })
                        }
                        layout={ { title: 'Prosecan broj vozila po danima'} }
                    />



                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return { data: state.data }
};

export default connect(mapStateToProps, {})(Plots);

