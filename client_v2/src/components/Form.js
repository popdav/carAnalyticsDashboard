import React, { Component } from 'react';

import './bootstrap.min.css'
import './App.css';
import { connect } from 'react-redux'
import {setData} from '../actions/index'
import {addData} from "../actions/index";
import {resetData} from "../actions/index";
import axios from "axios";



class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type : [],
            selectedType : '',
            region: [],
            selectedRegion : '',
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
            fromPrice : '',
            toPrice : '',
            date : this.props.dates,
            key: this.props.index
        };

        this.makeChange = this.makeChange.bind(this);
        this.modelChange = this.modelChange.bind(this);
        this.fromKm = this.fromKm.bind(this);
        this.toKm = this.toKm.bind(this);
        this.typeChange = this.typeChange.bind(this);
        this.regionChange = this.regionChange.bind(this);
        this.buttonClicked = this.buttonClicked.bind(this);
        this.fromPrice = this.fromPrice.bind(this);
        this.toPrice = this.toPrice.bind(this);
        this.fromPower = this.fromPower.bind(this);
        this.toPower = this.toPower.bind(this);
    }
    async componentDidMount() {
        let makes = await axios.post('/distinct', {field : 'marka'});
        let type = await axios.post('/distinct', {field: 'karoserija'});
        let region = await axios.post('/distinct', {field: 'region'});
        this.setState({
            makes: makes.data,
            type: type.data,
            region: region.data
        });

        const { formRef } = this.props;
        formRef(this);
    }

    componentWillUnmount() {

        const { formRef } = this.props;
        formRef(undefined);
    }

    makeChange = async (e) => {
        e.persist();
        if(e.target.value !== 'None') {
            let models = await axios.post('/distinct', {field: 'model',  match:{'marka': e.target.value}});
            this.setState({
                selectedMake: e.target.value,
                models: models.data
            });
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

    fromPrice = (e) => {
        e.persist();
        this.setState({
            fromPrice: e.target.value
        });


    };

    toPrice = (e) => {
        e.persist();

        this.setState({
            toPrice: e.target.value
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

    regionChange = (e) => {
        e.persist();
        if(e.target.value === 'None'){
            this.setState({
                selectedRegion: ''
            });
        } else {
            this.setState({
                selectedRegion: e.target.value
            });
        }

    };

    getSearchBodyGLTE = (from, to)  => {
        let body = {
            "$gte" : (this.state[from] === '' ? undefined : parseInt(this.state[from])),
            "$lte" : (this.state[to] === '' ? undefined : parseInt(this.state[to]))
        };
        if(this.state[from] === '' && this.state[from] === '')
            body = undefined;

        return body;
    };

     buttonClicked = async () => {


        let kmBody = this.getSearchBodyGLTE('fromKm', 'toKm');
        let powerBody = this.getSearchBodyGLTE('fromPower', 'toPower');
        let priceBody = this.getSearchBodyGLTE('fromPrice', 'toPrice');


        const body = {
            'marka' : this.state.selectedMake,
            'model' : this.state.selectedModel === '' ? undefined : this.state.selectedModel,
            'kilometraza' : kmBody,
            'snaga' : powerBody,
            'cena': priceBody,
            'karoserija' : this.state.selectedType === '' ? undefined : this.state.selectedType,
            'mesto' : this.state.selectedRegion === '' ? undefined : this.state.selectedRegion
        };
        console.log(body);
        const res = await axios.post('/queryFromDateToDate', {searchBody : body, dates : this.props.dates});
        console.log(res.data);
        if(res.data.length === 0)
            return;

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


    };

    render() {

        return (
            <div>
                    <div className="form d-inline-flex">
                        <div className="form-group">
                            <div className="vbox">
                                <label htmlFor="make" className="col-8">Marka:</label>
                                <select onChange={this.makeChange} className="form-control col-8" id={"make" + this.state.key} >
                                    <option>None</option>
                                    {this.state.makes.map((e, key) => {
                                        return (
                                            <option key={key}>{e}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="vbox">
                                <label htmlFor="model" className="col-8">Model:</label>
                                <select onChange={this.modelChange} className="form-control col-8" id={"model" + this.state.key}>
                                    <option>None</option>
                                    {this.state.models.map((e, key) => {
                                        return (
                                            <option key={key}>{e}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="vbox ">
                                <label htmlFor="priceFrom" className="col-9">Cena od (‎€):</label>
                                <input type="number"  onChange={this.fromPrice} className="form-control col-7" id={"priceFrom" + + this.state.key} />
                            </div>
                            <div className="vbox ">
                                <label htmlFor="priceTo" className="col-9">Cena do (‎€):</label>
                                <input type="number"  onChange={this.toPrice} className="form-control col-7" id={"priceTo" + this.state.key} />
                            </div>
                        </div>

                        <div className="form-group ">
                            <div className="vbox">
                                <label htmlFor="powerFrom" className="col-10">Snaga od (KS):</label>
                                <input type="number"  onChange={this.fromPower} className="form-control col-8" id={"powerFrom" + + this.state.key} />
                            </div>
                            <div className="vbox">
                                <label htmlFor="powerTo" className="col-10">Snaga do (KS):</label>
                                <input type="number"  onChange={this.toPower} className="form-control col-8" id={"powerTo" + this.state.key} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="vbox">
                                <label htmlFor="region" className="col-8">Region:</label>
                                <select onChange={this.regionChange} className="form-control col-8" id={"region" + this.state.key}>
                                    <option>None</option>
                                    {this.state.region.map((e, key) => {
                                        return (
                                            <option key={key}>{e}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="vbox">
                                <label htmlFor="type" className="col-8">Karoserija:</label>
                                <select onChange={this.typeChange} className="form-control col-8" id={"type" + this.state.key}>
                                    <option>None</option>
                                    {this.state.type.map((e, key) => {
                                        return (
                                            <option key={key}>{e}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="vbox">
                                <label htmlFor="kmFrom" className="col-16">Kilometraza od (km):</label>
                                <select onChange={this.fromKm} className="form-control" id={"kmFrom" + this.state.key}>
                                    <option>None</option>
                                    <option>0</option>
                                    <option>100000</option>
                                    <option>150000</option>
                                    <option>200000</option>
                                </select>
                            </div>
                            <div className="vbox">
                                <label htmlFor="kmTo" className="col-15">Kilometraza do (km):</label>
                                <select onChange={this.toKm} className="form-control" id={"kmTo" + this.state.key}>
                                    <option>None</option>
                                    <option>200000</option>
                                    <option>150000</option>
                                    <option>100000</option>
                                    <option>0</option>
                                </select>
                            </div>
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


