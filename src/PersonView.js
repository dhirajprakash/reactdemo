import React, {Component} from 'react';
import {Button} from 'reactstrap';
import uuid from 'uuid';
import Helper from "./Helper";

class PersonView extends Component {

render() {
    let personsData = [];
    if (this.props.persons) {
        personsData = this.props.persons.map(p =>
            <tr key={p.id}>
                <td>
                    {p.name}
                </td>
                <td>
                    {p.age}
                </td>
                <td>
                    {p.gender}
                </td>
                <td>
                    {p.address}
                </td>
                <td>
                    {p.moreInfo}
                </td>
            </tr>
        );
    }
    return (
        <div className="bg-change-on-hover">
            <div className="mt-3 mb-2" style={{display: this.props.persons && this.props.persons.length > 0 ? '' : 'none', maxHeight: 200, overflowX: 'auto'}}>
            <table className="table table-hover table-bordered">
                <tbody>
                <tr className="card-header-tabs bg-secondary">
                    <th>Nome</th>
                    <th>Era</th>
                    <th>Sexo</th>
                    <th>Endereço</th>
                    <th>Notas</th>
                </tr>
                {personsData}
                </tbody>
            </table>
            </div>
        </div>
    );
}

}

export default PersonView;