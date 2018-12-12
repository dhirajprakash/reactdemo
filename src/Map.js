import React, { Component } from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';
import FaMapMarker from 'react-icons/lib/fa/map-marker';

const MapComponent = (props) => (
    <div>
        {/* {iconColor} */}
    <FaMapMarker style={{color: props.iconColor}} onClick={props.clicked} size={20}/>
    </div>
);

class Map extends Component {

    constructor(props) {
        super(props);
    }

      
    mapClickHandler = (name) => {
        console.log(name);
        
    }

    render() {
const mapComp = this.props.mapData.map(mp=>{
    let iconColor = '#FF5733';
    let iconType = 0;
    if(mp.Rubrica != null){
        if(mp.Rubrica.includes('urto')){
            iconColor='#36A2EB';
            iconType=1;
        }else if(mp.Rubrica.includes('oubo')){
            iconColor='#FF6384';
            iconType=2;
         }else{
            iconColor='#FFCE56';
            iconType=3;
         }
        }else{
            iconColor='#FF5733';
            iconType=4;
        }
   return (
    
       <MapComponent key={mp.id}
           lat={mp.lat}
           lng={mp.lng}
           bo={mp.name}
           autoria={mp.Autoria}
           rubrica={mp.Rubrica}
           periodo={mp.OCCURENCIA_TIME}
           dia={mp.OCCURENCIA_DAY}
           tipolocal={mp.TipoDeLocal}
           especie={mp.Especie}
           flagrante={mp.Flagrante}
           clicked={this.mapClickHandler.bind(this,mp.name)}
           iconColor={iconColor}
           iconType={iconType}
           

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
