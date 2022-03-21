import React, { useState, useEffect } from "react";
import { Outlet } from 'react-router-dom';
import style from "./tokenForm.module.css";
import { ethers } from "ethers";
import axios from "axios";
import { instance } from "../../utils/axiosConfig";

const   DaoForm = (props) => {
  const form = React.createRef();
  const { userAddress, currentDao, setCurrentDao } = props;

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    document.getElementById('owner').value = userAddress;

    form.current.addEventListener('submit', async(ev) => {
      if (!isLoading) {
        setLoading(true);
        console.log('creating dao');
        ev.preventDefault();
        
        const owner = document.getElementById('owner').value;
        const tSymbol = document.getElementById('tokenSymbol').value;
        const dCap = document.getElementById('daoCap').value;
        const vQuorum = document.getElementById('quorum').value;
        const tTotalSupply = document.getElementById('totalTokenSupply').value;
        

        const res = await axios.post("/server/create", {
          owner,
          tName,
          tSymbol,
          dCap,
          vQuorum,
          tTotalSupply
        });

        if (res.status === 200) {
          alert('DAO created');
          setLoading(false);
          setCurrentDao(res.data);
          // location.pathname = '/dao/' + res.data.contractAddress;
        }
      }
    });
  }, [isLoading]);

  return (
    <form method="post" ref={form} className={style.form}>
      <h1 className={style.heading}>Create DAO</h1>
      <p className={style.para}>Customise your token variables below</p>
      <input
        className={style.input}
        type="text"
        placeholder="Owner/your address"
        controlId="owner"
      />
      <input
        className={style.input}
        type="text"
        placeholder="Dao Name"
        controlId="tokenName"
      />
      <input
        className={style.input}
        type="text"
        placeholder="Symbol e.g. ABC"
        controlId="tokenSymbol"
      />
      <input
        className={style.input}
        type="number"
        placeholder="DAO Max Capacity"
        controlId="daoCap"
      />
      <label className={style.label}>
        Total supply of token
        <select
          className={style.input}
          controlId="totalTokenSupply"
        >
          <option value="10000">10,000</option>
          <option value="100000">100,000</option>
          <option value="1000000">1,000,000</option>
        </select>
      </label>
      <label className={style.label}>
        Minimum % of members required per vote
      <input
        className={style.input}
        type="number"
        placeholder="Members quorum in %"
        controlId="quorum"
      />
      </label>
      <input className={style.input} type="submit" />
    </form>
  );
}

export default DaoForm;