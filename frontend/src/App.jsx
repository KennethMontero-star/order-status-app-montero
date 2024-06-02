import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(-1); // To track which row is being edited

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

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSave = async (index) => {
    const updatedItem = data[index];
    try {
      await axios.put(`https://order-status-montero.netlify.app/.netlify/functions/api/${updatedItem._id}`, updatedItem);
      setEditIndex(-1);
    } catch (error) {
      console.error("Error updating the item", error);
      setError(error);
    }
  };

  const handleChange = (e, index, field) => {
    const updatedData = [...data];
    updatedData[index][field] = e.target.value;
    setData(updatedData);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://order-status-montero.netlify.app/.netlify/functions/api/${id}`);
      const updatedData = data.filter(item => item._id !== id);
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting the item", error);
      setError(error);
    }
  };

  const renderTableHeader = () => {
    const headers = ["Id", "Customer Name", "Email", "Product Name", "Quantity", "Status", "Operations"];
    return (
      <tr>
        {headers.map((header) => (
          <th key={header}>{header}</th>
        ))}
      </tr>
    );
  };

  const renderTableRows = () => {
    return data.map((item, index) => (
      <tr key={index}>
        <td>{item._id}</td>
        <td>
          {editIndex === index ? (
            <input
              type="text"
              value={item.customerName}
              onChange={(e) => handleChange(e, index, 'customerName')}
            />
          ) : (
            item.customerName
          )}
        </td>
        <td>
          {editIndex === index ? (
            <input
              type="email"
              value={item.email}
              onChange={(e) => handleChange(e, index, 'email')}
            />
          ) : (
            item.email
          )}
        </td>
        <td>
          {editIndex === index ? (
            <input
              type="text"
              value={item.productName}
              onChange={(e) => handleChange(e, index, 'productName')}
            />
          ) : (
            item.productName
          )}
        </td>
        <td>
          {editIndex === index ? (
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleChange(e, index, 'quantity')}
            />
          ) : (
            item.quantity
          )}
        </td>
        <td>
          {editIndex === index ? (
            <input
              type="text"
              value={item.status}
              onChange={(e) => handleChange(e, index, 'status')}
            />
          ) : (
            item.status
          )}
        </td>
        <td>
          {editIndex === index ? (
            <button onClick={() => handleSave(index)}>Save</button>
          ) : (
            <button onClick={() => handleEdit(index)}>Edit</button>
          )}
          <button onClick={() => handleDelete(item._id)}>Delete</button>
        </td>
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
