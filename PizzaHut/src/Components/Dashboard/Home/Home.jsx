import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './home.css';
import BillingTabs from './BillingTabs';
import BillingHistory from './BillingHistory';

function Home({ triggerMessage }) {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([])
  const [AllCategory, setAllCategory] = useState([]);
  const [tabs, setTabs] = useState([{ id: 1, items: [] }]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchBy, setSearchBy] = useState('')
  const [billHistoryOpen, setBillHistoryOpen] = useState(false)

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/products/allproducts');
      const response2 = await axios.get('http://localhost:4000/categories');
      setData(response.data);
      setOriginalData(response.data)
      setAllCategory(response2.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNewBill = () => {
    const newId = tabs.length + 1;
    setTabs([...tabs, { id: newId, items: [] }]);
    setActiveIndex(newId - 1);
  };

  const handleDeleteTab = (id) => {
    const filteredTabs = tabs.filter(tab => tab.id !== id);
    setTabs(filteredTabs);
    setActiveIndex(prevIndex => (prevIndex >= filteredTabs.length ? filteredTabs.length - 1 : prevIndex));
  };

  const addToCart = (product) => {
    setTabs(prevTabs => prevTabs.map((tab, index) =>
      index === activeIndex
        ? {
          ...tab,
          items: tab.items.some(item => item._id === product._id)
            ? tab.items.map(item =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
            : [...tab.items, { ...product, quantity: 1 }]
        }
        : tab
    ));
  };

  const handleDeleteItemFromCart = (tabId, itemId) => {
    setTabs(prevTabs => prevTabs.map(tab =>
      tab.id === tabId
        ? { ...tab, items: tab.items.filter(item => item._id !== itemId) }
        : tab
    ));
  };

  const handleProductFilter = (id) => {
    if (id === null) {
      setData(originalData);
    } else {
      const filteredData = originalData.filter(item =>
        item.categoryId && item.categoryId._id === id
      );
      setData(filteredData);
    }
  };

  const handleQuantityChange = (tabId, itemId, delta) => {
    setTabs(prevTabs => prevTabs.map(tab =>
      tab.id === tabId
        ? {
          ...tab,
          items: tab.items.map(item =>
            item._id === itemId
              ? { ...item, quantity: Math.max(0, item.quantity + delta) }
              : item
          )
        }
        : tab
    ));
  };

  useEffect(() => {
    searchProducts()

  }, [searchBy])

  const searchProducts = () => {
    const regex = new RegExp(searchBy, 'i');
    setData(originalData.filter(product => regex.test(product.name)));

  }

  const billHistoryDetails = () => {

    setBillHistoryOpen(!billHistoryOpen)

  }

  return (
    <div>
      <div className="homeHorrizontalNav">
        <button onClick={handleNewBill} className='AddNewBillBtn'>+ New Bill</button>
        <button className='AddNewBillBtn' onClick={billHistoryDetails}>View Bills</button>
        <div className="searchBarOnHomePage">

          <input type="text" placeholder="Search product" onChange={(e) => { setSearchBy(e.target.value) }} />

        </div>

      </div>
      <div className="  HomeScreenMainDiv">
        <div className="row">
          <div className="col-md-1 rounded filterButtonsInHome">
            <button onClick={() => { handleProductFilter(null) }} className="btn-sm btn-small-custom">All </button>
            {AllCategory.map(category => (
              <button onClick={() => { handleProductFilter(category._id) }} className="btn-sm btn-small-custom" key={category._id}>{category.name}</button>
            ))}
          </div>
          <div className="col-md-6 rounded productsInHome">
            <div className="row">
              {data.length > 0 ? (
                data.map(product => (
                  <div key={product._id} className='col-md-2 customProductDivOnHome' onClick={() => addToCart(product)}>
                    <img className='productImageOnHomePage' src={product.image} alt="" style={{ width: '100%', height: '60%' }} />
                    <p><span>{product.name} </span> {product.price}</p>
                  </div>
                ))


              ) : (
                <h4>No Products</h4>

              )}

            </div>
          </div>
          <div className='col-md-5 rounded'>
            <div className=" billingTabsInClass" >
              <BillingTabs
                tabs={tabs}
                activeIndex={activeIndex}
                handleDeleteItemFromCart={handleDeleteItemFromCart}
                handleQuantityChange={handleQuantityChange}
                handleDeleteTab={handleDeleteTab}
                triggerMessage={triggerMessage}
                onSelect={index => setActiveIndex(index)}
              />
            </div>

          </div>

          <div>
            <BillingHistory billHistoryOpen={billHistoryOpen} billHistoryDetails={billHistoryDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
