import React, { Component } from 'react';

import MediaQuery from 'react-responsive'
import './bootstrap.min.css'
import './App.css';

import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import DatePicker from 'react-date-picker'

import Form from "./Form";
import {resetData} from "../actions";
import {connect} from "react-redux";


import search from "./search.svg";
import plus from "./plus.svg"

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            showPlot : false,
            stylePlot : {display: "none"},
            showMap : false,
            x : -1,
            y : -1,
            dateFrom : '',
            dateTo: '',
            showSecond: false,
            rotation: 0,
            idTimer: null
        };


        this.buttonSearch = this.buttonSearch.bind(this);
        this.dateChangeFrom = this.dateChangeFrom.bind(this);
        this.dateChangeTo = this.dateChangeTo.bind(this);
        this.stopRotate = this.stopRotate.bind(this);
        this.rotate = this.rotate.bind(this);
    }

    stopRotate () {
        clearInterval(this.state.idTimer);
    }
    rotate(){
        let newRotation = this.state.rotation + 1;
        if(newRotation >= 360){
            newRotation =- 360;
        }
        this.setState({
            rotation: newRotation,
        });
        console.log(this.state.rotation)
        if(this.state.rotation % 45 === 0)
            this.stopRotate();
    }

    buttonSearch = async (e) => {
        console.log(this.state.dateFrom);
        console.log(this.state.dateTo);
        if(this.state.dateTo === '' || this.state.dateFrom === ''){
            alert("Morate uneti datum!");
            return;
        }
        await this.props.resetData({});
        await this.form.buttonClicked();
        if(this.state.showSecond) await this.form2.buttonClicked();
    };

    buttonAdd = () => {
        this.rotate();
        this.setState({
            showSecond: !this.state.showSecond,
            rotate: true,
            idTimer: setInterval(() => this.rotate(), 1/100)
        })
    };

    dateChangeFrom = (e) => {

        if(e === null) {
            this.setState({
                dateFrom: ''
            });
        } else {
            this.setState({
                dateFrom: e
            });
        }

    };

    dateChangeTo = (e) => {

        if(e === null) {
            this.setState({
                dateTo: ''
            });
        } else {

            this.setState({
                dateTo: e
            });
        }

    };


    render() {
        let styleForm = {display: "none"};
        if(this.state.showSecond){
            styleForm = {};
        }
        let buttonText = !this.state.showSecond ? "Dodaj vozilo "  : "Skloni vozilo ";
        const { rotation } =  this.state;
        return (
            <div className="searchBar text-white bg-primary">

                <form className="searchBarForm ">


                        <MediaQuery  minDeviceWidth={1224}>
                            <div className="form-inline d-flex d-flex justify-content-center">
                                <div className="vbox">
                                    <label >Datumi oglasa od:</label>
                                    <div className="date-picker">
                                        <DatePicker
                                            onChange={this.dateChangeFrom}
                                            value={this.state.dateFrom}/>

                                    </div>

                                </div>
                                <div className="vbox">
                                    <label >Datumi oglasa do:</label>

                                    <div className="date-picker">

                                        <DatePicker
                                            onChange={this.dateChangeTo}
                                            value={this.state.dateTo}/>

                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div className="d-flex justify-content-between">
                                <div className="forms">
                                    <Form index={1} formRef={ref => (this.form = ref)} dates={[this.state.dateFrom, this.state.dateTo]}/>
                                    <br/>
                                    <div style={styleForm}>
                                        <Form index={2} formRef={ref => (this.form2 = ref)} dates={[this.state.dateFrom, this.state.dateTo]}/>
                                        <br/>
                                    </div>
                                </div>
                                <div className=" buttons">
                                    <br/>
                                    <div className="d-flex justify-content-end form-group ">
                                        <button type="button" onClick={this.buttonAdd} className="btn btn-primary mb-2 button">
                                            {buttonText} <img style={{transform: `rotate(${rotation}deg)`}} src={plus} className="plus-logo" alt="logo" />
                                        </button>
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <button type="button" onClick={this.buttonSearch} className="btn btn-warning text-white ButtonSearch">
                                            Pretraži <img src={search} className="search-logo" alt="logo" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </MediaQuery>
                        <MediaQuery  maxDeviceWidth={1224}>
                            <div className="form-inline d-flex d-flex justify-content-around">
                                <div className="vbox">
                                    <label >Datumi oglasa od:</label>
                                    <div className="date-picker">
                                        <DatePicker
                                            onChange={this.dateChangeFrom}
                                            value={this.state.dateFrom}/>

                                    </div>

                                </div>
                                <div className="vbox">
                                    <label >Datumi oglasa do:</label>

                                    <div className="date-picker">

                                        <DatePicker
                                            onChange={this.dateChangeTo}
                                            value={this.state.dateTo}/>

                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div className="d-flex justify-content-between">
                                <div className="form">
                                    <div className="forms-mobile d-flex">
                                        <div className="form-mobile">
                                            <Form  index={1} formRef={ref => (this.form = ref)} dates={[this.state.dateFrom, this.state.dateTo]}/>
                                        </div>
                                        <br/>
                                        <div className="form-mobile"  style={styleForm}>
                                            <Form index={2} formRef={ref => (this.form2 = ref)} dates={[this.state.dateFrom, this.state.dateTo]}/>
                                            <br/>
                                        </div>
                                    </div>
                                    <div className="form-inline buttons-mobile d-flex justify-content-center">
                                        <br/>
                                        <div className=" ">
                                            <button type="button" onClick={this.buttonAdd} className="btn btn-primary mb-2 button">
                                                {buttonText} <img style={{transform: `rotate(${rotation}deg)`}} src={plus} className="plus-logo" alt="logo" />
                                            </button>
                                        </div>

                                        <div className="">
                                            <button type="button" onClick={this.buttonSearch} className="btn btn-warning text-white ButtonSearch">
                                                Pretraži <img src={search} className="search-logo" alt="logo" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </MediaQuery>


                </form>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch){
    return {
        resetData: data => dispatch(resetData(data))
    }
}
export default connect(null, mapDispatchToProps)(SearchBar);

