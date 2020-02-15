import React, { Component } from 'react';

import './bootstrap.min.css'
import './App.css';
import { connect } from 'react-redux'
import {setData} from '../actions/index'
import {addData} from "../actions/index";
import {resetData} from "../actions/index";
import store from "../store/index";
import axios from "axios";



class Form extends Component {
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
            date : this.props.dates,
            key: this.props.index
        };

        this.makeChange = this.makeChange.bind(this);
        this.modelChange = this.modelChange.bind(this);
        //this.buttonSearch = this.buttonSearch.bind(this);
        this.fromKm = this.fromKm.bind(this);
        this.toKm = this.toKm.bind(this);
        this.typeChange = this.typeChange.bind(this);
        this.buttonClicked = this.buttonClicked.bind(this);
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

        const { formRef } = this.props;
        formRef(this);
    }

    componentWillUnmount() {

        const { formRef } = this.props;
        formRef(undefined);
    }

    makeChange = (e) => {
        e.persist();
        if(e.target.value !== 'None') {
            this.setState({
                selectedMake: e.target.value
            });
            axios.post('/distinctModels', {'marka': e.target.value})
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

     buttonClicked = async () => {

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
            'marka' : this.state.selectedMake,
            'model' : this.state.selectedModel === '' ? undefined : this.state.selectedModel,
            'kilometraza' : kmBody,
            'snaga' : powerBody,
            'karoserija' : this.state.selectedType === '' ? undefined : this.state.selectedType
        };
        console.log(this.props)
        const res = await axios.post('/queryFromDateToDate', {searchBody : body, dates : this.props.dates});
        console.log(res.data);
        if(res.data.length === 0)
            return;
        console.log("STORE:");
        console.log(store.getState());
        if(store.getState().data.length === 0) {
            this.props.setData({
                 data: res.data,
                 numberOf: res.data.map(o => o.places.length),
                 stylePlot: {display: "block"},
                 showMap: true,
                 x: res.data.map((o) => o._id),
                 y: res.data.map((o) => o.avg_price),
                 name: res.data[0].places[0]['marka'] + " " + res.data[0].places[0]['model'],
                searchBody: body
            })
        } else if(store.getState().data.length === 1) {
             this.props.addData({
                 data: res.data,
                 numberOf: res.data.map(o => o.places.length),
                 stylePlot: {display: "block"},
                 showMap: true,
                 x: res.data.map((o) => o._id),
                 y: res.data.map((o) => o.avg_price),
                 name: res.data[0].places[0]['marka'] + " " + res.data[0].places[0]['model'],
                 searchBody: body
             })
        } else {
             await this.props.resetData({});
            this.props.setData({
                data: res.data,
                numberOf: res.data.map(o => o.places.length),
                stylePlot: {display: "block"},
                showMap: true,
                x: res.data.map((o) => o._id),
                y: res.data.map((o) => o.avg_price),
                name: res.data[0].places[0]['marka'] + " " + res.data[0].places[0]['model'],
                searchBody: body
            })
        }

    };

    render() {

        return (
            <div>
                    <div className="form-inline d-flex justify-content-between">
                        <div className="vbox">
                            <label htmlFor="make">Marka:</label>
                            <select onChange={this.makeChange} className="form-control" id={"make" + this.state.key} >
                                <option>None</option>
                                {this.state.makes.map((e, key) => {
                                    return (
                                        <option key={key}>{e}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className="vbox">
                            <label htmlFor="model">Model:</label>
                            <select onChange={this.modelChange} className="form-control" id={"model" + this.state.key}>
                                <option>None</option>
                                {this.state.models.map((e, key) => {
                                    return (
                                        <option key={key}>{e}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className="vbox">
                            <label htmlFor="kmFrom">Kilometraza od (km):</label>
                            <select onChange={this.fromKm} className="form-control" id={"kmFrom" + this.state.key}>
                                <option>None</option>
                                <option>0</option>
                                <option>100000</option>
                                <option>150000</option>
                                <option>200000</option>
                            </select>
                        </div>
                        <div className="vbox">
                            <label htmlFor="kmTo">Kilometraza do (km):</label>
                            <select onChange={this.toKm} className="form-control" id={"kmTo" + this.state.key}>
                                <option>None</option>
                                <option>200000</option>
                                <option>150000</option>
                                <option>100000</option>
                                <option>0</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-inline d-flex justify-content-between">
                        <div className="vbox">
                            <label htmlFor="powerFrom">Snaga od (KS):</label>
                            <input type="number"  onChange={this.fromPower} className="form-control" id={"powerFrom" + + this.state.key} />
                        </div>
                        <div className="vbox">
                            <label htmlFor="powerTo">Snaga do (KS):</label>
                            <input type="number"  onChange={this.toPower} className="form-control" id={"powerTo" + this.state.key} />
                        </div>
                        <div className="vbox">
                            <label htmlFor="type">Karoserija:</label>
                            <select onChange={this.typeChange} className="form-control" id={"type" + this.state.key}>
                                <option>None</option>
                                {this.state.type.map((e, key) => {
                                    return (
                                        <option key={key}>{e}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>

            </div>
        );
    }
}

function mapDispatchToProps(dispatch){
    return {
        setData: data => dispatch(setData(data)),
        addData: data => dispatch(addData(data)),
        resetData: data => dispatch(resetData(data))
    }
}
export default connect(null, mapDispatchToProps)(Form);


