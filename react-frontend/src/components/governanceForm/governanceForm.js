import React, {useState} from 'react';
import style from "./governanceForm.module.css";


export default function GovernanceForm() {
  const [form, setForm] = useState({
      voteDelay: '',
      votePeriod: '',
      quorumPercent: '',
    });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const vDelay = e.target.voteDelay.value;
    const vPeriod = e.target.votePeriod.value;
    const qPercent = e.target.quorumPercent.value;

    console.log(vDelay, vPeriod, qPercent);
  }
    return (
      <form onSubmit={handleSubmit} className={style.form}>
      <h1 className={style.heading}>Mint DAO Token</h1>
      <p className={style.para}>Customise your token variables below</p>
      <input className={style.input} type="number" placeholder="Vote Delay (in hours)" name="voteDelay" value={form.voteDelay} onChange={handleInputChange}/>
      <input className={style.input} type="number" placeholder="Vote Period (in days)" name="votePeriod" value={form.votePeriod} onChange={handleInputChange}/>
      <input className={style.input} type="number" placeholder="Percentage of Votes Required (e.g. 50)" name="quorumPercent" value={form.quorumPercent} onChange={handleInputChange}/>
      <input className={style.input} type="submit">SUBMIT</input>
      </form>
    );
}