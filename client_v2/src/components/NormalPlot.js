import React, { Component } from 'react'
import axios from 'axios'
import "./App.css";
import Plot from "react-plotly.js";


class NormalPlot extends Component{
    constructor(props) {
        super(props);
        this.state = {
            normal: [],
            search: props.search
        };
    }
    async componentDidMount() {

        let normal = await axios.post('/normal', this.state.search);
        console.log(normal);
        this.setState({
            normal: normal.data
        })

    }



    render() {

        return (
            <div>
                <Plot style = {{width: "100%"}}
                      data={[
                          {
                              type: 'histogram',
                              x: this.state.normal.data,
                          }
                      ]}
                      layout={ { title: 'Histogram normalne raspodele za '
                              + this.state.search['marka'] + ' '
                              + this.state.search['model']} }
                />
            </div>
        )
    }
}


export default NormalPlot
