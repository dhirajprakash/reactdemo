import React, { Component } from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';

const MapComponent = ({ text }) => (
    <div style={{
        position: 'relative', color: 'white', background: 'purple',
        height: 18, width: 70
    }}>
        {text}
    </div>
);

class Map extends Component {

    constructor(props) {
        super(props);
        console.log(props.mapData);
    }
    render() {
const mapComp = this.props.mapData.map(mp=>{
   return (
       <MapComponent key={mp.lat}
           lat={mp.lat}
           lng={mp.lng}
           text={mp.name}
       />
   );
});
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyCvKqs285DpxtdI8spf2Vi64gFhSE7N4lw' }}
                    defaultCenter={{lat: this.props.mapData[0].lat, lng:this.props.mapData[0].lng }}
                    defaultZoom={7}
                >
                    {mapComp}
                </GoogleMapReact>
            </div>
            );
    }
}

export default Map;
