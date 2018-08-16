import React, {Component} from 'react';
import {Button} from 'reactstrap';
import uuid from 'uuid';
import Helper from './Helper';

class OtherDetailView extends Component {
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
                </tr>
            );
        }
        return (
            <div className="bg-change-on-hover">
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
                        </tr>
                        {otherDetailsData}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

export default OtherDetailView;