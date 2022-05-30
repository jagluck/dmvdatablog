/* eslint-disable no-undef */

import React from 'react';
import $ from 'jquery';
import Papa from "papaparse";
import 'datatables.net'
import 'datatables.net-dt'

import leaflet from '../../javascript/libraries/leaflet';
import leafletsrc from '../../javascript/libraries/leaflet-src';
import leafletcss from '../../css/libraries/leaflet.css';
import canvasFlowmapLayer from '../../javascript/libraries/canvasFlowmapLayer'

import bikeShareMovement from '../../resources/data/bikeShareMovement.csv';

export default class Movement extends React.Component{
  constructor(props) {
    super(props);
  }

  async getData() {
    const res = await fetch(bikeShareMovement);
    const data = await res.text();
    const results = Papa.parse(data, {  header: true });

    var container = L.DomUtil.get('movementmap');
    if(container != null){
      container._leaflet_id = null;
    }
    let movementmap = L.map('movementmap').setView([38.9075, -77.033], 13);

    let mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>';
    let mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
    let accessToken = 'pk.eyJ1IjoiamFnbHVjayIsImEiOiJjamFqeHNrdnQyZjFrMzNsZDBrcHM2dzd3In0.84EdvBJ5XlBpintC80Jlow';
    let streets  = L.tileLayer(mbUrl, {
      attribution: mbAttr,
      id: 'mapbox/streets-v11',
      accessToken: accessToken  
    }).addTo(movementmap);

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

    var baseMaps = {
    };

    var overlayMaps = {
      "Bike Share Stations": oneToManyFlowmapLayer
    };

    L.control.layers(baseMaps, overlayMaps).addTo(movementmap);
    oneToManyFlowmapLayer.addTo(movementmap);

    // since this demo is using the optional "pathDisplayMode" as "selection",
    // it is up to the developer to wire up a click or mouseover listener
    // and then call the "selectFeaturesForPathDisplay()" method to inform the layer
    // which Bezier paths need to be drawn
    oneToManyFlowmapLayer.on('click', function(e) {
        if (e.sharedOriginFeatures.length) {
        oneToManyFlowmapLayer.selectFeaturesForPathDisplay(e.sharedOriginFeatures, 'SELECTION_NEW');
        }
        if (e.sharedDestinationFeatures.length) {
        oneToManyFlowmapLayer.selectFeaturesForPathDisplay(e.sharedDestinationFeatures, 'SELECTION_NEW');
        }
    });

    movementmap.on('click', function(e) {
      let found = false;
      for (var key in oneToManyFlowmapLayer['_layers']) {
        if (oneToManyFlowmapLayer['_layers'].hasOwnProperty(key)) {
          if (oneToManyFlowmapLayer['_layers'][key]['_latlng'] === e['latlng']) {
            found = true;
          }
        }
      }

      if (!found) {
        // remove all paths on non point click
        oneToManyFlowmapLayer.clearAllPathSelections();
      }
    });

    $('#dataTable').DataTable( {
      paginate: true,
      scrollY: 300,
      "bDestroy": true,
      data: results['data'],
      columnDefs: [{
        "defaultContent": "-"
      }],
      columns: [
        { title: 'Start Station Location', data: 'start_station_name' },
        { title: 'End Station Location', data: 'end_station_name' },
        { title: 'Total Rides', data: 'total_ride' },
      ],
      order: [[2, 'desc']],
    } );

    $('#dataTable').on('click', 'tbody td', function() {

      //get textContent of the TD
      console.log('TD cell textContent : ', this.textContent)
    
      //get the value of the TD using the API 
      console.log('value by API : ', table.cell({ row: this.parentNode.rowIndex, column : this.cellIndex }).data());
    })  
    movementmap.dragging.enable();
  }

  componentDidMount() {
      this.getData();
  }

  render() {
    var tableDivStyle = {
      marginTop: '25px',
      border: '1px black solid',
      height: '100%',
      padding: '15px',
      marginTop: '25px',
    }
    return (
      <div className="story">
        <div className="story__inner">
          <div style={{height:"800px"}} id="movementmap">
          </div>
          <div style={tableDivStyle}>
            <table id="dataTable" className="stripe">
            </table>
          </div>
        </div>
      </div>
    );
  }
}