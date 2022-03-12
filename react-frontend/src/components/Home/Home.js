import React from "react";
import style from './Home.module.css';

export default function Home() {

    return(
        <div className="home">
            <div className={style.homeDiv}>
                <h1 className={style.heading}>Welcome to Bid Dao</h1>
                <p className={style.para}><strong>Bid Dao</strong> is a DAO generating platform modeled to provide closed door DAOs to a group of friends or other organisations. Users can quickly mint a custom ERC20 and define governance conditions witout writing any code</p>
                    <div className={style.homeOptions}>
                        <button className={style.createDAO}>Create a DAO</button>
                        <p className={style.para}>OR</p>
                        <div className={style.listDiv}>
                            <ul className={style.list}>
                                <li className={style.listItem}><span className={style.daoName}>Test DAO</span><span className={style.daoSymbol}>TEST</span></li>
                                <li className={style.listItem}><span className={style.daoName}>Test DAO</span><span className={style.daoSymbol}>TEST</span></li>
                                <li className={style.listItem}><span className={style.daoName}>Test DAO</span><span className={style.daoSymbol}>TEST</span></li>
                            </ul>
                        </div>
                    </div>
            </div>
        </div>
    )
};