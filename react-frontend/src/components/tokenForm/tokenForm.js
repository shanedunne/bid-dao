import React, {useState} from 'react';
import style from "./tokenForm.module.css";

// for setting the parameters on the token deploy call
var dName, tName, tSymbol, dCap, mnEth, mxEth, mRate;
// set the addresses received after the contracts are deployed
var tokenAddress, timelockAddress

export default function TokenForm() {
  const [form, setForm] = useState({
    daoName: '',
    tokenName: '',
    tokenSymbol: '',
    daoCap: '',
    minEth: '',
    maxEth: '',
    mintRate: '1000',
  });
    
    
  

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dName = e.target.daoName.value;
    const tName = e.target.tokenName.value;
    const tSymbol = e.target.tokenSymbol.value;
    const dCap = e.target.daoCap.value;
    const mnEth = e.target.minEth.value;
    const mxEth = e.target.maxEth.value;
    const mRate = e.target.mintRate.value;
    console.log(dName, tName, tSymbol, dCap, mnEth, mxEth, mRate)

    
  }
  /*
  async function callDeployScript(){
    deployToken(dName, tName, tSymbol, dCap, mnEth, mxEth, mRate)
    console.log(token.address)
  }
  */

  
    return (
      <form onSubmit={handleSubmit} className={style.form}>
      <h1 className={style.heading}>Mint DAO Token</h1>
      <p className={style.para}>Customise your token variables below</p>
      <input className={style.input} type="text" placeholder="DAO Name" name="daoName" value={form.daoName} onChange={handleInputChange}/>
      <input className={style.input} type="text" placeholder="Token Name" name="tokenName" value={form.tokenName} onChange={handleInputChange}/>
      <input className={style.input} type="text" placeholder="Symbol e.g. ABC" name="tokenSymbol" value={form.tokenSymbol} onChange={handleInputChange}/>
      <input className={style.input} type="number" placeholder="DAO Max Capacity" name="daoCap" value={form.daoCap} onChange={handleInputChange}/>
      <input className={style.input} type="number" placeholder="Minimum Investment Limit (ETH)" name="minEth" value={form.minEth} onChange={handleInputChange}/>
      <input className={style.input} type="number" placeholder="Maximum Investment Limit (ETH)" name="maxEth" value={form.maxEth} onChange={handleInputChange}/>
      <label className={style.label}>Tokens per 1 ETH
        <select className={style.input} name="mintRate" value={form.mintRate} onChange={handleInputChange}>
          <option value="1000">1,000</option>
          <option value="10000">10,000</option>
          <option value="100000">100,000</option>
        </select>
      </label>
      <input className={style.input} type="submit" />
      </form>
    );
  

  
}
