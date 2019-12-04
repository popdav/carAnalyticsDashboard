import React, { Component } from 'react';

import './bootstrap.min.css'


class Map extends Component {
    constructor(props) {
        super(props);

        this.platform = null;
        this.map = null;

        this.state = {
            app_id: props.app_id,
            app_code: props.app_code,
            center: {
                lat: props.lat,
                lng: props.lng,
            },
            zoom: props.zoom,
            theme: props.theme,
            show: props.show
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if(this.props.show && !prevProps.show) {
            console.log(this.props.places[2].places);
            let layer = this.platform.createDefaultLayers();
            let container = document.getElementById('here-map');

            this.map = new window.H.Map(container, layer.normal.map, {
                center: this.state.center,
                zoom: this.state.zoom,
            });


            let events = new window.H.mapevents.MapEvents(this.map);
            //
            let behavior = new window.H.mapevents.Behavior(events);
            //
            let ui = new window.H.ui.UI.createDefault(this.map, layer)

            let Map = this.map;
            let dataPoints = [];
            let onResult = function(result) {
                if(result.Response.View[0] === undefined){
                    console.log(result);
                    return false;
                }

                let locations = result.Response.View[0].Result,
                    position,
                    marker;

                for (let i = 0;  i < 1; i++) {
                    position = {
                        lat: locations[i].Location.DisplayPosition.Latitude,
                        lng: locations[i].Location.DisplayPosition.Longitude
                    };
                    marker = new window.H.map.Marker(position);
                    Map.addObject(marker);
                    dataPoints.push(new window.H.clustering.DataPoint(locations[i].Location.DisplayPosition.Latitude, locations[i].Location.DisplayPosition.Longitude));
                }
            };

            let geocoder = this.platform.getGeocodingService();



            for(let x = 0; x < this.props.places[2].places.length; x++) {
                let geocodingParams = {
                    searchText: this.props.places[2].places[x].place + ', Srbija'
                };
                // console.log(geocodingParams)
                geocoder.geocode(geocodingParams, onResult, function(e) {
                    alert(e);
                });
            }
            console.log(dataPoints);
            let clusteredDataProvider = new window.H.clustering.Provider(dataPoints, {
                min: 4,
                max: 10,
                clusteringOptions: {
                    eps: 32,
                    minWeight: 3
                }
            });
            let layerClusters = new window.H.map.layer.ObjectLayer(clusteredDataProvider);
            this.map.addLayer(layerClusters);


        }

    }

    componentDidMount() {
        this.platform = new window.H.service.Platform(this.state);

    }

    render() {

        return (
            <div id="here-map" style={{width: '80%', height: '500px'}} />
        );
    }
}

export default Map;