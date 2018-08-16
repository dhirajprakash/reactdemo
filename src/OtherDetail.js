import React, {Component} from 'react';
import {Button} from 'reactstrap';
import uuid from 'uuid';
import Helper from './Helper';

class OtherDetail extends Component {

    addOtherDetail() {
        const otherDetailObj = {
            id: uuid.v4(),
            otherDetailType: Helper.replaceEmptyValue(this.refs.otherDetailType.value),
            otherDetailValue: Helper.replaceEmptyValue(this.refs.otherDetailValue.value)
        };

        this.props.addOtherDetail(otherDetailObj);
    }

    deleteOtherDetail(id) {
        this.props.deleteOtherDetail(id);
    }

    render() {

        let otherDetailsData = [];
        if(this.props.otherDetails) {
            otherDetailsData = this.props.otherDetails.map(p =>
                <tr key={p.id}>
                    <td>
                        {p.otherDetailType}
                    </td>
                    <td>
                        {p.otherDetailValue}
                    </td>
                    <td>
                        <Button color="danger" size="sm" outline
                                onClick={this.deleteOtherDetail.bind(this, p.id)}>-</Button>
                    </td>
                </tr>
            );
        }
        return (
            <div className="bg-change-on-hover">
                <table className="mt-2">
                    <tbody>
                    <tr>
                        <td width="20%">
                            <div className="input-group-sm ml-1">
                                <label>Sobre</label>
                                <select className="form-control" ref="otherDetailType">
                                    <option value="Category">Category</option>
                                    <option value="Region">Region</option>
                                </select>
                            </div>
                        </td>
                        <td>
                            <div className="input-group-sm ml-1">
                                <label>Informação</label>
                                <input className="form-control" ref="otherDetailValue" />
                            </div>
                        </td>
                        <td className="align-bottom">
                            <div className="ml-1 float-right">
                                <Button color="success" size="sm" outline className="mb-1 mt-1"
                                        onClick={this.addOtherDetail.bind(this)}>+</Button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="mt-3 mb-2" style={{
                    display: this.props.otherDetails && this.props.otherDetails.length > 0 ? '' : 'none',
                    maxHeight: 200,
                    overflowX: 'auto'
                }}>
                    <table className="table table-hover table-bordered">
                        <tbody>
                        <tr className="card-header-tabs bg-secondary">
                            <th>Sobre</th>
                            <th>Informação</th>
                            <th>&nbsp;</th>
                        </tr>
                        {otherDetailsData}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

export default OtherDetail;