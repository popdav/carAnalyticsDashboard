import React, { Component } from 'react'
import { Map, TileLayer, Marker } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

import axios from 'axios'
import "./App.css";
import {connect} from "react-redux";
import MarkerClusterGroup from "./MarkerClusterGroup";
require("leaflet.markercluster");
require('react-leaflet-markercluster/dist/styles.min.css');
const provider = new OpenStreetMapProvider();

class Mapa extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            places: []
        };
    }
     componentDidMount() {

        if(this.props.data.length === 0) return;
        this.searchForLatLng();

    }

    async searchForLatLng() {
        let array_of_places = await axios.post('/places', this.state.data.searchBody);
        array_of_places = array_of_places.data.map(e => e['mesto'] + "+srbija");

        array_of_places = await Promise.all(array_of_places.map(e => {
            return provider.search({query: e})
        }));
        console.log(array_of_places)
        /*
        array_of_places = array_of_places.map(e => e[0]);
        this.setState({
            places: array_of_places
        });*/
    }

    showMap() {
        const position = [44.5, 19.5];
        const  zoom = 6;
        return (
            <div>
                <label className=" justify-content-center">Mapa za {this.state.data.name}</label>
                <Map center={position} zoom={zoom} maxZoom={18}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        crossOrigin={null}
                    />react
                    <MarkerClusterGroup>
                        {this.state.places.map((e, i) => {

                            if(e === undefined) return {};
                            return(

                                <Marker key={i} position={[e.y, e.x]}>

                                </Marker>

                            )
                        })}
                    </MarkerClusterGroup>
                </Map>
            </div>
        );

    }

    render() {
        const position = [44.5, 19.5];
        const  zoom = 6;
        return (
            <div >
                <label>Mapa za {this.state.data.name}</label>
                <Map center={position} zoom={zoom} maxZoom={18}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />react
                    <MarkerClusterGroup>
                        {this.state.places.map((e, i) => {

                            if(e === undefined) return {};
                            return(

                                <Marker key={i} position={[e.y, e.x]}>

                                </Marker>

                            )
                        })}
                    </MarkerClusterGroup>
                </Map>
                <br/>
            </div>
        )
    }
}


export default Mapa
