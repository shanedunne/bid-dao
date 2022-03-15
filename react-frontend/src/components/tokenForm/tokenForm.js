import React, { useState } from "react";
import style from "./tokenForm.module.css";
import { ethers } from "ethers";
import axiosConfig from "../../utils/axiosConfig"

// for setting the parameters on the token deploy call
var owner, tName, tSymbol, dCap, mnEth, mxEth, mRate;
// set the addresses received after the contracts are deployed

export default function TokenForm() {
  const [form, setForm] = useState({
    tokenName: "",
    tokenSymbol: "",
    daoCap: "",
    minEth: "",
    maxEth: "",
    mintRate: "1000",
  });

  async function getOwner() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    owner = await signer.getAddress();
  }

  

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    getOwner();
    console.log(owner)

    tName = e.target.tokenName.value;
    tSymbol = e.target.tokenSymbol.value;
    dCap = e.target.daoCap.value;
    mnEth = e.target.minEth.value;
    mxEth = e.target.maxEth.value;
    mRate = e.target.mintRate.value;

    const res = await axiosConfig.post("server/generate-token/", {
      owner,
      tName,
      tSymbol,
      dCap,
      mnEth,
      mxEth,
      mRate,
    });
    if (res.status === 200) {
      alert("DAO created");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      <h1 className={style.heading}>Mint DAO Token</h1>
      <p className={style.para}>Customise your token variables below</p>
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
      <input
        className={style.input}
        type="number"
        placeholder="Minimum Investment Limit (ETH)"
        name="minEth"
        value={form.minEth}
        onChange={handleInputChange}
      />
      <input
        className={style.input}
        type="number"
        placeholder="Maximum Investment Limit (ETH)"
        name="maxEth"
        value={form.maxEth}
        onChange={handleInputChange}
      />
      <label className={style.label}>
        Tokens per 1 ETH
        <select
          className={style.input}
          name="mintRate"
          value={form.mintRate}
          onChange={handleInputChange}
        >
          <option value="1000">1,000</option>
          <option value="10000">10,000</option>
          <option value="100000">100,000</option>
        </select>
      </label>
      <input className={style.input} type="submit" />
    </form>
  );
}
