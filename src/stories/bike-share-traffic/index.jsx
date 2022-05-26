import React from 'react';
import $ from 'jquery';
import Papa from "papaparse";
import 'datatables.net'
import 'datatables.net-dt'

import leaflet from '../../javascript/libraries/leaflet';
import leafletsrc from '../../javascript/libraries/leaflet-src';
import leafletcss from '../../css/libraries/leaflet.css';
import canvasFlowmapLayer from '../../javascript/libraries/canvasFlowmapLayer'
import d3 from '../../javascript/libraries/d3.min';
import kml from '../../javascript/libraries/KML';

import bikeShareTraffic from '../../resources/data/bikeShareStationTotals.csv';

export default class Traffic extends React.Component{
  constructor(props) {
      super(props);
  }

  async getData() {
    const res = await fetch(bikeShareTraffic);
    const data = await res.text();
    const results = Papa.parse(data, { header: true, skipEmptyLines: true });

    let mymap = L.map('mapid').setView([38.9075, -77.033], 13);

    let mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>';
    let mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
    let accessToken = 'pk.eyJ1IjoiamFnbHVjayIsImEiOiJjamFqeHNrdnQyZjFrMzNsZDBrcHM2dzd3In0.84EdvBJ5XlBpintC80Jlow';
    let streets  = L.tileLayer(mbUrl, {
      attribution: mbAttr,
      id: 'mapbox/streets-v11',
      accessToken: accessToken  
    }).addTo(mymap);

    function numberWithCommas(x) {
      return Math.floor(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var planes = [];
    var yellowIcon = new L.Icon({
      iconUrl: 'css/images/marker-icon-yellow.png',
      iconSize: [9, 13.5],
      iconAnchor: [4.5, 13.5],
      popupAnchor: [0, -13.5]
    });

    var redIcon = new L.Icon({
      iconUrl: 'css/images/marker-icon-red.png',
      iconSize: [9, 13.5],
      iconAnchor: [4.5, 13.5],
      popupAnchor: [0, -13.5]
    });

    let arrsize = Object.keys(results.data).length;
    var arrivals = [];
    var departures = [];

    for (var i = 0; i < arrsize - 1; i++) {
        let lat = Number(results.data[i].station_lat);
        let long = Number(results.data[i].station_long);
        let totalArrivals = numberWithCommas(results.data[i].total_in);
        let totalDepartures = numberWithCommas(results.data[i].total_out);

        let marker = new L.circleMarker([lat,long],{radius:Math.ceil(results.data[i].total_in/2000)}).bindPopup("<p>" + results.data[i].station + "</p><p>Total Arivals: " + totalArrivals + "<br>Total Departures: " + totalDepartures + "</p>");
        arrivals.push(marker);
        marker = new L.circleMarker([lat,long],{radius:Math.ceil(results.data[i].total_out/2000)}).bindPopup("<p>" + results.data[i].station + "</p><p>Total Arivals: " + totalArrivals + "<br>Total Departures: " + totalDepartures + "</p>");
        departures.push(marker);
    }

    var arrivalPoints = L.layerGroup(arrivals);
    var departurePoints = L.layerGroup(departures);

    var baseMaps = {
    };

    var overlayMaps = {
      "Bike Share Arrivals": arrivalPoints,  
      "Bike Share Departures": departurePoints,      
    };

    L.control.layers(baseMaps, overlayMaps).addTo(mymap);
    arrivalPoints.addTo(mymap);

    $('#dataTable').DataTable( {
      paginate: true,
      scrollY: 300,
      "bDestroy": true,
      data: results['data'],
      columns: [
        { title: 'Start Location', data: 'station' },
        { title: 'Total In', data: 'total_in' },
        { title: 'Total Out', data: 'total_out' },
        { title: 'Total Bike Docks', data: 'station_bikes' },
      ],
      order: [[2, 'desc']],
    });

    $('#dataTable').on('click', 'tbody td', function() {
      //get textContent of the TD
      console.log('TD cell textContent : ', this.textContent)
      //get the value of the TD using the API 
      console.log('value by API : ', table.cell({ row: this.parentNode.rowIndex, column : this.cellIndex }).data());
    })  
    mymap.dragging.enable();
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
          <div style={{height:"800px"}} id="mapid">
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