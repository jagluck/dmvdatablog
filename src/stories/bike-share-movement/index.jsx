import React from 'react';
import leaflet from './js/leaflet';
import leafletsrc from './js/leaflet-src';
import leafletcss from './css/leaflet.css';
import canvasFlowmapLayer from './canvasFlowmapLayer'
import Papa from './js/papaparse';
import $ from 'jquery';


export default class Movement extends React.Component{
  constructor(props) {
      super(props);
  }

  componentDidMount(){
    var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>';
    let mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
    let accessToken = 'pk.eyJ1IjoiamFnbHVjayIsImEiOiJjamFqeHNrdnQyZjFrMzNsZDBrcHM2dzd3In0.84EdvBJ5XlBpintC80Jlow';

    var streets = window.L.tileLayer(mbUrl, {
    attribution: mbAttr,
    id: 'mapbox/streets-v11',
    accessToken: accessToken  
    });

    var textByLine = fs.readFileSync('./bikeShareMovement.csv').toString().split("\n");
    console.log(textByLine);
    Papa.parse('./bikeShareMovement.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function(results) {
        console.log(results);
      var geoJsonFeatureCollection = {
        type: 'FeatureCollection',
        features: results.data.map(function(datum) {
          console.log(datum);
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

    var oneToManyFlowmapLayer = window.L.canvasFlowmapLayer(geoJsonFeatureCollection, {
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
      // canvasBezierStyle: {
      //   type: 'classBreaks',
      //   field: 'total_ride',
      //   classBreakInfos: [{
      //     classMinValue: 0,
      //     classMaxValue: 19,
      //     symbol: {
      //       strokeStyle: 'transparent',
      //       lineWidth: 0,
      //       lineCap: 'round',
      //       shadowColor: 'transparent',
      //       shadowBlur: 0
      //     }
      //   },
      //   {
      //     classMinValue: 20,
      //     classMaxValue: 49,
      //     symbol: {
      //       strokeStyle: 'green',
      //       lineWidth: 1,
      //       lineCap: 'round',
      //       shadowColor: 'green',
      //       shadowBlur: 0
      //     }
      //   },
      //   {
      //     classMinValue: 50,
      //     classMaxValue: 99,
      //     symbol: {
      //       strokeStyle: 'blue',
      //       lineWidth: 5,
      //       lineCap: 'round',
      //       shadowColor: 'blue',
      //       shadowBlur: 0
      //     }
      //   }, {
      //     classMinValue: 100,
      //     classMaxValue: 10000000,
      //     symbol: {
      //       strokeStyle: 'red',
      //       lineWidth: 10,
      //       lineCap: 'round',
      //       shadowColor: 'red',
      //       shadowBlur: 0
      //     }
      //   }],
      //   // the layer will use the defaultSymbol if a data value doesn't fit
      //   // in any of the defined classBreaks
      //   defaultSymbol: {
      //     strokeStyle: '#e7e1ef',
      //     lineWidth: 0.5,
      //     lineCap: 'round',
      //     shadowColor: '#e7e1ef',
      //     shadowBlur: 1.5
      //   },
      // },
      // pathDisplayMode: 'selection',
      // animationStarted: false
    })

    var baseMaps = {
    };

    // var overlayMaps = {
    //   "Bike Share Stations": oneToManyFlowmapLayer
    // };

    var mymap = L.map('mapid', {
      // center: [38.9075, -77.033],
      zoom: 13,
      layers: [streets]
    });

    // var mymap = L.map('mapid', {
    //   center: [38.9075, -77.033],
    //   zoom: 13,
    //   layers: [streets]
    // });

    // L.control.layers(baseMaps, overlayMaps).addTo(mymap);
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

    // immediately select an origin point for Bezier path display,
    // instead of waiting for the first user click event to fire
    // oneToManyFlowmapLayer.selectFeaturesForPathDisplayById('start_station_id', 31248 , true, 'SELECTION_NEW');
    }
    })
  }

  render() {
      var spanStyle = {
        height: "8px",
        fontSize: "8pt",
        backgroundColor: "#2eb3f7",
        color: "#2eb3f7",
      };
      var containerStyle = {
        minWidth: '300px',
        maxWidth: '700px',
        display: 'flex', 
        flexDirection: 'column', 
        margin: '0 auto'
      }
       return (
        
      <div>
          <div id="container" style={containerStyle}>
            <h1>Movement between bike share locations.</h1>
            <span style={spanStyle}></span><h3>BY JAKE GLUCK<a href="https://wamu.org/" target="_blank" style={{textDecoration:'none'}}> | WAMU </a></h3>
            <h5>
              Add description of graphic here.
            </h5>

            <div id="mapid">
            </div>
        
          </div>
      </div>     
      );
  }
}