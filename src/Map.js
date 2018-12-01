import React, { Component } from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';
import FaMapMarker from 'react-icons/lib/fa/map-marker';

const MapComponent = ({ iconColor }) => (
    <div>
        {/* {iconColor} */}
    <FaMapMarker style={{color: iconColor}} size={20}/>
    </div>
);

class Map extends Component {

    constructor(props) {
        super(props);
    }
    render() {
const mapComp = this.props.mapData.map(mp=>{
    let iconColor = '#FF5733';
    if(mp.Rubrica != null){
        if(mp.Rubrica.includes('urto')){
            iconColor='#36A2EB';
        }else if(mp.Rubrica.includes('oubo')){
            iconColor='#FF6384';
         }else{
            iconColor='#FFCE56';
         }
        }else{
            iconColor='#FF5733';
        }
   return (
    
       <MapComponent key={mp.id}
           lat={mp.lat}
           lng={mp.lng}
           bo={mp.name}
           iconColor={iconColor}
           

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
