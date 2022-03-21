import React, {useState, useEffect} from "react";
import style from './Home.module.css';
import { Link } from 'react-router-dom';
import { instance } from "../../utils/axiosConfig";
import axios from "axios";

const Home = props => {

    const { setCurrentDao } = props;
    const [daoList, setDaoList] = useState([]);

    
   
    useEffect(() => {
        instance.get('/daos')
        .then(res => setDaoList(res.data))
        .then(console.log(daoList))
        .catch(error => console.log(error))
    }, [])

    
    const content = daoList.map((dao) => (
        <Link
          to={`/dashboard/${dao.governanceAddress}`}
          onClick={() => setCurrentDao(dao)} className={style.daoLink}
        >
          <h4 className={style.daoName}>{dao.tokenName}</h4>
        </Link>
    ));

    return(
        <div className="home">
            <div className={style.homeDiv}>
                <h1 className={style.heading}>Welcome to Bid Dao</h1>
                <p className={style.para}><strong>Bid Dao</strong> is a DAO generating platform modeled to provide closed door DAOs to a group of friends or other organisations. Users can quickly mint a custom ERC20 and deploy governance contracts without writing any code</p>
                    <div className={style.homeOptions}>
                        <Link to="/create">
                        <button className={style.createDAO} >Create a DAO</button>
                        </Link>
                        <p className={style.para}>OR</p>
                        <div className={style.listDiv}>
                            {content}
                        </div>
                    </div>
            </div>
        </div>
    )
};

export default Home;