import '../../../../../css/barChart.css'; // Import your CSS module

type typeOfTicketPriceChartParams = {
    min : number,
    max : number,
    normal : number
}

const TicketPriceChart = ({min, max, normal}:typeOfTicketPriceChartParams) => {
  
    const calculateBarHeight = (value:number) => {return (value / max) * 100};

    console.log(calculateBarHeight(max));
  
    return (
        <div className="chart-container">
        <div className="bar max-price" style={{ height: `${calculateBarHeight(max)}px` }}>
          <div className="bar-value">{max}Ft</div>
          <div className="bar-label">Max Ár</div>
        </div>
        <div className="bar min-price" style={{ height: `${calculateBarHeight(min)}px` }}>
          <div className="bar-value">{min}Ft</div>
          <div className="bar-label">Min Ár</div>
        </div>
        <div className="bar normal-price" style={{ height: `${calculateBarHeight(normal)}px` }}>
          <div className="bar-value">{normal}Ft</div>
          <div className="bar-label">Normál Ár</div>
        </div>
      </div>
    );
};

export default TicketPriceChart;
