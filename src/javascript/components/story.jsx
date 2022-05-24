import React from 'react';
import PropTypes from 'prop-types';
import '../../css/story.css';
import Papa from "papaparse";
import movement from '../../stories/bike-share-movement/bikeShareMovement.csv';

import bikeMovement from '../../stories/bike-share-movement/index.jsx';

export default class Story extends React.Component{
    constructor(props) {
        super(props);
    }


    async getData()  {
        const res = await fetch(movement);
        const data = await res.text();
        const results = Papa.parse(data, {  header: true });

        let  mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>';
        let mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
        let accessToken = 'pk.eyJ1IjoiamFnbHVjayIsImEiOiJjamFqeHNrdnQyZjFrMzNsZDBrcHM2dzd3In0.84EdvBJ5XlBpintC80Jlow';

        var streets  = L.tileLayer(mbUrl, {
            attribution: mbAttr,
            id: 'mapbox/streets-v11',
            accessToken: accessToken  
        });

        var container = L.DomUtil.get('mapid'); 
        if(container != null){ container._leaflet_id = null; }
        var mymap = L.map('mapid', {
            center: [38.9075, -77.033],
            zoom: 13,
            layers: [streets]
        });


        const geoJsonFeatureCollection = {
            type: 'FeatureCollection',
            features: results.data.map(function(datum) {
              return {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [datum.start_station_long, datum.start_station_lat]
                },
                properties: datum
              }
            })
          };

          console.log(geoJsonFeatureCollection);

          var oneToManyFlowmapLayer = L.canvasFlowmapLayer(geoJsonFeatureCollection, {
            originAndDestinationFieldIds: {
             originGeometry: {
                x: 'start_station_long',
                y: 'start_station_lat'
              },
              destinationUniqueIdField: 'end_station_name',
              destinationGeometry: {
                x: 'end_station_long',
                y: 'end_station_lat'
              }
            },
            canvasBezierStyle: {
              type: 'classBreaks',
              field: 'total_ride',
              classBreakInfos: [{
                classMinValue: 0,
                classMaxValue: 19,
                symbol: {
                  strokeStyle: 'transparent',
                  lineWidth: 0,
                  lineCap: 'round',
                  shadowColor: 'transparent',
                  shadowBlur: 0
                }
              },
               {
                classMinValue: 20,
                classMaxValue: 49,
                symbol: {
                  strokeStyle: 'green',
                  lineWidth: 1,
                  lineCap: 'round',
                  shadowColor: 'green',
                  shadowBlur: 0
                }
              },
              {
                classMinValue: 50,
                classMaxValue: 99,
                symbol: {
                  strokeStyle: 'blue',
                  lineWidth: 5,
                  lineCap: 'round',
                  shadowColor: 'blue',
                  shadowBlur: 0
                }
              }, {
                classMinValue: 100,
                classMaxValue: 10000000,
                symbol: {
                  strokeStyle: 'red',
                  lineWidth: 10,
                  lineCap: 'round',
                  shadowColor: 'red',
                  shadowBlur: 0
                }
              }],
              // the layer will use the defaultSymbol if a data value doesn't fit
              // in any of the defined classBreaks
              defaultSymbol: {
                strokeStyle: '#e7e1ef',
                lineWidth: 0.5,
                lineCap: 'round',
                shadowColor: '#e7e1ef',
                shadowBlur: 1.5
              },
            },
            pathDisplayMode: 'selection',
            animationStarted: false
          })

          oneToManyFlowmapLayer.addTo(mymap);

           // since this demo is using the optional "pathDisplayMode" as "selection",
            // it is up to the developer to wire up a click or mouseover listener
            // and then call the "selectFeaturesForPathDisplay()" method to inform the layer
            // which Bezier paths need to be drawn
            oneToManyFlowmapLayer.on('click', function(e) {
                console.log(e);
                if (e.sharedOriginFeatures.length) {
                oneToManyFlowmapLayer.selectFeaturesForPathDisplay(e.sharedOriginFeatures, 'SELECTION_NEW');
                }
                if (e.sharedDestinationFeatures.length) {
                oneToManyFlowmapLayer.selectFeaturesForPathDisplay(e.sharedDestinationFeatures, 'SELECTION_NEW');
                }
            });
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        const position = [51.505, -0.09]
         return (
            <div className="story">
                <div className="story__inner">
                    <div style={{height:"800px"}} id="mapid">
                    </div>
                </div>
            </div>
        );
    }
}

Story.defaultProps = {
    title: '',
    body: ''
};

Story.propTypes = {
    title: PropTypes.string,
    body: PropTypes.string,
    changeButtonState: PropTypes.func,
};
