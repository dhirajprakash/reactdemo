import React, {Component} from 'react';
import './App.css';
import { RingLoader } from 'react-spinners';

class ReactTableLoader extends Component {

    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {

        return (
            <div className='sweet-loading' style={{marginTop: '-100'}}><RingLoader color={'yellow'} size={60}/></div>
        );
    }
}

export default ReactTableLoader;
