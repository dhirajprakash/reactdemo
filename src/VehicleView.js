import React, {Component} from 'react';
import {Button} from 'reactstrap';
import uuid from 'uuid';
import Helper from './Helper';

class VehicleView extends Component {
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
                </tr>
            );
        }
        return (
            <div className="bg-change-on-hover">
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
                        </tr>
                        {vehiclesData}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

export default VehicleView;