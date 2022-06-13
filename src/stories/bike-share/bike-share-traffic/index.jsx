/* eslint-disable no-undef */

import React from 'react';
import $ from 'jquery';
import Papa from "papaparse";
import 'datatables.net'
import 'datatables.net-dt'

import leaflet from '../../../javascript/libraries/leaflet';
import leafletsrc from '../../../javascript/libraries/leaflet-src';
import leafletcss from '../../../css/libraries/leaflet.css';
import canvasFlowmapLayer from '../../../javascript/libraries/canvasFlowmapLayer'
import d3 from '../../../javascript/libraries/d3.min';
import kml from '../../../javascript/libraries/KML';

import bikeShareTraffic from '../../../resources/data/bikeShareStationTotals.csv';

export default class Traffic extends React.Component{
  constructor(props) {
      super(props);
  }

  // #762a83
  // #9970ab
  // #c2a5cf
  // #e7d4e8
  // #f7f7f7
  // #d9f0d3
  // #a6dba0
  // #5aae61
  // #1b7837
  getColor(d) {
    if (d) {
      return d > 1.35 ? '#762a83' :
      d > 1.25  ? '#9970ab' :
      d > 1.15  ? '#c2a5cf' :
      d > 1.05  ? '#e7d4e8' :
      d > .95  ? '#f7f7f7' :
      d > .85   ? '#d9f0d3' :
      d > .70   ? '#a6dba0' :
      d > .60   ? '#5aae61' :
                 '#1b7837';
    } 
      return '#f7f7f7';
 
  }

  getSize(d) {
    if (d) {
      let size = d/2000;
      if (d < 5000) {
        return 5;
      }
      return size;
    }
    return 0;
  }

  async getData() {
    const res = await fetch(bikeShareTraffic);
    const data = await res.text();
    const results = Papa.parse(data, { header: true, skipEmptyLines: true });

    let trafficmap = null;
    if (trafficmap !== undefined && trafficmap !== null) { trafficmap.remove(); }
    trafficmap = L.map( 'trafficmap', { //alterated
        center: [38.9075, -77.033],
        minZoom: 2,
        zoom: 13
      });
    
    let mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>';
    let mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
    let accessToken = 'pk.eyJ1IjoiamFnbHVjayIsImEiOiJjamFqeHNrdnQyZjFrMzNsZDBrcHM2dzd3In0.84EdvBJ5XlBpintC80Jlow';
    L.tileLayer(mbUrl, {
        attribution: mbAttr,
        id: 'mapbox/streets-v11',
        accessToken: accessToken  
    }).addTo(trafficmap);
    trafficmap.dragging.enable();

    function numberWithCommas(x) {
      return Math.floor(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    let arrsize = Object.keys(results.data).length;
    var bikeShares = [];

    for (var i = 0; i < arrsize - 1; i++) {
        let lat = Number(results.data[i].station_lat);
        let long = Number(results.data[i].station_long);
        let totalArrivals = numberWithCommas(results.data[i].total_in);
        let totalDepartures = numberWithCommas(results.data[i].total_out);
      
        let totalTrips = (parseInt(results.data[i].total_in) + parseInt(results.data[i].total_out));
        let differece = results.data[i].differences
        let color = this.getColor(differece);
        let size = this.getSize(totalTrips);
        if (size > 0) {
          let marker = new L.circleMarker([lat,long],{radius:Math.ceil(size)}).bindPopup("<p>" + results.data[i].station + "</p><p>Total Arrivals + Departures: " + numberWithCommas(totalTrips) + "<br>Total Arivals: " + totalArrivals + "<br>Total Departures: " + totalDepartures + "<br>Arrivals/Departues: " + results.data[i].differences + "</p>");
          marker.setStyle({color: 'black'});
          marker.setStyle({fillColor: color});
          marker.setStyle({fillOpacity: 1.0});
          bikeShares.push(marker);
        }
    }

    let bikeSharePoints = null;
    if (bikeSharePoints !== undefined && bikeSharePoints !== null) { bikeSharePoints.remove(); }
    bikeSharePoints = L.layerGroup(bikeShares);
    trafficmap.addLayer(bikeSharePoints);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        labels = [];
        labels.push(
            '<span class="legend__title"> Arrivals/Departues </span>');
        labels.push(
            '<div class="legend__container"><div class="legend__color" style="background:#762a83;"> </div> <span class="legend__text"> &nbsp > 1.35 &nbsp </span></div>');
        labels.push(
            '<div class="legend__container"><div class="legend__color" style="background:#9970ab;"> </div> <span class="legend__text"> &nbsp > 1.25 &nbsp </span></div>');
        labels.push(
                '<div class="legend__container"><div class="legend__color" style="background:#c2a5cf;"> </div> <span class="legend__text"> &nbsp > 1.15 &nbsp </span></div>');
        labels.push(
          '<div class="legend__container"><div class="legend__color" style="background:#e7d4e8;"> </div> <span class="legend__text"> &nbsp > 1.05 &nbsp </span></div>');
        labels.push(
          '<div class="legend__container"><div class="legend__color" style="background:#f7f7f7;"> </div> <span class="legend__text"> &nbsp > .95 &nbsp </span></div>');
        labels.push(
          '<div class="legend__container"><div class="legend__color" style="background:#d9f0d3;"> </div> <span class="legend__text"> &nbsp > .85 &nbsp </span></div>');
        labels.push(
          '<div class="legend__container"><div class="legend__color" style="background:#a6dba0;"> </div> <span class="legend__text"> &nbsp > .75 &nbsp </span></div>');
        labels.push(
          '<div class="legend__container"><div class="legend__color" style="background:#a6dba0;"> </div> <span class="legend__text"> &nbsp > .65 &nbsp </span></div>');
        labels.push(
          '<div class="legend__container"><div class="legend__color" style="background:#5aae61;"> </div> <span class="legend__text"> &nbsp < .65 &nbsp </span></div>');
        div.innerHTML = labels.join('');
        return div;
    };

    legend.addTo(trafficmap);
    $('#dataTable').DataTable( {
      paginate: true,
      scrollY: 300,
      "bDestroy": true,
      data: results['data'],
      columns: [
        { title: 'Start Location', data: 'station' },
        { title: 'Total In', data: 'total_in' },
        { title: 'Total Out', data: 'total_out' },
        { title: 'Arrivals/Departures', data: 'differences' },
        { title: 'Total Bike Docks', data: 'station_bikes' },
      ],
      order: [[2, 'desc']],
    });

    $('#dataTable').on('click', 'tbody td', function() {
      //get textContent of the TD
      console.log('TD cell textContent : ', this.textContent)
      // trafficmap.eachLayer(function(layer2){
      
      //     console.log(layer2);
      //     // if (layer2.feature.properties.ZIPCODE1 == this_zip){
      //     //   layer2.openPopup()
      //     // }
        
        
      // });
      //get the value of the TD using the API 
      // console.log('value by API : ', table.cell({ row: this.parentNode.rowIndex, column : this.cellIndex }).data());
      // trafficmap.eachLayer(function(layer2){
      //  console.log(layer2);
      // });
      // for (let property in trafficmap["_targets"]) {
      //   if (trafficmap["_targets"][property]["_popup"]["_content"].includes(this.textContent)) {
      //     console.log(trafficmap["_targets"][property]);
      //     let ourClick = trafficmap["_targets"][property]["_events"]["click"][0]["fn"];
      //     ourClick(trafficmap["_targets"][property]);
      //   }
      // }
    })  
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
          <div style={{height:"800px"}} id="trafficmap">
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