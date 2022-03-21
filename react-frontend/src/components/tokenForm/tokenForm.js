import React, { useState } from "react";
import style from "./tokenForm.module.css";
import { ethers } from "ethers";
import axios from "axios";
import { instance } from "../../utils/axiosConfig";

// for setting the parameters on the token deploy call
var daoOwner, tName, tSymbol, dCap, tTotalSupply;
// set the addresses received after the contracts are deployed

const TokenForm = (props) => {

  const { userAddress, currentDao, setCurrentDao } = props;

  

  const [form, setForm] = useState({
    owner: "",
    tokenName: "",
    tokenSymbol: "",
    daoCap: "",
    totalTokenSupply: "",
  });

  /*
  async function getOwner() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    owner = await signer.getAddress();
  }
  */

  

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // getOwner();

    daoOwner = e.target.owner.value;
    tName = e.target.tokenName.value;
    tSymbol = e.target.tokenSymbol.value;
    dCap = e.target.daoCap.value;
    tTotalSupply = e.target.totalTokenSupply.value;

    const res = await axios.post("/server/generate-dao", {
      daoOwner,
      tName,
      tSymbol,
      dCap,
      tTotalSupply
    }).then (result => {
      console.log(result)
    })
    /*
    if (res.status === 200) {
      alert('DAO created');
      setCurrentDao(res.data);
      location.pathname = '/dao/' + res.data.governanceContract;
    }
    */
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      <h1 className={style.heading}>Create DAO</h1>
      <p className={style.para}>Customise your token variables below</p>
      <input
        className={style.input}
        type="text"
        placeholder="Admin Address"
        name="owner"
        value={form.owner}
        onChange={handleInputChange}
      />
      <input
        className={style.input}
        type="text"
        placeholder="Dao Name"
        name="tokenName"
        value={form.tokenName}
        onChange={handleInputChange}
      />
      <input
        className={style.input}
        type="text"
        placeholder="Symbol e.g. ABC"
        name="tokenSymbol"
        value={form.tokenSymbol}
        onChange={handleInputChange}
      />
      <input
        className={style.input}
        type="number"
        placeholder="DAO Max Capacity"
        name="daoCap"
        value={form.daoCap}
        onChange={handleInputChange}
      />
      <label className={style.label}>
        Total supply of token
        <select
          className={style.input}
          name="totalTokenSupply"
          value={form.totalTokenSupply}
          onChange={handleInputChange}
        >
          <option value="10000">10,000</option>
          <option value="100000">100,000</option>
          <option value="1000000">1,000,000</option>
        </select>
      </label>
      <input className={style.input} type="submit" />
    </form>
  );
}

export default TokenForm;