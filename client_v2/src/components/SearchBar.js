import React, { Component } from 'react';

import './bootstrap.min.css'
import './App.css';

import DateRangePicker from "@wojtekmaj/react-daterange-picker";

import Form from "./Form";
import {resetData} from "../actions";
import {connect} from "react-redux";

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
            date : '',
            showSecond: false
        };


        this.buttonSearch = this.buttonSearch.bind(this);
        this.dateChange = this.dateChange.bind(this);

    }

    buttonSearch = async (e) => {
        console.log(this.state.date);
        await this.props.resetData({});
        await this.form.buttonClicked();
        if(this.state.showSecond) await this.form2.buttonClicked();
    };

    buttonAdd = () => {
        this.setState({
            showSecond: !this.state.showSecond
        })
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
        let styleForm = {display: "none"};
        if(this.state.showSecond){
            styleForm = {};
        }
        let buttonText = !this.state.showSecond ? "Dodaj vozilo (+)" : "Skloni vozilo (-)";
        return (
            <div className="searchBar text-white bg-primary">

                <form className="searchBarForm ">
                    <div className="d-flex justify-content-center">
                        <label >Datumi oglasa:</label>
                        <DateRangePicker
                            className="bg-light input-group-text"
                            onChange={this.dateChange}
                            value={this.state.date}
                        />
                    </div>
                    <br/>
                    <div className="d-flex justify-content-between">
                        <div className="forms">
                            <Form index={1} formRef={ref => (this.form = ref)} dates={this.state.date}/>
                            <br/>
                            <div style={styleForm}>
                                <Form index={2} formRef={ref => (this.form2 = ref)} dates={this.state.date}/>
                                <br/>
                            </div>
                        </div>

                        <div className=" buttons">
                            <div className="d-flex justify-content-end">
                                <button type="button" onClick={this.buttonAdd} className="btn btn-primary mb-2">
                                    {buttonText}
                                </button>
                            </div>

                            <div className="d-flex justify-content-end">
                                <button type="button" onClick={this.buttonSearch} className="btn btn-warning mb-2">Pretrazi</button>
                            </div>
                        </div>
                    </div>
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

