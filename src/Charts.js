import React, { Component } from 'react';
import './App.css';
import {Doughnut} from 'react-chartjs-2';
import {Bar} from 'react-chartjs-2';
import {Badge} from 'reactstrap';
import ReactToPrint from "react-to-print";

class Charts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            testValue: ''
        }
    }

    

    render() {

        let autoriaConhecidaCount = 0;
        let autoriaDesConhecidaCount = 0;
        let autoriaOthersCount = 0;
        let autoriaUndectectedCount = 0;
       
        let madrugadaCount = 0;
        let manhaCount = 0;
        let tardeCount = 0;
        let noiteCount = 0;
        let incertaCount = 0;

        let sundayCount = 0;
        let mondayCount = 0;
        let tuesdayCount = 0;
        let wednesdayCount = 0;
        let thursdayCount = 0;
        let fridayCount = 0;
        let saturdayCount = 0;

        let flagranteCountSim = 0;
        let flagranteCountNao = 0;
        let flagranteCountUndetected = 0;

        let furtoCount = 0;
        let rouboCount = 0;
        let otherCrimeCount = 0;
        let otherUndetectedCrimeCount = 0;

        if(this.props.chartData.length > 0) {
            this.props.chartData.map(rpt => {
                if(rpt.pdfDataMap.OCCURENCIA_TIME === 'MADRUGADA'){
                    madrugadaCount++;
                } else if(rpt.pdfDataMap.OCCURENCIA_TIME === 'MANHA'){
                    manhaCount++;
                } else if(rpt.pdfDataMap.OCCURENCIA_TIME === 'TARDE'){
                    tardeCount++;
                }else if(rpt.pdfDataMap.OCCURENCIA_TIME === 'NOITE'){
                    noiteCount++;
                } else {
                    incertaCount++;
                }
                
                if(rpt.pdfDataMap.Rubrica != null){
                if(rpt.pdfDataMap.Rubrica.includes('urto')){
                    furtoCount++;
                }else if(rpt.pdfDataMap.Rubrica.includes('oubo')){
                    rouboCount++;
                 }else{
                    otherCrimeCount++;
                 }
                }else{
                    otherUndetectedCrimeCount++;
                }

                if(rpt.pdfDataMap.Autoria != null){
                    if(rpt.pdfDataMap.Autoria.includes('Desconhecida')){
                        autoriaDesConhecidaCount++;
                    }else if(rpt.pdfDataMap.Autoria.includes('Conhecida')){
                        autoriaConhecidaCount++;
                     }else{
                        autoriaOthersCount++;
                     }
                    }else{
                        autoriaUndectectedCount++;
                    }
                
                if(rpt.pdfDataMap.Flagrante === 'Sim'){
                    flagranteCountSim++;
                }else if(rpt.pdfDataMap.Flagrante === 'Não'){
                    flagranteCountNao++;
                }else{
                    flagranteCountUndetected++;
                }

                switch(rpt.pdfDataMap.OCCURENCIA_DAY) {

                    case "SUNDAY":
                        sundayCount++;
                        break;
                    case "MONDAY":
                        mondayCount++;
                        break;
                    case "TUESDAY":
                        tuesdayCount++;
                        break;
                    case "WEDNESDAY":
                        wednesdayCount++;
                        break;
                    case "THURSDAY":
                        thursdayCount++;
                        break;
                    case "FRIDAY":
                        fridayCount++;
                        break;
                    case "SATURDAY":
                        saturdayCount++;
                        break;
                }
            });
        }

        var correctSet = {
            labels: ["DAY1", "DAY2", "DAY3","DAY4", "DAY5", "DAY6","DAY7"],
            datasets: [
                {
                    label: "ROUBO",
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#FF6384'
                    ],
                    data: [3, 7, 4,5,10,2,20]
                },
                {
                    label: "FURTO",
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#FF6384'
                    ],
                    data: [4, 3, 7,5,10,11,20]
                },
                {
                    label: "OUTROS",
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#FF6384'
                    ],
                    data: [7, 2, 6,5,10,2,20]
                }
            ]
        };


        const dataFlagrante = {
            labels: [
                'SIM',
                'NAO',
                "N/A"
            ],
            datasets: [{
                data: [flagranteCountSim, flagranteCountNao,flagranteCountUndetected],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
            }]
        };

        const dataAutoria = {
            labels: [
                'CONHECIDA',
                'DESCONHECIDA',
                'OUTROS',
                'N/A'
            ],
            datasets: [{
                data: [autoriaConhecidaCount, autoriaDesConhecidaCount, autoriaOthersCount,autoriaUndectectedCount],
                label: "Numero de BOs",
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#7DCEA0'
                   
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#7DCEA0'
                   
                ]
            }]
        };

        const dataTypeCrime = {
            labels: [
                'ROUBO',
                'FURTO',
                'OUTROS',
                'N/A'
            ],
            datasets: [{
                data: [rouboCount, furtoCount, otherCrimeCount,otherUndetectedCrimeCount],
                label: "Numero de BOs",
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#7DCEA0'
                   
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#7DCEA0'
                   
                ]
            }]
        };

        const data = {
            labels: [
                'MADRUGADA',
                'MANHA',
                'TARDE',
                'NOITE',
                'INCERTA'
            ],
            datasets: [{
                data: [madrugadaCount, manhaCount, tardeCount, noiteCount, incertaCount],
                label: "Numero de BOs",
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#7DCEA0',
                    '#AEB6BF'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#7DCEA0',
                    '#AEB6BF'
                ]
            }]
        };

        const weekdayData = {
            labels: [
                'DOMINGO',
                'SEGUNDA',
                'TERÇA',
                'QUARTA',
                'QUINTA',
                'SEXTA',
                'SÁBADO'
            ],
            datasets: [{
                data: [sundayCount, mondayCount, tuesdayCount, wednesdayCount, thursdayCount, fridayCount, saturdayCount],
                backgroundColor: [
                    '#F1948A',
                    '#C39BD3',
                    '#85C1E9',
                    '#76D7C4',
                    '#F7DC6F',
                    '#E59866',
                    '#AEB6BF'
                ],
                label: "Numero de BOs",
                hoverBackgroundColor: [
                    '#F1948A',
                    '#C39BD3',
                    '#85C1E9',
                    '#76D7C4',
                    '#F7DC6F',
                    '#E59866',
                    '#AEB6BF'
                ]
            }]
        };

        const options = {
            scales: {
                 xAxes: [{
                     stacked: true
                 }],
                 yAxes: [{
                     stacked: true
                 }]
             }
         }
     
         let dataStack ={ 
           datasets:[{
             label: 'ROUBO',
               data :[rouboCount],
               backgroundColor: [
                '#FF6384'
               ],
               hoverBackgroundColor: [
                '#FF6384'
               ]
             },
             {
               label: 'FURTO',
               data:  [furtoCount]  ,
               backgroundColor: [
                '#36A2EB'
                
               ],
               hoverBackgroundColor: [
                   '#36A2EB' 
               ] 
             },
             {
               label: 'OUTROS',
               data:  [otherCrimeCount]  ,
               backgroundColor: [
                '#FFCE56'
               ],
               hoverBackgroundColor: [
                    '#FFCE56'
               ] 
             }],
           labels:['Crimes Total']
         }

        return (
            <div className="mt-5" style={{overflowY: 'auto', maxHeight: '93vh'}}>
            {/* <ReactToPrint
                    trigger={() => <a href="#">Print!</a>}
                    content={() => this.componentRef}
                    /> */}
                {/*<button onClick={() => window.print()}>PRINT</button>*/}
                <div className="row mt-2">
                    <div className="col-5 bg-light ml-5" style={{height: '42vh'}}>
                        <Bar data={data} />
                        <div style={{marginLeft: '18%'}} >
                        <Badge className="ml-5 mt-5" color="primary">Por Periodo</Badge>
                        </div>
                    </div>

                    <div className="col-5 bg-light ml-5" style={{height: '42vh'}}>
                        <Bar data={weekdayData} />
                        <div style={{marginLeft: '18%'}} >
                        <Badge className="ml-5 mt-5" color="primary">Por Dia</Badge>
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-5 bg-light ml-5" style={{height: '42vh'}}>
                        <Doughnut data={dataFlagrante} />
                        <div style={{marginLeft: '18%'}} >
                        <Badge className="ml-5 mt-5" color="primary">Flagrante</Badge>
                        </div>
                    </div>

                    <div className="col-5 bg-light ml-5" style={{height: '42vh'}}>
                        <Bar data={dataTypeCrime} />
                        <div style={{marginLeft: '18%'}} >
                        <Badge className="ml-5 mt-5" color="primary">Tipo Crime</Badge>
                        </div>
                    </div>
                </div>
                <div className="row mt-5">
                <div className="col-5 bg-light ml-5" style={{height: '42vh'}}>
                        <Bar data={dataAutoria} />
                        <div style={{marginLeft: '18%'}} >
                        <Badge className="ml-5 mt-5" color="primary">Autoria</Badge>
                        </div>
                    </div>
                  
                     <div className="col-5 bg-light ml-5" style={{height: '42vh'}}>
                        <Bar data={dataStack} options={options}/>
                        <div style={{marginLeft: '18%'}} >
                        <Badge className="ml-5 mt-5" color="primary">Crimes Total</Badge>
                        </div>
                    </div>
                </div>
                <div className="row mt-5">
                {/* <div className="col-5 bg-light ml-5" style={{height: '42vh'}}>
                        <Bar data={correctSet} />
                        <div style={{marginLeft: '18%'}} >
                        <Badge className="ml-5 mt-5" color="primary">week3</Badge>
                        </div>
                    </div>
                  
                     <div className="col-5 bg-light ml-5" style={{height: '42vh'}}>
                        <Bar data={correctSet} />
                        <div style={{marginLeft: '18%'}} >
                        <Badge className="ml-5 mt-5" color="primary">week4</Badge>
                        </div>
                    </div> */}
                </div>
            </div>
           
        );
    }
}

export default Charts;
