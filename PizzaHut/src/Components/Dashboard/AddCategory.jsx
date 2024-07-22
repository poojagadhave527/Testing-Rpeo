import React, { useState } from 'react';
import axios from 'axios';
import './AddCategory.css';
import MessageBox from '../MessageBox';

function AddCategory({ fetchCategories, toggleAddCategory, triggerMessage }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Check if category already exists
      const checkResponse = await axios.post(`http://localhost:4000/categories/getbyname`, { name });

      if (checkResponse.status === 200) {
        triggerMessage('Category already exists', 'error');
      } else {
        // Add new category
        const response = await axios.post('http://localhost:4000/addcategory', { name, status });

        if (response.status === 200) {
          triggerMessage('Category added successfully', 'success');
          toggleAddCategory();
          fetchCategories();
        } else {
          triggerMessage('Something went wrong', 'error');
        }
      }
    } catch (error) {
      console.error('Error adding category:', error);
      triggerMessage('Error adding category', 'error');
    }
  };

  return (
    <div className='parentContainer'>
      <div className="boxDiv">
        <div className="addCategoryDiv">
          <form onSubmit={handleSubmit}>
            <h5>Add Category</h5>
            <div className="form-group">
              <label htmlFor="categoryName">Category Name:</label>
              <input
                type="text"
                value={name}
                required
                className="form-control"
                id="categoryName"
                placeholder="Category Name"
                onChange={(e) => setName(e.target.value)}
              /><br /><br />

              <div className='statusContainer'>
                <label className='statusLabel'>
                  <input
                    required
                    type="radio"
                    name="status"
                    value="active"
                    onChange={(e) => setStatus(e.target.value)}
                  /> Active
                </label>

                <label className='statusLabel'>
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    onChange={(e) => setStatus(e.target.value)}
                  /> Inactive
                </label>
              </div>

              <button type='submit' className='SaveBtn'>Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCategory;
