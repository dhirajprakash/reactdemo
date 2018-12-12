import React, {Component} from 'react';
import FaMapMarker from 'react-icons/lib/fa/map-marker';
import FaCab from 'react-icons/lib/fa/cab';
import {Popover, PopoverBody} from 'reactstrap';

class MapComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            infoPopperOpen: false,
            carInfoPopperOpen: false
        }

        this.toggleInfoPopper = this.toggleInfoPopper.bind(this);
        this.toggleCarInfoPopper = this.toggleCarInfoPopper.bind(this);
    }

    toggleInfoPopper() {
        this.setState({infoPopperOpen: !this.state.infoPopperOpen});
    }
    toggleCarInfoPopper() {
        this.setState({carInfoPopperOpen: !this.state.carInfoPopperOpen});
    }

    render() {


        return (
            <div>
                <div style={{display: this.props.vehiclePresent ? '' : 'none'}}>
                    <FaCab onClick={this.toggleCarInfoPopper} id="id_CarMarker" style={{color: this.props.iconColor, display: this.props.vehiclePresent ? '' : 'none'}} size={20}/>
                    <Popover isOpen={this.state.carInfoPopperOpen} className="bg-dark text-white" placement="top" toggle={this.toggleCarInfoPopper} target="id_CarMarker">
                        <PopoverBody className="text-white">
                            <div>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>
                                            Boletim No.
                                        </td>
                                        <td className="text-warning">
                                            {this.props.reportId}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Ocorrência
                                        </td>
                                        <td className="text-warning">
                                            {this.props.occurencia}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </PopoverBody>
                    </Popover>
                </div>
                <div style={{display: this.props.vehiclePresent ? 'none' : ''}}>
                    <FaMapMarker onClick={this.toggleInfoPopper} id="id_MapMarker" style={{color: this.props.iconColor, display: this.props.vehiclePresent ? 'none' : ''}} size={20}/>
                    <Popover isOpen={this.state.infoPopperOpen} className="bg-dark" placement="top" toggle={this.toggleInfoPopper} target="id_MapMarker">
                        <PopoverBody className="text-white">
                            <div>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                Boletim No.
                                            </td>
                                            <td className="text-warning">
                                                {this.props.reportId}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Ocorrência
                                            </td>
                                            <td className="text-warning">
                                                {this.props.occurencia}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </PopoverBody>
                    </Popover>
                </div>
            </div>
        );
    }

}

export default MapComponent;