import React from 'react'
import './navbar.css'
import logo from '../../assets/logo.png'

function Navbar({setActiveComponent}) {

   
  return (
    <div>
      <div className="navBox">
        <div className="navBoxLeft">
            <div><img src={logo} alt="" className='logo' /></div>
            <div className="navBtn" onClick={(e)=>{setActiveComponent('Component1')}} >Billing</div>
            <div className="navBtn" onClick={(e)=>{setActiveComponent('Component2')}}>Category</div>
            <div className="navBtn" onClick={(e)=>{setActiveComponent('Component3')}}>Products</div>
            <div className="navBtn" onClick={(e)=>{setActiveComponent('Component4')}}>About</div>
            <div className="navBtn" onClick={(e)=>{setActiveComponent('allbills')}}>All Bills</div>
            
        </div>
      </div>
    </div>
  )
}

export default Navbar
