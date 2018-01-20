import React, { Component } from 'react';
import './App.css';
import {Button, Badge} from 'reactstrap';
import Dropzone from 'react-dropzone';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class UploadFile extends Component {

    constructor(props) {
        super(props);
        this.state = { files: [] }

    }

    uploadFiles(files) {
        console.log(files);
        this.setState({
            files: files
        });
    }

    render() {
        const data = [
            {
               id: '1',
               fileName: '11986.pdf',
                uploader: 'Dhiraj Prakash',
                uploadDt: ''
            },
            {
                id: '2',
                fileName: '11778.pdf',
                uploader: 'Pratik Ranjan',
                uploadDt: '15/JAN/2018'
            }
        ];

        const columns = [
            {
                Header: 'Sr. No.',
                accessor: 'id'
            },
            {
                Header: 'File Name',
                accessor: 'fileName'
            },
            {
                Header: 'Uploaded By',
                accessor: 'uploader',
            },
            {
                Header: 'Uploaded On',
                accessor: 'uploadDt'
            }
            ];
        return (
            <div align="center" className="mt-5">
                <div className="bg-dark text-light">
                    <ReactTable
                        data={data}
                        columns={columns}
                        defaultPageSize={5}
                        className="-striped -highlight"
                    />

                </div>
                <br/>
                <div>
                    <div className="row">
                        <div className="col-4 float-left">
                            <Dropzone
                                accept="application/pdf" onDrop={this.uploadFiles.bind(this)}>
                                <div>
                                    <Button className="btn-sm mt-lg-5" outline color="primary">Click or Drag A File Here...</Button>
                                </div>
                            </Dropzone>
                        </div>
                        <div className="col-5">
                            <ul>
                                {
                                    this.state.files.map(f => <Badge key={f.name} className="badge-dark btn-block">{f.name}</Badge>)
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UploadFile;
