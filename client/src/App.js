import React, { Component } from 'react';
import Map from './Map.js';
import './bootstrap.min.css'
import './App.css';

import axios from 'axios'
import Plot from 'react-plotly.js';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type : [],
            selectedType : '',
            makes: [],
            selectedMake:'',
            models : [],
            selectedModel : '',
            data : [],
            showPlot : false,
            stylePlot : {display: "none"},
            showMap : false,
            x : -1,
            y : -1,
            fromKm : '',
            toKm : '',
            fromPower : '',
            toPower : '',
            date : ''
        };

        this.makeChange = this.makeChange.bind(this);
        this.modelChange = this.modelChange.bind(this);
        this.buttonSearch = this.buttonSearch.bind(this);
        this.fromKm = this.fromKm.bind(this);
        this.toKm = this.toKm.bind(this);
        this.typeChange = this.typeChange.bind(this);
    }
    componentDidMount() {
        axios.post('/distinctMakes')
            .then((res) => {

                this.setState({
                    makes : res.data
                });

            })
            .catch((err) => {
              console.log(err)
            })
        axios.post('/distinctType')
            .then((res) => {

                this.setState({
                    type : res.data
                });

            })
            .catch((err) => {
                console.log(err)
            })

    }
    makeChange = (e) => {
        e.persist();
        if(e.target.value !== 'None') {
            this.setState({
                selectedMake: e.target.value
            });
            axios.post('/distinctModels', {'Marka': e.target.value})
                .then((res) => {

                    this.setState({
                        models: res.data
                    });

                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            this.setState({
                selectedMake:'',
                models : [],
                selectedModel : ''
            });
        }
    };

    modelChange = (e) => {
        e.persist();

        this.setState({
            selectedModel: e.target.value
        });

    };

    buttonSearch = (e) => {
        // e.persist();
        let kmBody = {
            "$gte" : (this.state.fromKm === '' ? undefined : parseInt(this.state.fromKm)),
            "$lte" : (this.state.toKm === '' ? undefined : parseInt(this.state.toKm))
        };
        if(this.state.fromKm === '' && this.state.toKm === '')
            kmBody = undefined;

        let powerBody = {
            "$gte" : (this.state.fromPower === '' ? undefined : parseInt(this.state.fromPower)),
            "$lte" : (this.state.toPower === '' ? undefined : parseInt(this.state.toPower))
        };
        if(this.state.fromPower === '' && this.state.toPower === '')
            powerBody = undefined;

        const body = {
            'Marka' : this.state.selectedMake,
            'Model' : this.state.selectedModel === '' ? undefined : this.state.selectedModel,
            'Kilometraza' : kmBody,
            'Snaga_motora' : powerBody,
            'Karoserija' : this.state.selectedType === '' ? undefined : this.state.selectedType
        };

        axios.post('/queryFromDateToDate', {searchBody : body, dates : this.state.date})
            .then((res) => {
                console.log(res.data)
                this.setState({
                    data: res.data,
                    stylePlot : {display: "block"},
                    showMap : true,
                    x : res.data.map(( o ) => o._id),
                    y : res.data.map(( o ) => o.avg_price)
                });

            })
            .catch((err) => {
                console.log(err)
            })

    };

    fromKm = (e) => {
        e.persist();
        if(e.target.value === "None") {
            this.setState({
                fromKm: ''
            });
        } else {
            this.setState({
                fromKm: e.target.value
            });
        }

    };

    toKm = (e) => {
        e.persist();

        if(e.target.value === "None") {
            this.setState({
                toKm: ''
            });
        } else {
            this.setState({
                toKm: e.target.value
            });
        }

    };

    fromPower = (e) => {
        e.persist();
        this.setState({
            fromPower: e.target.value
        });


    };

    toPower = (e) => {
        e.persist();

        this.setState({
            toPower: e.target.value
        });


    };

    typeChange = (e) => {
        e.persist();
        if(e.target.value === 'None'){
            this.setState({
                selectedType: ''
            });
        } else {
            this.setState({
                selectedType: e.target.value
            });
        }

    };

    dateChange = (e) => {
        console.log(e)

        if(e === null) {
            this.setState({
                date: ''
            });
        } else {
            this.setState({
                date: e
            });
        }



    };

    render() {

        const position = [51.505, 0.09]
        return (
            <div className="container App">

                <div className="searchBar">
                    <form>
                        <label >Datumi oglasa:</label>
                        <div>
                            <DateRangePicker
                                onChange={this.dateChange}
                                value={this.state.date}
                            />
                        </div>

                        <br/>
                        <div className="form-group">
                            <label htmlFor="make">Marka:</label>
                            <select onChange={this.makeChange} className="form-control" id="make">
                                <option>None</option>
                                {this.state.makes.map((e, key) => {
                                    return (
                                        <option key={key}>{e}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="model">Marka:</label>
                            <select onChange={this.modelChange} className="form-control" id="model">
                                <option>None</option>
                                {this.state.models.map((e, key) => {
                                    return (
                                        <option key={key}>{e}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="form-group">

                        </div>
                        <div className="form-group">
                            <label htmlFor="kmFrom">Kilometraza od (km):</label>
                            <select onChange={this.fromKm} className="form-control" id="kmFrom">
                                <option>None</option>
                                <option>0</option>
                                <option>100000</option>
                                <option>150000</option>
                                <option>200000</option>
                            </select>

                            <label htmlFor="kmTo">Kilometraza do (km):</label>
                            <select onChange={this.toKm} className="form-control" id="kmTo">
                                <option>None</option>
                                <option>200000</option>
                                <option>150000</option>
                                <option>100000</option>
                                <option>0</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="powerFrom">Snaga od (KS):</label>
                            <input type="number"  onChange={this.fromPower} className="form-control" id="powerFrom" />
                            <label htmlFor="powerTo">Snaga do (KS):</label>
                            <input type="number"  onChange={this.toPower} className="form-control" id="powerTo" />

                        </div>

                        <div className="form-group">
                            <label htmlFor="type">Karoserija:</label>
                            <select onChange={this.typeChange} className="form-control" id="type">
                                <option>None</option>
                                {this.state.type.map((e, key) => {
                                    return (
                                        <option key={key}>{e}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <button type="button" onClick={this.buttonSearch} className="btn btn-primary mb-2">Pretrazi</button>
                    </form>
                </div>

                <div className="plots" style={this.state.stylePlot}>
                    <div className="generaInfo">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Datum</th>
                                {this.state.data.map((e, i) => {
                                    return (
                                        <th key={i + e._id}>{e._id}</th>
                                    )
                                })}
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th scope="row">Prosecna cena</th>
                                {this.state.data.map((e, i) => {
                                    return (
                                        <td key={i + e._id}>{ Math.round(e.avg_price * 100) / 100}{'€'}</td>
                                    )
                                })}

                            </tr>
                            <tr>
                                <th scope="row">Maksimalna cena</th>
                                {this.state.data.map((e, i) => {
                                    return (
                                        <td key={i + e._id}>{e.max}{'€'}</td>
                                    )
                                })}

                            </tr>
                            <tr>
                                <th scope="row">Minimalna cena</th>
                                {this.state.data.map((e, i) => {
                                    return (
                                        <td key={i + e._id}>{e.min}{'€'}</td>
                                    )
                                })}

                            </tr>
                            <tr>
                                <th scope="row">Broj vozila</th>
                                {this.state.data.map((e, i) => {
                                    return (
                                        <td key={i + e._id}>{e.places.length}</td>
                                    )
                                })}

                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <Plot
                        data={[
                            {
                                type: 'bar',
                                x: this.state.x,
                                y: this.state.y
                            },
                            {
                                type: 'line',
                                x: this.state.x,
                                y: this.state.y
                            }
                        ]}
                        layout={ { title: 'Prosecna cena po danima'} }
                    />


                </div>

                <div className="map">
                    <Map
                        app_id="OSa8eT7cT7bZGWb0QcyH"
                        app_code="th5m-4ZNQo-BY6Gc6w99FA"
                        lat="44.787197"
                        lng="20.457273"
                        zoom="7"
                        show={this.state.showMap}
                        places={this.state.data}
                    />


                </div>




                <div className="footer"></div>



            </div>

        );
    }
}



export default App;

