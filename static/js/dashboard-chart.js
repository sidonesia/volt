const hrs = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm']
const ctx = document.getElementById('myChart');
const initialData = [
    {
        label: 'Solar generated',
        backgroundColor: "#EB714A",
        data: [12, 59, 5, 56, 58,12, 59, 65, 51, 20, 3,1,25,4,5,5,12, 59, 5, 56, 58,12, 59, 65, 51, 20, 3,1,25,4,5,5,5,],
        
    },
    {
        label: 'Home usage',
        backgroundColor: "#4678FF",
        data: [12, 59, 5, 56, 58,12, 59, 65, 51, 20, 3,1,25,4,5,5,5,12, 59, 5, 56, 58,12, 59, 65, 51, 20, 3,1,25,4,5,5,5,],
    }, {
        label: 'Battery usage',
        backgroundColor: "#00C2FF",
        data: [12, 59, 5, 56, 58,12, 59, 65, 51, 20, 3,1,25,4,5,5,12, 59, 5, 56, 58,12, 59, 65, 51, 20, 3,1,25,4,5,5,5,],
        borderRadius: {
            topLeft: 24,
            topRight: 24
        }
    },                     
]
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: hrs,
		datasets: initialData,
	},
    options: {        
        responsive: true,
        scales: {  
            x: {
                stacked: true,
                ticks: {
                    color: "white",                                        
                    stepSize: 3,
                    beginAtZero: true
                },
                grid: {
                    display: false,                                        
                }
            },
            y: {
                beginAtZero: true,    
                stacked: true,
                title: {
                    display: true,
                    text: 'kWh',
                    color: 'white',                    
                },
                ticks: {
                    color: "white",                                                                             
                    beginAtZero: true                    
                },
                grid: {                    
                    color: '#5C6196',
                    borderDash: [20, 4],
                    borderColor: '#5C6196',
                    borderWidth: 3
                }          
            },
            
            
        },        
        
    }
});
Chart.defaults.font.family = "Exo"
