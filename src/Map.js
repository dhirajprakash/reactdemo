import React, { Component } from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';
import FaMapMarker from 'react-icons/lib/fa/map-marker';

const MapComponent = ({ text }) => (
    <div>
        {/* {text} */}
    <FaMapMarker style={{color: '#FF5733'}} size={20}/>
    </div>
);

class Map extends Component {

    constructor(props) {
        super(props);
    }
    render() {
const mapComp = this.props.mapData.map(mp=>{
   return (
       <MapComponent key={mp.id}
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
                    defaultZoom={13}
                >
                    {mapComp}
                   
                    
                </GoogleMapReact>
                
            </div>
            );
    }
}

export default Map;
