import React, {Component} from 'react';
import FaPlusSquareO from 'react-icons/lib/fa/plus-square-o';
import {Button} from 'reactstrap';

class Person extends Component {

constructor(props) {
    super(props);

    this.state = {
        persons: props.persons
    }
}

render() {

    const personsData = this.state.persons.map(p =>
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
    return (
        <div className="bg-change-on-hover">
            <table>
                <tbody>
                <tr>
                    <td>
                        <div className="input-group-sm ml-1">
                            <label>Nome</label>
                            <input className="form-control" ref="personName" />
                        </div>
                    </td>
                    <td width="10%">
                        <div className="input-group-sm ml-1">
                            <label>Era</label>
                            <input type="number" max={200} maxLength={3} className="form-control" ref="personAge" />
                        </div>
                    </td>
                    <td>
                        <div className="input-group-sm ml-1">
                            <label>Sexo</label>
                            <select className="form-control" ref="personSex">
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
                        <div className="ml-1">
                            <Button color="success" size="sm" outline className="mt-5">+</Button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <table className="table table-hover table-bordered" style={{display: this.state.persons && this.state.persons.length > 0 ? '' : 'none'}}>
                <tbody>

                </tbody>
            </table>
        </div>
    );
}

}

export default Person;