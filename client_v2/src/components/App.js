import React, { Component } from 'react';

import './bootstrap.min.css'
import './App.css';


import SearchBar from "./SearchBar";
import Plots from "./Plots";
import NavigatorBar from "./NavigatorBar";

import { Provider } from 'react-redux'
import store from '../store/index'



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }


  render() {

    return (
        <Provider store={store}>
        <NavigatorBar />
          <div className="container App">

              <SearchBar />

              <br/>
              <Plots/>

          </div>
        </Provider>

    );
  }
}
export  default App;

