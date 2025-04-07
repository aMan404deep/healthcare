import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HealthChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    // Process the data when it changes
    if (Array.isArray(data) && data.length > 0) {
      setChartData(data);
    } else {
      // Provide sample data if no data is available
      setChartData([
        { date: '2025-01-01', heartRate: 72, bloodPressure: 120, weight: 68 },
        { date: '2025-02-01', heartRate: 74, bloodPressure: 122, weight: 67.5 },
        { date: '2025-03-01', heartRate: 73, bloodPressure: 118, weight: 67 },
        { date: '2025-04-01', heartRate: 75, bloodPressure: 121, weight: 67.3 },
      ]);
    }
  }, [data]);

  // Normalize data for display
  const normalizedData = chartData.map(item => {
    const dateObj = new Date(item.date);
    const formattedDate = dateObj instanceof Date && !isNaN(dateObj) 
      ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : item.date;
    
    return {
      date: formattedDate,
      heartRate: item.heartRate || item.heart_rate || 0,
      bloodPressure: item.bloodPressure || item.blood_pressure || 0,
      weight: item.weight || 0
    };
  });

  // Custom tooltip to format the data display
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-md rounded-md">
          <p className="font-medium text-slate-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.name === 'weight' ? 'kg' : entry.name === 'heartRate' ? 'bpm' : 'mmHg'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={normalizedData}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            yAxisId="left"
            orientation="left"
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="heartRate"
            name="Heart Rate"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="bloodPressure"
            name="Blood Pressure"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="weight"
            name="Weight"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthChart;