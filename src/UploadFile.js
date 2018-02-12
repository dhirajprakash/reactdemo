import React, { Component } from 'react';
import './App.css';
import {Button, Badge} from 'reactstrap';
import Dropzone from 'react-dropzone';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FaCheck from 'react-icons/lib/fa/check';

class UploadFile extends Component {

    constructor(props) {
        super(props);
        this.state = { files: [], uploadInProgress: false }
        this.API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080/' : '';

    }

    uploadFiles(files) {
        let totalSize = 0;
        const formData = new FormData();
        files.map(f => {
                totalSize = totalSize + f.size;
                formData.append('files', f);
            }
        );
        console.log(totalSize);
        console.log(files);
        if (totalSize > 20480000) {
            return false;
        }
        this.setState({files: files, uploadInProgress:true});
        fetch(this.API_URL + 'queries/upload', {
            method: 'POST',
            body: formData
        }).then(
            response => {
                response.json();
                this.setState({uploadInProgress: false});
            }
        ).then(
            success => console.log(success)
        ).catch(
            error => console.log(error)
        );
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
            },
            {
                id: '3',
                fileName: '11986.pdf',
                uploader: 'Dhiraj Prakash',
                uploadDt: ''
            },
            {
                id: '4',
                fileName: '11778.pdf',
                uploader: 'Pratik Ranjan',
                uploadDt: '15/JAN/2018'
            },
            {
                id: '5',
                fileName: '11986.pdf',
                uploader: 'Dhiraj Prakash',
                uploadDt: ''
            },
            {
                id: '6',
                fileName: '11778.pdf',
                uploader: 'Pratik Ranjan',
                uploadDt: '15/JAN/2018'
            },
            {
                id: '7',
                fileName: '11986.pdf',
                uploader: 'Dhiraj Prakash',
                uploadDt: ''
            },
            {
                id: '8',
                fileName: '11778.pdf',
                uploader: 'Pratik Ranjan',
                uploadDt: '15/JAN/2018'
            }
        ];

        const columns = [
            {
                Header: 'Sr. No.',
                headerClassName: 'bg-secondary',
                accessor: 'id'
            },
            {
                Header: 'File Name',
                headerClassName: 'bg-secondary',
                accessor: 'fileName'
            },
            {
                Header: 'Uploaded By',
                headerClassName: 'bg-secondary',
                accessor: 'uploader',
            },
            {
                Header: 'Uploaded On',
                headerClassName: 'bg-secondary',
                accessor: 'uploadDt'
            }
            ];
        return (
            <div align="center" className="mt-5">
                <div style={{height: '40vh', overflow: 'auto'}}>
                    <ReactTable
                        data={data}
                        columns={columns}
                        defaultPageSize={5}
                        className="-striped -highlight bg-dark text-light"
                    />

                </div>
                <br/>
                <div className="row ">
                    <div className="col-3">
                    <div className="dropzone" align="left">
                        <Dropzone
                                  accept="application/pdf" onDrop={this.uploadFiles.bind(this)}>
                            <div>
                                <p className="text-warning">Click or Drag Files Here...</p>
                            </div>
                        </Dropzone>
                    </div>
                    </div>
                    <div className="col-4">
                        <ul>
                            {
                                this.state.files.map(f => <div className="row mt-2"><Badge key={f.name} className="badge-secondary btn-block" style={{width:'80%'}}>{f.name}</Badge>&nbsp;&nbsp;{this.state.uploadInProgress ? <div className="File-loader mt-1"></div> : <FaCheck style={{color: 'green'}}/>}</div>)
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default UploadFile;
