import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://order-status-montero.netlify.app/.netlify/functions/api');
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const renderTableHeader = () => {
    if (data.length === 0) return null;
    return (
      <tr>
        {Object.keys(data[0]).map((key) => (
          <th key={key}>{key}</th>
        ))}
      </tr>
    );
  };

  const renderTableRows = () => {
    return data.map((item, index) => (
      <tr key={index}>
        {Object.values(item).map((value, i) => (
          <td key={i}>{value}</td>
        ))}
      </tr>
    ));
  };

  return (
    <div>
      <h1>Order Status</h1>
      <table>
        <thead>
          {renderTableHeader()}
        </thead>
        <tbody>
          {renderTableRows()}
        </tbody>
      </table>
    </div>
  );
}

export default App;
