import React, { Component } from 'react'
import { Map, TileLayer, Marker, withLeaflet } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';
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
            data: [],
            show: false,
            places: []
        };
    }
    async UNSAFE_componentWillReceiveProps(nextProps){
        console.log(nextProps.data);
        if(nextProps.data.length === 0) return;
        let array_of_places = await axios.post('/places', nextProps.data[0].searchBody);
        array_of_places = array_of_places.data.map(e => e['mesto']);
        console.log(array_of_places);
        array_of_places = await Promise.all(array_of_places.map(e => {
            return provider.search({query: e})
        }));

        console.log(array_of_places);
        array_of_places = array_of_places.map(e => e[0]);
        this.setState({
            data: [...nextProps.data[0].data],
            stylePlot: nextProps.data[0].style,
            x: nextProps.data[0].x,
            y: nextProps.data[0].y,
            show: true,
            name: nextProps.data[0].name,
            places: array_of_places
        });

    }

    render() {
        const position = [44.5, 19.5];
        const  zoom = 6;
        let styleT = {display: "block"};
        if(!this.state.show)
            styleT = {display: "none"};
        return (
            <div>

                <Map center={position} zoom={zoom} maxZoom={18}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MarkerClusterGroup>
                    {this.state.places.map((e, i) => {
                        console.log(e);
                        if(e === undefined) return ;
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

const mapStateToProps = state => {
    return { data: state.data }
};

export default connect(mapStateToProps, {})(Mapa);

