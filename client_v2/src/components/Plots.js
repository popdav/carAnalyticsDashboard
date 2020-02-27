import React, { Component } from 'react';

import './bootstrap.min.css'
import './App.css';
import { connect } from 'react-redux'
import Plot from "react-plotly.js";
import Mapa from './Mapa'
import NormalPlot from "./NormalPlot";

import car from './car.svg'
import search from "./search.svg";

class Plots extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            show: false
        };
    }

    async UNSAFE_componentWillReceiveProps(nextProps){

        if(nextProps.data.length === 0)
            return;

        this.setState({
            data: [...nextProps.data[0].data],
            stylePlot: nextProps.data[0].style,
            x: nextProps.data[0].x,
            y: nextProps.data[0].y,
            show: true,
            name: nextProps.data[0].name
        });

    }

    showPlots() {
        return (
            <div className="plots" style={this.state.stylePlot}>
                <div className="d-flex justify-content-center">
                    <Plot style = {{width: "100%"}}
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
                </div>

                <div className="d-flex justify-content-center">
                    <Plot style = {{width: "100%"}}
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
                <br/>

                {this.props.data.map((e,i) => {
                    return(
                        <div key={i} className="justify-content-center">
                            <NormalPlot  search={e.searchBody}/>
                        </div>
                    );
                })}

                <br/>

                {this.props.data.map((e, i) => {

                    return(
                        <div key={i} className=" justify-content-center">
                            <Mapa  data={e}/>
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {

        return (
            <div className="container Plots">
                {this.state.show ? this.showPlots() : <img src={car} className="car-logo img-fluid d-block mx-auto" alt="logo" />}
            </div>
        );
    }
}


const mapStateToProps = state => {
    return { data: state.data }
};

export default connect(mapStateToProps, {})(Plots);

