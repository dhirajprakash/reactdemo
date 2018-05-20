import React, { Component } from 'react';
import './App.css';
import {Doughnut} from 'react-chartjs-2';
import {Badge} from 'reactstrap';

class Charts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            testValue: ''
        }
    }

    render() {
        let madrugadaCount = 0;
        let manhaCount = 0;
        let tardeCount = 0;
        let noiteCount = 0;

        let sundayCount = 0;
        let mondayCount = 0;
        let tuesdayCount = 0;
        let wednesdayCount = 0;
        let thursdayCount = 0;
        let fridayCount = 0;
        let saturdayCount = 0;

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

        const data = {
            labels: [
                'MADRUGADA',
                'MANHA',
                'TARDE',
                'NOITE'
            ],
            datasets: [{
                data: [madrugadaCount, manhaCount, tardeCount, noiteCount],
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

        const weekdayData = {
            labels: [
                'SUNDAY',
                'MONDAY',
                'TUESDAY',
                'WEDNESDAY',
                'THURSDAY',
                'FRIDAY',
                'SATURDAY'
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
        return (
            <div className="mt-5">
                <div className="row mt-5">
                    <div className="col-5 bg-light ml-5" style={{height: '42vh'}}>
                        <Doughnut data={data} />
                        <Badge className="ml-5 mt-5" color="primary">Crime distribution By Time Of Day</Badge>
                    </div>

                    <div className="col-5 bg-light ml-5" style={{height: '42vh'}}>
                        <Doughnut data={weekdayData} />
                        <Badge className="ml-5 mt-5" color="primary">Crime distribution By Weekday</Badge>
                    </div>
                </div>
            </div>
        );
    }
}

export default Charts;
