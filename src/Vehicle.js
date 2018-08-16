import React, {Component} from 'react';
import {Button} from 'reactstrap';
import uuid from 'uuid';
import Helper from './Helper';

class Vehicle extends Component {

    addVehicle() {
        const vehicleObj = {
            id: uuid.v4(),
            licensePlate: Helper.replaceEmptyValue(this.refs.licensePlate.value),
            make: Helper.replaceEmptyValue(this.refs.make.value),
            model: Helper.replaceEmptyValue(this.refs.model.value),
            type: Helper.replaceEmptyValue(this.refs.type.value),
            city: Helper.replaceEmptyValue(this.refs.vehicleCity.value),
            vehicleState: Helper.replaceEmptyValue(this.refs.vehicleState.value),
            chassisNumber: Helper.replaceEmptyValue(this.refs.chassisNumber.value),
            registrationNumber: Helper.replaceEmptyValue(this.refs.registrationNumber.value),
            manufactureYear: Helper.replaceEmptyValue(this.refs.manufactureYear.value),
            modelYear: Helper.replaceEmptyValue(this.refs.modelYear.value),
            vehicleColor: Helper.replaceEmptyValue(this.refs.vehicleColor.value)
        };

        this.props.addVehicle(vehicleObj);
    }

    deleteVehicle(id) {
        this.props.deleteVehicle(id);
    }

    render() {

        let vehiclesData = [];
        if (this.props.vehicles) {
             vehiclesData = this.props.vehicles.map(p =>
                <tr key={p.id}>
                    <td width="15%">
                        {p.licensePlate}
                    </td>
                    <td width="15%">
                        {p.make}/{p.model}/{p.type}
                    </td>
                    <td width="15%">
                        {p.vehicleColor}/{p.chassisNumber}/{p.registrationNumber}
                    </td>
                    <td width="15%">
                        {p.vehicleState}/{p.city}
                    </td>
                    <td width="15%">
                        {p.manufactureYear}/{p.modelYear}
                    </td>
                    <td width="15%">
                        <Button color="danger" size="sm" outline
                                onClick={this.deleteVehicle.bind(this, p.id)}>-</Button>
                    </td>
                </tr>
            );
        }
        return (
            <div className="bg-change-on-hover">
                <table className="mt-2">
                    <tbody>
                    <tr>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>Placa</label>
                                <input className="form-control" ref="licensePlate"/>
                            </div>
                        </td>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>Marca</label>
                                <input className="form-control" ref="make"/>
                            </div>
                        </td>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>Modelo</label>
                                <input className="form-control" ref="model"/>
                            </div>
                        </td>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>Tipo</label>
                                <input className="form-control" ref="type"/>
                            </div>
                        </td>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>State</label>
                                <input className="form-control" ref="vehicleState"/>
                            </div>
                        </td>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>City</label>
                                <input className="form-control" ref="vehicleCity"/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>Cor</label>
                                <input className="form-control" ref="vehicleColor"/>
                            </div>
                        </td>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>Chassis</label>
                                <input className="form-control" ref="chassisNumber"/>
                            </div>
                        </td>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>Renavam</label>
                                <input className="form-control" ref="registrationNumber"/>
                            </div>
                        </td>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>Ano fabricação</label>
                                <input className="form-control" ref="manufactureYear"/>
                            </div>
                        </td>
                        <td width="15%">
                            <div className="input-group-sm ml-1">
                                <label>Ano Modelo</label>
                                <input className="form-control" ref="modelYear"/>
                            </div>
                        </td>
                        <td width="15%">
                            <div className="ml-1 mt-4 float-right">
                                <Button color="success" size="sm" outline className="mb-1 mt-1"
                                        onClick={this.addVehicle.bind(this)}>+</Button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="mt-3 mb-2" style={{
                    display: this.props.vehicles && this.props.vehicles.length > 0 ? '' : 'none',
                    maxHeight: 200,
                    overflowX: 'auto'
                }}>
                    <table className="table table-hover table-bordered">
                        <tbody>
                        <tr className="card-header-tabs bg-secondary">
                            <th>Placa</th>
                            <th>Marca/Modelo/Tipo</th>
                            <th>Cor/Chassis/Renavam</th>
                            <th>UF/Cidade</th>
                            <th>Ano fabricação/Ano Modelo</th>
                            <th>&nbsp;</th>
                        </tr>
                        {vehiclesData}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

export default Vehicle;