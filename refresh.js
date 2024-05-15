
const roundMetrics =  document.querySelectorAll('round-metric');
const interval = setInterval(() => {
	fetch('http://localhost:5050')
		.then((response) => response.json())
		.then( (json) => {
			for (const metric of roundMetrics) {
				console.log(metric);
				let data = json[metric.hardware][metric.type];
				if(!data || data < 0){
					metric.updateValue('N/A');
					continue;
				}
				let value = json[metric.hardware][metric.type] + metric.unit;
				if(metric.maxValueKey){
					value += '/<br>' +
						json[metric.hardware][metric.maxValueKey] + metric.unit;
				}
				metric.updateValue(value);
			}
		})
		.catch((error) => {
			startServer()
			console.error(error);
		})
}, 1000);





