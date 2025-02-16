import React from 'react';

const IncomingTraffic = () => {
    return (
        <div className='IncTraffic_container'>
            <h2>Incoming traffic Information</h2>
        </div>
    );
}

export default IncomingTraffic;


// import React, { Component } from 'react';
// import {CanvasJSChart} from "canvasjs-react-charts";

// // Datapoints 
// const dps= Array.from({ length: 100 }, (_, index) => ({
//     x: index,  // x values as index (or use random timestamps)
//     y: Math.floor(Math.random() * 100) // Random y between 0 and 100
//   }));
// var xVal = dps.length + 1;
// var yVal = 15;
// var updateInterval = 1000; // 1 sec 
// class IncomingTraffic extends Component {
// 	constructor() {
// 		super();
// 		this.updateChart = this.updateChart.bind(this);
// 	}
// 	componentDidMount() {
// 		setInterval(this.updateChart, updateInterval);
// 	}
// 	updateChart() {
// 		yVal = Math.round(Math.random() *(100));
// 		dps.push({x: xVal,y: yVal});
// 		xVal++;
// 		if (dps.length >  50 ) {
// 			dps.shift();
// 		}
// 		this.chart.render();
// 	}
// 	render() {
// 		const options = {
// 			title :{
// 			},
// 			data: [{
// 				type: "line",
// 				dataPoints : dps
// 			}]
// 		}
// 		return (
// 		<div className='IncTraffic_container'>
//             <h2>Incoming traffic Information</h2>
// 			<CanvasJSChart options = {options}
// 				 onRef={ref => this.chart = ref}
// 			/>
// 			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
// 		</div>
// 		);
// 	}
// }
// export default IncomingTraffic;   