import React, { Component } from 'react';
import './App.css';
import {Modal, ModalHeader, ModalBody, ModalFooter, Badge, Button, FormGroup, Col, Input, InputGroup, InputGroupAddon} from 'reactstrap';
import Dropzone from 'react-dropzone';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FaCheck from 'react-icons/lib/fa/check';
import {CSVLink, CSVDownload} from 'react-csv';
import { withAuth } from '@okta/okta-react';
import fetch from 'isomorphic-fetch';
import Helper from "./Helper";

class UploadFile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            uploadInProgress: false,
            reports: [],
            searchResult: [],
            modal: false,
            modalTitle:'',
            modalBody: {},
            noDataText: 'Loading...'
        }

        this.toggle = this.toggle.bind(this);
        this.searchReports = this.searchReports.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
    }

    async uploadFiles(files) {
        let totalSize = 0;
        const formData = new FormData();
        files.map(f => {
                totalSize = totalSize + f.size;
                formData.append('files', f);
            }
        );
        if (totalSize > 20480000) {
            return false;
        }
        this.setState({files: files, uploadInProgress:true});

        try {
            const response = await fetch(Helper.getAPI() + 'reports/upload', {
                headers: {
                    Authorization: 'Bearer ' + await this.props.auth.getAccessToken(),
                    UserId: this.props.userId
            },
                method: 'POST',
                body: formData
        });
            const data = await response.json();

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
            this.setState({reports: uploadedReports, searchResult: uploadedReports, uploadInProgress: false});

        } catch(err){
            console.log(err);
        }
    }

    async componentDidMount() {
        try {
            const response = await fetch(Helper.getAPI() + 'reports', {
                headers: {
                    Authorization: 'Bearer ' + await this.props.auth.getAccessToken(),
                    UserId: this.props.userId
                }
            });
            const data = await response.json();
            if(data && data.length > 0) {
                this.props.updateUser(data[0].userRole);
                this.setState({reports: data, searchResult: data});
            } else {
                this.setState({noDataText: 'No reports found!'});
            }

        } catch(err){
            this.setState({noDataText: 'No reports found!'});
            console.log(err);
        }
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    searchReports(e) {
        console.log(121);
        const searchText = e.target.value;
        if(this.state.reports.length > 0) {
            const results = [];
            this.state.reports.map(rpt => {
                if(rpt.pdfDataMap.RAW_DATA.toUpperCase().indexOf(searchText.toUpperCase()) > -1) {
                    results.push(rpt);
                }
            });
            const message = results.length === 0 ? 'No matching reports!' : this.state.noDataText;
            this.setState({searchResult: results, noDataText: message});
        }
    }

    clearSearch() {
        this.setState({searchResult: this.state.reports});
    }

    render() {

        const data = this.state.searchResult.map(rpt => {
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
                    <FormGroup row>
                        <Col sm={3}>
                            <InputGroup>
                            <Input type="search" name="nmSearch" id="idSearch" placeholder="search..." onChange={this.searchReports} />
                            <InputGroupAddon addonType="append" onClick={this.clearSearch} style={{cursor:'pointer'}}>x</InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </FormGroup>
                    <ReactTable
                        getTdProps={(state, rowInfo, column, instance) => {
                            return {
                                onClick: (e) => {
                                    if (rowInfo) {
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
                        noDataText={this.state.noDataText}
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
