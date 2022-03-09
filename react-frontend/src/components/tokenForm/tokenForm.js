import React from 'react';
import { useForm } from 'react-hook-form';

import "./styles.css";

export default function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);
  console.log(errors);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Mint DAO Token</h1>
      <p>Customise your token variables below</p>
      <input type="text" placeholder="Token Name" {...register("Token Name", {required: true, maxLength: 60})} />
      <input type="text" placeholder="Symbol e.g. ABC" {...register("Symbol e.g. ABC", {required: true, maxLength: 6})} />
      <input type="number" placeholder="DAO Max Capacity" {...register("DAO Max Capacity", {required: true, maxLength: 4})} />
      <input type="number" placeholder="Minimum Investment Limit (ETH)" {...register("Minimum Investment Limit (ETH)", {required: true, maxLength: 2})} />
      <input type="number" placeholder="Maximum Investment Limit (ETH)" {...register("Maximum Investment Limit (ETH)", {required: true, maxLength: 2})} />
      <label htmlFor="lastName">Tokens per 1 ETH</label>
      <select {...register("Mint Rate (per ETH)", { required: true })}>
        <option value="1000">1,000</option>
        <option value="10000">10,000</option>
        <option value="100000">100,000</option>
      </select>

      <input type="submit" />
    </form>
  );
}