import React from 'react';

const StatusDonut = ({ data }) => {
  // Pure SVG Donut Chart
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="donut-container">
      <h3>Asset Status Distribution</h3>
      <div className="donut-content">
        <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)', width: '200px' }}>
          {data.map((slice, index) => {
            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
            cumulativePercent += slice.value / total;
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
            const largeArcFlag = slice.value / total > 0.5 ? 1 : 0;
            const pathData = [
              `M ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L 0 0`,
            ].join(' ');

            return <path key={index} d={pathData} fill={slice.color} />;
          })}
          <circle r="0.6" className="donut-hole" />
        </svg>
        <div className="donut-legend">
          {data.map((slice, index) => (
            <div key={index} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: slice.color }}></span>
              <span className="legend-label">{slice.label}: {slice.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusDonut;
