import React, {Component} from 'react';
import {Button} from 'reactstrap';
import uuid from 'uuid';
import Helper from "./Helper";

class Person extends Component {

    addPerson() {
        const personObj = {
          id: uuid.v4(),
          name: this.refs.personName.value,
          age: this.refs.personAge.value,
          gender: this.refs.personGender.value,
          address: Helper.replaceEmptyValue(this.refs.personAddress.value),
          moreInfo: Helper.replaceEmptyValue(this.refs.personMoreInfo.value)
        };

        this.props.addPerson(personObj);
    }
    deletePerson(id) {
        this.props.deletePerson(id);
    }

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
                <td>
                    <Button color="danger" size="sm" outline onClick={this.deletePerson.bind(this, p.id)}>-</Button>
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
                            <label>Nome</label>
                            <input className="form-control" ref="personName" />
                        </div>
                    </td>
                    <td width="10%">
                        <div className="input-group-sm ml-1">
                            <label>Era</label>
                            <input type="number" className="form-control" ref="personAge" />
                        </div>
                    </td>
                    <td>
                        <div className="input-group-sm ml-1">
                            <label>Sexo</label>
                            <select className="form-control" ref="personGender">
                            <option value="Masculino">Masculino</option>
                            <option value="Femea">Fêmea</option>
                            </select>
                        </div>
                    </td>
                    <td>
                        <div className="input-group-sm ml-1">
                            <label>Endereço</label>
                            <textarea className="form-control" ref="personAddress" />
                        </div>
                    </td>
                    <td>
                        <div className="input-group-sm ml-1">
                            <label>Notas</label>
                            <textarea className="form-control" ref="personMoreInfo" />
                        </div>
                    </td>
                    <td>
                        <div className="ml-1 mt-4">
                            <Button color="success" size="sm" outline className="mb-1 mt-1" onClick={this.addPerson.bind(this)}>+</Button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <div className="mt-3 mb-2" style={{display: this.props.persons && this.props.persons.length > 0 ? '' : 'none', maxHeight: 200, overflowX: 'auto'}}>
            <table className="table table-hover table-bordered">
                <tbody>
                <tr className="card-header-tabs bg-secondary">
                    <th>Nome</th>
                    <th>Era</th>
                    <th>Sexo</th>
                    <th>Endereço</th>
                    <th>Notas</th>
                    <th>&nbsp;</th>
                </tr>
                {personsData}
                </tbody>
            </table>
            </div>
        </div>
    );
}

}

export default Person;