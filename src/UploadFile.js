import React, {Component} from 'react';
import './App.css';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Badge,
    Button,
    Tooltip,
    Collapse
} from 'reactstrap';
import Dropzone from 'react-dropzone';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FaCheck from 'react-icons/lib/fa/check';
import {CSVLink, CSVDownload} from 'react-csv';
import {withAuth} from '@okta/okta-react';
import fetch from 'isomorphic-fetch';
import Helper from './Helper';
import uuid from 'uuid';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle';
import FaExclamationCircle from 'react-icons/lib/fa/exclamation-circle';
import FaEdit from 'react-icons/lib/fa/edit';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';
import FaAngleUp from 'react-icons/lib/fa/angle-double-up';
import FaAngleDown from 'react-icons/lib/fa/angle-double-down';
import Person from './Person';
import Vehicle from './Vehicle';
import Article from './Article';

class UploadFile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            uploadInProgress: false,
            reports: [],
            searchResult: [],
            modal: false,
            uploadStatusModal: false,
            modalTitle: '',
            modalBody: {},
            noDataText: 'Carregando...',
            mapData: [],
            searchText: '',
            uploadFilesReturnedFromServer: [],
            userRole: '',
            reportEditMode: false,
            editTooltipOpen: false,
            cancelEditTooltipOpen: false,
            historyMinimized: false,
            indiciadoPersons: [],
            testimonyPersons: [],
            victimPersons: [],
            vehicles: [],
            articles: []
        }

        this.startDate = moment().subtract(90, "days");
        this.endDate = moment();

        this.toggle = this.toggle.bind(this);
        this.uploadStatusToggle = this.uploadStatusToggle.bind(this);
        this.searchReports = this.searchReports.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.handleFromDate = this.handleFromDate.bind(this);
        this.handleToDate = this.handleToDate.bind(this);
        this.checkDateFilter = this.checkDateFilter.bind(this);
        this.addIndiciadoPerson = this.addIndiciadoPerson.bind(this);
        this.addTestimonyPerson = this.addTestimonyPerson.bind(this);
        this.addVictimPerson = this.addVictimPerson.bind(this);
        this.checkValidPerson = this.checkValidPerson.bind(this);
        this.deleteIndiciadoPerson = this.deleteIndiciadoPerson.bind(this);
        this.deleteTestimonyPerson = this.deleteTestimonyPerson.bind(this);
        this.deleteVictimPerson = this.deleteVictimPerson.bind(this);
        this.addVehicle = this.addVehicle.bind(this);
        this.deleteVehicle = this.deleteVehicle.bind(this);
        this.addArticle = this.addArticle.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);
    }

    async uploadFiles(files) {
        this.props.manageScreenLoader(true);
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
        this.setState({files: files, uploadInProgress: true, uploadStatusModal:true});

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
            for (let i = 0; i < this.state.reports.length; i++) {
                found = false;
                for (let j = 0; j < data.length; j++) {
                    if (this.state.reports[i].reportId === data[j].reportId) {
                        found = true;
                    }
                }
                if (!found) {
                    uploadedReports.push(this.state.reports[i]);
                }
            }

            let errorOnUpload = false;
            data.map(rpt => {
                if(rpt.pdfDataMap.PARSE_ERROR) {
                    errorOnUpload = true;
                }
                if(!rpt.pdfDataMap.OTHER_USER) {
                    uploadedReports.unshift(rpt);
                }
            });
            this.setState({reports: uploadedReports, searchResult: uploadedReports, uploadInProgress: false, uploadFilesReturnedFromServer: data});

            if(errorOnUpload && data.length === 1) {
                this.props.notify('Error', 'error', 'Erro ao fazer o upload do arquivo!');
            } else if(errorOnUpload) {
                this.props.notify('Warning', 'warning', 'Poucos erros encontrados durante o upload de arquivos!');
            } else {
                this.props.notify('Success', 'success', 'Arquivos enviados!');
            }
            this.props.manageScreenLoader(false);
            this.props.updateChartData(uploadedReports);
            this.getMapCoordinates(uploadedReports);

        } catch (err) {
            console.log(err);
            this.props.notify('Error', 'error', 'o upload falhou. Entre em contato com a equipe de suporte!');
            this.props.manageScreenLoader(false);
            this.setState({uploadInProgress: false});
        }
    }

    async componentDidMount() {
        try {
            this.props.manageScreenLoader(true);
            const response = await fetch(Helper.getAPI() + 'reports', {
                headers: {
                    Authorization: 'Bearer ' + await this.props.auth.getAccessToken(),
                    UserId: this.props.userId
                }
            });
            const data = await response.json();
            //console.log(data);
            if (data && data.length > 0) {
                this.props.updateUser(data[0].userRole);
                this.setState({reports: data, searchResult: data, tableLoading: false, userRole: data[0].userRole});
                //this.getMapCoordinates(data);
                this.searchReports();

            } else {
                this.setState({noDataText: 'Nenhum arquivo encontrado!', tableLoading: false});
            }
            this.props.manageScreenLoader(false);
        } catch (err) {
            this.setState({noDataText: 'Nenhum arquivo encontrado!', tableLoading: false});
            console.log(err);
            this.props.manageScreenLoader(false);
        }
    }

    getMapCoordinates(data) {
        const coordinates = [];
        data.map(rpt => {
            coordinates.push({
                id: uuid.v4(),
                lat: parseFloat(rpt.pdfDataMap.Latitude),
                lng: parseFloat(rpt.pdfDataMap.Longitude),
                name: rpt.pdfDataMap.BoletimNo
            });
        });
        this.setState({mapData: coordinates});
        this.props.updateMapData(coordinates);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
            reportEditMode: false,
            historyMinimized: false,
            indiciadoPersons: [],
            testimonyPersons: [],
            victimPersons: [],
            vehicles: [],
            articles: []
        });
    }

    async submitUserInput() {
        this.props.manageScreenLoader(true);
        try {
            this.props.manageScreenLoader(true);

            //create userInputDataMap
            const userInput = {
                Dependencia: this.refs.userInput_Dependencia.value,
                Flagrante: this.refs.userInput_Flagrante.value,
                History: this.refs.userInput_History.value,
                Indiciado: this.state.indiciadoPersons,
                Testemunha: this.state.testimonyPersons,
                Vitima: this.state.victimPersons,
                vehicles: this.state.vehicles,
                articles: this.state.articles,
                editedBy: this.props.userId,
                uploader: this.refs.userInput_uploader.value
            }
            const report = {
                reportId: this.refs.userInput_BoletimNo.value,
                userInputDataMap: userInput
            };
            const reportData = JSON.stringify(report);
            this.toggle();
            const response = await fetch(Helper.getAPI() + '/reports/update', {
                headers: {
                    Authorization: 'Bearer ' + await this.props.auth.getAccessToken(),
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: reportData
            });
            const data = await response.json();
            console.log(data);
            if (data) {
                const allReports = [];
                allReports.push(data);
                for (let i = 0; i < this.state.reports.length; i++) {
                    if (this.state.reports[i].reportId != data.reportId) {
                        allReports.push(this.state.reports[i]);
                    }
                }
                this.props.notify('Success', 'success', 'Salvo com sucesso!');
            } else {
                this.props.notify('Error', 'error', 'Não salvo!');
            }
            this.props.manageScreenLoader(false);
        } catch (err) {
            console.log(err);
            this.props.notify('Error', 'error', 'Não salvo!');
            this.props.manageScreenLoader(false);
        }
    }

    uploadStatusToggle() {
        this.setState({
            uploadStatusModal: !this.state.uploadStatusModal
        });
    }

    searchReports() {
        const searchText = this.refs.searchBox.value;
        let isTextSearch = false;
        let isTextFound = false;

        if (searchText != null && searchText.trim() !== '') {
            isTextSearch = true;
        }

        if (this.state.reports.length > 0) {
            const results = [];
            this.state.reports.map(rpt => {
                isTextFound = false;
                if (isTextSearch) {
                    if (rpt.pdfDataMap && rpt.pdfDataMap.RAW_DATA) {
                        if (rpt.pdfDataMap.RAW_DATA.toUpperCase().indexOf(searchText.toUpperCase()) > -1) {
                            //console.log(this.checkDateFilter(rpt));
                            if (this.checkDateFilter(rpt) === 'Y') {
                                results.push(rpt);
                            }
                        }
                    }
                } else {
                    //console.log(this.checkDateFilter(rpt));
                    if (this.checkDateFilter(rpt) === 'Y') {
                        results.push(rpt);
                    }
                }


            });
            //console.log(results);
            const message = results.length === 0 ? 'Nenhum arquivo correspondente!' : this.state.noDataText;
            this.setState({searchResult: results, noDataText: message});
            this.getMapCoordinates(results);
            this.props.updateChartData(results);
        }
    }

    checkDateFilter(rpt) {
        let valid = '';
        try {
           // console.log(rpt.pdfDataMap.Data.split(' ')[0]);
            const occurenciaDt = moment(rpt.pdfDataMap.Data.split(' ')[0], 'DD/MM/YYYY');
            /*console.log(this.startDate);
            console.log(this.startDate === null);
            console.log(this.startDate === '');*/
            if (this.startDate != null && this.startDate !== '') {
                if (occurenciaDt.isSameOrAfter(this.startDate)) {
                    valid = 'Y';
                } else {
                    valid = 'N';
                }
            }
            //console.log('valid-->'+valid);

            if (valid !== 'N' && this.endDate != null && this.endDate !== '') {
                if (occurenciaDt.isSameOrBefore(this.endDate)) {
                    valid = 'Y';
                } else {
                    valid = 'N';
                }
            }
            //console.log('valid-->'+valid);
            valid = valid === '' ? 'Y' : valid;
        } catch (err) {
            console.log(err);
            valid = 'Y';
        }
        return valid;
    }

    clearSearch() {
        this.setState({searchText: ''});
        this.searchReports();
        // this.getMapCoordinates(this.state.reports);
        this.refs.searchBox.value = '';
    }

    async getReportLink(s3ReportName) {
        //console.log(s3ReportName);
        this.props.manageScreenLoader(true);
        try {
            const response = await fetch(Helper.getAPI() + 'reports/link?fileName=' + s3ReportName, {
                headers: {
                    Authorization: 'Bearer ' + await this.props.auth.getAccessToken()
                },
                method: 'GET'
            });
            const data = await response.text();
            this.props.manageScreenLoader(false);
            const win = window.open(data, '_blank');
            win.focus();
        } catch (err) {
            console.log(err);
            this.props.manageScreenLoader(false);
        }
    }

    handleFromDate(date) {
        if(date !== null) {
        if (moment(date).isAfter(moment(this.endDate).subtract(1, 'd'))) {
            this.props.notify('Warning', 'warning', 'Selecione desde a data anterior a data.');
            return false;
        }
        if (moment(date).isAfter(moment())) {
            this.props.notify('Warning', 'warning', 'Selecione data válida.');
            return false;
        }
    }
        this.startDate = date;
        this.searchReports();

    }

    handleToDate(date) {
        if(date !== null) {
        if (moment(date).isBefore(moment(this.startDate).add(1, 'd'))) {
            this.props.notify('Warning', 'warning', 'Selecione até a data mais tarde que Da data.');
            return false;
        }
        if (moment(date).isAfter(moment())) {
            this.props.notify('Warning', 'warning', 'Selecione data válida.');
            return false;
        }
    }
        this.endDate = date;
        this.searchReports();

    }

    editReportDetail() {
        this.setState({reportEditMode: !this.state.reportEditMode, editTooltipOpen: !this.state.editTooltipOpen, cancelEditTooltipOpen: !this.state.cancelEditTooltipOpen});
    }
    toggleEditTooltip() {
        this.setState({editTooltipOpen: !this.state.editTooltipOpen});
    }
    toggleCancelEditTooltip() {
        this.setState({cancelEditTooltipOpen: !this.state.cancelEditTooltipOpen});
    }
    toggleHistoryView() {
        this.setState({historyMinimized: !this.state.historyMinimized});
    }

    addIndiciadoPerson(personObj) {
        if (this.checkValidPerson(personObj)){
            const personArray = this.state.indiciadoPersons;
            personArray.push(personObj);
            this.setState({indiciadoPersons: personArray});
        }
    }
    deleteIndiciadoPerson(id) {
        const personArray = this.state.indiciadoPersons;
        const personUpd = personArray.filter(p => p.id !== id);
        this.setState({indiciadoPersons: personUpd});
    }

    addTestimonyPerson(personObj) {
        if (this.checkValidPerson(personObj)){
            const personArray = this.state.testimonyPersons;
            personArray.push(personObj);
            this.setState({testimonyPersons: personArray});
        }
    }
    deleteTestimonyPerson(id) {
        const personArray = this.state.testimonyPersons;
        const personUpd = personArray.filter(p => p.id !== id);
        this.setState({testimonyPersons: personUpd});
    }

    addVictimPerson(personObj) {
        if (this.checkValidPerson(personObj)){
            const personArray = this.state.victimPersons;
            personArray.push(personObj);
            this.setState({victimPersons: personArray});
        }
    }
    deleteVictimPerson(id) {
        const personArray = this.state.victimPersons;
        const personUpd = personArray.filter(p => p.id !== id);
        this.setState({victimPersons: personUpd});
    }

    checkValidPerson(personObj) {
        if (personObj.age > 200 || personObj.age < 1) {
            this.props.notify('Error', 'error', 'insira idade válida!');
            return false;
        } else if (personObj.name == '') {
            this.props.notify('Error', 'error', 'Enter name!');
            return false;
        } else {
            return true;
        }
    }

    addVehicle(vehicleObj) {
        const vehicleArray = this.state.vehicles;
            vehicleArray.push(vehicleObj);
            this.setState({vehicles: vehicleArray});
    }
    deleteVehicle(id) {
        const vehicleArray = this.state.vehicles;
        const vehicleUpd = vehicleArray.filter(v => v.id !== id);
        this.setState({vehicles: vehicleUpd});
    }

    addArticle(articleObj) {
        const articleArray = this.state.articles;
        articleArray.push(articleObj);
        this.setState({articles: articleArray});
    }
    deleteArticle(id) {
        const articleArray = this.state.articles;
        const articleUpd = articleArray.filter(v => v.id !== id);
        this.setState({articles: articleUpd});
    }
    render() {

        const data = this.state.searchResult.map(rpt => {
            return ({
                BoletimNo: rpt.pdfDataMap.BoletimNo,
                Flagrante: rpt.pdfDataMap.Flagrante,
                Data: rpt.pdfDataMap.Data,
                Dependencia: rpt.pdfDataMap.Dependencia,
                Emitido: rpt.pdfDataMap.Emitido,
                History: rpt.pdfDataMap.History ? rpt.pdfDataMap.History.split('~').join(' ') : 'N.A.',
                uploader: rpt.pdfDataMap.uploader,
                LocalCrime: rpt.pdfDataMap.LocalCrime,
                s3ReportName: rpt.pdfDataMap.s3ReportName,
                Longitude: rpt.pdfDataMap.Longitude,
                Latitude: rpt.pdfDataMap.Latitude,
                Especie: rpt.pdfDataMap.Especie,
                Year: rpt.pdfDataMap.Year,
                Autoria: rpt.pdfDataMap.Autoria,
                Circunscricao: rpt.pdfDataMap.Circunscricao,
                PeriodoCommunicacao: rpt.pdfDataMap.PeriodoCommunicacao,
                PeriodoElaboracao: rpt.pdfDataMap.PeriodoElaboracao,
                Rubrica: rpt.pdfDataMap.Rubrica,
                TipoDeLocal: rpt.pdfDataMap.TipoDeLocal,
                Indiciado: rpt.pdfDataMap.Indiciado,
                Testemunha: rpt.pdfDataMap.Testemunha,
                Vitima: rpt.pdfDataMap.Vitima
            });
        })

        const columns = [
            {
                Header: 'Boletim No.',
                headerClassName: 'bg-secondary',
                accessor: 'BoletimNo'
            },
            {
                Header: 'Dependencia',
                headerClassName: 'bg-secondary',
                accessor: 'Dependencia'
            },
            {
                Header: 'Ocorrência',
                headerClassName: 'bg-secondary',
                accessor: 'Data'
            },
            {
                Header: 'Emitido',
                headerClassName: 'bg-secondary',
                accessor: 'Emitido'
            },
            {
                Header: 'LocalCrime',
                headerClassName: 'bg-secondary',
                accessor: 'LocalCrime',
            },
            {
                Header: 'Flagrante',
                headerClassName: 'bg-secondary',
                accessor: 'Flagrante'
            }
        ];

        let uploadInProgressData = '';
        if(this.state.uploadInProgress) {
            uploadInProgressData = this.state.files.map(f =>
                <tr key={f.name}>
                    <td>
                        {f.name}
                    </td>
                    <td colSpan="2" align="center">
                        <div className="File-loader mt-1"></div>
                    </td>
                </tr>
            );
        } else {
            let keys = '';
            uploadInProgressData = this.state.uploadFilesReturnedFromServer.map(f =>
                <tr key={f.reportS3Link}>
                    <td>
                        {f.reportS3Link}
                    </td>
                    <td style={{display: f.pdfDataMap.FAILED_KEYS.length > 0 ? '' : 'none'}}>
                        Falha ao extrair<b>{f.pdfDataMap.FAILED_KEYS.map(k => {return (k + '  ')})}</b>
                    </td>
                    <td style={{display: f.pdfDataMap.OTHER_USER ? '' : 'none'}}>
                        Já carregado por outro usuário.
                    </td>
                    <td colSpan="2" align="center" style={{display: f.pdfDataMap.PARSE_ERROR ? 'none' : ''}}>
                        <FaCheck style={{color: 'green'}}/>
                    </td>
                    <td style={{display: f.pdfDataMap.OTHER_USER ? '' : 'none'}}>
                        <FaExclamationCircle style={{color: 'red'}}/>
                    </td>
                    <td style={{display: (f.pdfDataMap.PARSE_ERROR && !f.pdfDataMap.OTHER_USER) ? '' : 'none'}}>
                        <FaExclamationTriangle style={{color: 'orange'}}/>
                    </td>
                </tr>
            );
        }

        return (
            <div style={{marginTop: '7vh', height: '93vh'}} className="font-common">
                <div className="mt-3 mb-2 row">
                    <div className="col-8 d-inline-block">
                        <div className="react-datepicker-wrapper">
                            <div className="react-datepicker__input-container">
                                <input type="text" name="nmSearch" id="idSearch" placeholder="pesquisa boletim..."
                                       onChange={this.searchReports} ref="searchBox"
                                       className="react-datepicker-ignore-onclickoutside"/>
                                {/*<button className="react-datepicker__close-icon" onClick={this.clearSearch}></button>*/}
                            </div>
                        </div>
                        <span className="d-inline-block text-light ml-3">Ocorrência:</span>
                        <div className="d-inline-block ml-1">
                            <DatePicker
                                selected={this.startDate}
                                selectsStart
                                startDate={this.startDate}
                                endDate={this.endDate}
                                onChange={this.handleFromDate}
                                isClearable={true}
                                dateFormat="DD/MM/YYYY"
                            />
                        </div>
                        <div className="d-inline-block ml-1 ">
                            <DatePicker
                                selected={this.endDate}
                                selectsEnd
                                startDate={this.startDate}
                                endDate={this.endDate}
                                onChange={this.handleToDate}
                                isClearable={true}
                                dateFormat="DD/MM/YYYY"
                            />
                        </div>
                    </div>
                    {/*<div className="d-inline-block ml-1" style={{marginTop: -8}}><h2 onClick={this.applyFilter}>
                        <FaPlayCircle style={{color: '#ffc107', cursor: 'pointer'}}/></h2></div>*/}
                </div>

                <div>
                    <div>
                        <div style={{height: '71vh', overflow: 'auto'}}>
                            <ReactTable
                                getTdProps={(state, rowInfo, column, instance) => {
                                    return {
                                        onClick: (e) => {
                                            if (rowInfo) {
                                                this.setState({
                                                    modalTitle: rowInfo.original.BoletimNo,
                                                    modalBody: rowInfo.original
                                                });
                                                this.toggle();
                                            }
                                        }
                                    }
                                }
                                }
                                //loading={this.state.tableLoading}
                                //LoadingComponent={ReactTableLoader}
                                columns={columns}
                                data={data}
                                defaultPageSize={10}
                                sortable={false}
                                resizable={false}
                                noDataText={this.state.noDataText}
                                className="-striped -highlight bg-dark text-light"
                            />

                        </div>
                        <div className="row mt-1">
                            <div className="col-3">
                                <div align="left">
                                    <Dropzone disabled={this.state.uploadInProgress} style={{}} accept="application/pdf"
                                              onDrop={this.uploadFiles.bind(this)}>
                                        <div>
                                            <Button outline color="warning">Clique ou Arraste arquivos aqui
                                                (pdf)</Button>
                                        </div>
                                    </Dropzone>
                                </div>
                            </div>

                            <div className="col-9" align="right" style={{display: this.state.userRole == 'SUPER_ADMIN' ? '' : 'none'}}>
                                <span>
                                    <CSVLink data={data} filename="Boletim.csv"><Button outline color="warning">CSV ⬇</Button></CSVLink>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal className="font-common" isOpen={this.state.modal} toggle={this.toggle} size="lg" centered="true">
                    <ModalHeader toggle={this.toggle}>
                        Boletim: {this.state.modalTitle}&nbsp;
                        <FaEdit className="edit-icon" id="editReportIcon" style={{cursor: 'Pointer', marginLeft: 10, marginTop: -5, display: this.state.reportEditMode ? 'none' : ''}} onClick={this.editReportDetail.bind(this)} />
                        <Tooltip placement="right" delay={{ show: 200, hide: 0 }} isOpen={this.state.editTooltipOpen} target="editReportIcon" toggle={this.toggleEditTooltip.bind(this)}>
                            Editar detalhes do arquivo!
                        </Tooltip>
                        <FaTimesCircle className="edit-icon" id="cancelEditReportIcon" style={{cursor: 'Pointer', marginLeft: 10, marginTop: -5, display: this.state.reportEditMode ? '' : 'none'}} onClick={this.editReportDetail.bind(this)} />
                        <Tooltip placement="right" delay={{ show: 200, hide: 0 }} isOpen={this.state.cancelEditTooltipOpen} target="cancelEditReportIcon" toggle={this.toggleCancelEditTooltip.bind(this)}>
                            cancelar a edição
                        </Tooltip>
                    </ModalHeader>
                    <ModalBody style={{display: this.state.reportEditMode ? 'none' : ''}}>
                        <div>
                            <Badge color="primary">Data:</Badge>
                            <Button outline color="primary" size="sm" className="float-right" style={{display: this.state.userRole === 'SUPER_ADMIN' ? '' : 'none'}}
                                    onClick={this.getReportLink.bind(this, this.state.modalBody.s3ReportName)}>View
                                Report</Button>
                            <p>{this.state.modalBody.Data}</p>
                        </div>
                        <div>
                            <Badge color="primary">Emitido:</Badge>
                            <p>{this.state.modalBody.Emitido}</p>
                        </div>
                        <div>
                            <Badge color="primary">LocalCrime:</Badge>
                            <p>{this.state.modalBody.LocalCrime}</p>
                        </div>
                        <div>
                            <Badge color="primary">Dependencia:</Badge>
                            <p>{this.state.modalBody.Dependencia}</p>
                        </div>
                        <div>
                            <Badge color="primary">Flagrante:</Badge>
                            <p>{this.state.modalBody.Flagrante}</p>
                        </div>

                        <div>
                            <Badge color="primary">Histórico:</Badge>
                            <p>{this.state.modalBody.History}</p>
                        </div>
                        <div>
                            <Badge color="primary">Enviado por:</Badge>
                            <p>{this.state.modalBody.uploader}</p>
                        </div>

                    </ModalBody>
                    <ModalBody style={{display: this.state.reportEditMode ? '' : 'none'}}>
                        {/*<div>
                            <Badge color="primary">Data:</Badge>
                            <p>{this.state.modalBody.Data}</p>
                        </div>
                        <div>
                            <Badge color="primary">Emitido:</Badge>
                            <p>{this.state.modalBody.Emitido}</p>
                        </div>
                        <div>
                            <Badge color="primary">LocalCrime:</Badge>
                            <p>{this.state.modalBody.LocalCrime}</p>
                        </div>*/}
                        <div>
                        <input type="hidden" ref="userInput_uploader" value={this.state.modalBody.uploader}/>
                            <input type="hidden" ref="userInput_BoletimNo" value={this.state.modalBody.BoletimNo}/>
                        </div>
                        <div className="form-group">
                            <Badge color="primary">Dependencia:</Badge>
                            <br/>
                            <input ref="userInput_Dependencia" className="form-control mt-1" defaultValue={this.state.modalBody.Dependencia}/>
                        </div>
                        <div className="form-group">
                            <Badge color="primary">Flagrante:</Badge>
                            <select ref="userInput_Flagrante" className="form-control mt-1" defaultValue={this.state.modalBody.Flagrante}>
                                <option value="Sim" selected={this.state.modalBody.Flagrante == 'Sim'}>Sim</option>
                                <option value="Nao" selected={this.state.modalBody.Flagrante != 'Sim'}>Nao</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <Badge color="primary">Histórico:</Badge>
                            <FaAngleUp style={{display: this.state.historyMinimized ? 'none' : '', cursor: 'pointer', marginLeft: 3}} onClick={this.toggleHistoryView.bind(this)} />
                            <FaAngleDown style={{display: this.state.historyMinimized ? '' : 'none', cursor: 'pointer', marginLeft: 3}} onClick={this.toggleHistoryView.bind(this)} />
                            <Collapse isOpen={!this.state.historyMinimized}>
                                <textarea ref="userInput_History" rows={15} style={{alignContent: 'center'}} className="form-control mt-1">{this.state.modalBody.History}</textarea>
                            </Collapse>
                        </div>

                        <div className="form-group">
                            <Badge color="primary">Indiciado:</Badge>
                            <Person addPerson={(personObj) => this.addIndiciadoPerson(personObj)} deletePerson={(id) => this.deleteIndiciadoPerson(id)} persons={this.state.indiciadoPersons}/>
                        </div>

                        <div className="form-group">
                            <Badge color="primary">Testemunha:</Badge>
                            <Person addPerson={(personObj) => this.addTestimonyPerson(personObj)} deletePerson={(id) => this.deleteTestimonyPerson(id)} persons={this.state.testimonyPersons}/>
                        </div>

                        <div className="form-group">
                            <Badge color="primary">Vitima:</Badge>
                            <Person addPerson={(personObj) => this.addVictimPerson(personObj)} deletePerson={(id) => this.deleteVictimPerson(id)} persons={this.state.victimPersons}/>
                        </div>

                        <div className="form-group">
                            <Badge color="primary">Veículo:</Badge>
                            <Vehicle addVehicle={(vehicleObj) => this.addVehicle(vehicleObj)} deleteVehicle={(id) => this.deleteVehicle(id)} vehicles={this.state.vehicles}/>
                        </div>

                        <div className="form-group">
                            <Badge color="primary">Objetos:</Badge>
                            <Article addArticle={(articleObj) => this.addArticle(articleObj)} deleteArticle={(id) => this.deleteArticle(id)} articles={this.state.articles}/>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Fechar</Button>
                        <Button color="warning" style={{display: this.state.reportEditMode ? '' : 'none'}} onClick={this.submitUserInput.bind(this)}>Enviar</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.uploadStatusModal} centered="true">
                    <ModalBody className="font-common">
                        <table className="table-bordered table-striped" style={{width: '100%'}}>
                            <tbody>
                                <tr className="bg-info">
                                    <td style={{width: '50%'}}>
                                        Arquivo
                                    </td>
                                    <td style={{width: '35%'}}>
                                        &nbsp;
                                    </td>
                                    <td style={{width: '15%'}}>
                                        &nbsp;
                                    </td>
                                </tr>
                                {uploadInProgressData}
                            </tbody>
                        </table>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.uploadStatusToggle} disabled={this.state.uploadInProgress}>Fechar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default withAuth(UploadFile);