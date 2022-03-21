import './db-config.js';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const Dao = mongoose.model('Dao');
  const daoList = await Dao.find();
  // console.log(daoList);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.send(daoList);
}