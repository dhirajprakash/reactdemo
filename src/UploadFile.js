import React, { Component } from 'react';
import './App.css';
import {Modal, ModalHeader, ModalBody, ModalFooter, Badge, Button} from 'reactstrap';
import Dropzone from 'react-dropzone';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FaCheck from 'react-icons/lib/fa/check';
import {CSVLink, CSVDownload} from 'react-csv';
import { withAuth } from '@okta/okta-react';
import fetch from 'isomorphic-fetch';

class UploadFile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            uploadInProgress: false,
            reports: [],
            modal: false,
            modalTitle:'',
            modalBody: {}
        }
        this.API_URL = 'http://localhost:8080/';
        //this.API_URL = 'http://35.169.168.197:8080/integracaodeforcas/';

        this.toggle = this.toggle.bind(this);
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
        fetch(this.API_URL + 'reports/upload', {
            method: 'POST',
            body: formData
        }).then(
            response => {
                console.log(response);
                if (response.status === 200) {
                    response.json().then(data => {
                        console.log(data);
                        const uploadedReports = [];
                        let found = false;
                        for(let i=0; i<this.state.reports.length;i++){
                            found = false;
                            for(let j=0;j<data.length;j++){
                                if(this.state.reports[i].reportId === data[j].reportId){
                                    found = true;
                                }
                            }
                            if(!found){
                                uploadedReports.push(this.state.reports[i]);
                            }
                        }
                        data.map(rpt=> {
                           uploadedReports.unshift(rpt);
                        });
                        this.setState({reports: uploadedReports, uploadInProgress: false});
                    })
                } else {
                    console.log('Problem encountered. Status Code: ' +
                        response.status);
                }
            }
        ).then(
            success => console.log(success)
        ).catch(
            error => console.log(error)
        );
    }

    async componentDidMount() {
        try {
            const response = await fetch(this.API_URL + 'reports', {
                headers: {
                    Authorization: 'Bearer ' + await this.props.auth.getAccessToken()
                }
            });
            const data = await response.json();
            this.setState({reports: data});
        } catch(err){
            console.log(err);
        }
        /*fetch(this.API_URL + 'reports', {
            headers: {
                Authorization: 'Bearer ' + this.props.auth.getAccessToken()
        },
            method: 'GET'
        }).then(
            response => {
                if (response.status !== 200) {
                    console.log('Problem encountered. Status Code: ' +
                        response.status);
                    return;
                }
                response.json().then(data => {
                    this.setState({reports: data});
                })
            }
        ).catch(
            error => console.log(error)
        );*/
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {

        const data = this.state.reports.map(rpt => {
            return ({
                reportName: rpt.pdfDataMap.BoletimNo,
                flagrante: rpt.pdfDataMap.Flagrante,
                data: rpt.pdfDataMap.Data,
                dependencia: rpt.pdfDataMap.Dependencia,
                emitido: rpt.pdfDataMap.Emitido,
                history: rpt.pdfDataMap.History.split('~').join(' '),
                uploader: rpt.pdfDataMap.uploader,
                localCrime: rpt.pdfDataMap.LocalCrime
            });
        })

        const columns = [
            {
                Header: 'Boletim No.',
                headerClassName: 'bg-secondary',
                accessor: 'reportName'
            },
            {
                Header: 'Dependencia',
                headerClassName: 'bg-secondary',
                accessor: 'dependencia'
            },
            {
                Header: 'Flagrante',
                headerClassName: 'bg-secondary',
                accessor: 'flagrante'
            },
            {
                Header: 'Emitido',
                headerClassName: 'bg-secondary',
                accessor: 'emitido'
            },
            {
                Header: 'LocalCrime',
                headerClassName: 'bg-secondary',
                accessor: 'localCrime',
            },
            {
                Header: 'Uploaded By',
                headerClassName: 'bg-secondary',
                accessor: 'uploader'
            }
            ];

        return (
            <div align="center" className="mt-5">
                <div style={{height: '68vh', overflow: 'auto'}}>
                    <ReactTable
                        getTdProps={(state, rowInfo, column, instance) => {
                            return {
                                onClick: (e) => {
                                    if (rowInfo) {
                                        console.log(rowInfo.original);
                                        this.setState({
                                            modalTitle: rowInfo.original.reportName,
                                            modalBody: rowInfo.original
                                        });
                                        this.toggle();
                                    }
                                }
                                }
                            }
                        }
                        columns={columns}
                        data={data}
                        defaultPageSize={10}
                        noDataText="No reports found!"
                        className="-striped -highlight bg-dark text-light"
                    />

                </div>
                <br/>
                <div className="row">
                    <div className="col-3">
                    <div align="left">
                        <Dropzone disabled={this.state.uploadInProgress} style={{}} accept="application/pdf" onDrop={this.uploadFiles.bind(this)}>
                            <div>
                                <Button outline color="warning">Click or Drop Files Here...</Button>
                            </div>
                        </Dropzone>
                    </div>
                    </div>
                    <div className="col-4" style={{height: '13vh', overflow: 'auto'}}>
                        <ul>
                            {
                                this.state.files.map(f => <div className="row mt-2"><Badge key={f.name} className="badge-secondary btn-block" style={{width:'80%'}}>{f.name}</Badge>&nbsp;&nbsp;{this.state.uploadInProgress ? <div className="File-loader mt-1"></div> : <FaCheck style={{color: 'green'}}/>}</div>)
                            }
                        </ul>
                    </div>
                    <div className="col-4" align="right">
                    <span>
                        <CSVLink data={data} filename="Boletim.csv"><Button outline color="warning">CSV ⬇</Button></CSVLink>
                    </span>
                    </div>
                </div>

                <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg">
                    <ModalHeader toggle={this.toggle}>Boletim: {this.state.modalTitle}</ModalHeader>
                    <ModalBody>
                        <div>
                            <Badge color="primary">Data:</Badge>
                            <p>{this.state.modalBody.data}</p>
                        </div>
                        <div>
                            <Badge color="primary">Emitido:</Badge>
                            <p>{this.state.modalBody.emitido}</p>
                        </div>
                        <div>
                            <Badge color="primary">LocalCrime:</Badge>
                            <p>{this.state.modalBody.localCrime}</p>
                        </div>
                        <div>
                            <Badge color="primary">Dependencia:</Badge>
                            <p>{this.state.modalBody.dependencia}</p>
                        </div>
                        <div>
                            <Badge color="primary">Flagrante:</Badge>
                            <p>{this.state.modalBody.flagrante}</p>
                        </div>

                        <div>
                            <Badge color="primary">Histórico:</Badge>
                            <p>{this.state.modalBody.history}</p>
                        </div>
                        <div>
                            <Badge color="primary">Uploader:</Badge>
                            <p>{this.state.modalBody.uploader}</p>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default withAuth(UploadFile);
