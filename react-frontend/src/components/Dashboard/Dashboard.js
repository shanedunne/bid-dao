/* global BigInt */
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import style from './Dashboard.module.css';
import Icon from '@mui/material/Icon';
import { ethers } from "ethers";
import erc20abi from "./erc20abi.json";
import { async } from 'ethereum-react-components';




export default function Dashboard() {

    const contractAddress = "0x7471628e6A3498bF3935B1B88726234969A833Ec";
    const [contractInfo, setContractInfo] = useState({
        displayName: "-",
        tokenSymbol: "-",
        totalSupply: "-"
      });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const erc20 = new ethers.Contract(
        contractAddress,
        erc20abi,
        provider
      );
    
    const getTokenInfo = async () => {
        try {
            const displayName = await erc20.name();
            const tokenSymbol = await erc20.symbol();
            const totalSupply = await erc20.totalSupply();

            setContractInfo({
                displayName,
                tokenSymbol,
                totalSupply,
            })
        } catch (error) {
            console.error(error);
        }
    }

    const getMembers = async () => {
        let membersObject = {};
        try {
            const members = await erc20.getMembersArray();
            // create js members array
            let membersArray = [];
            for(let i = 0; i < members.length; i++){
                membersArray.push(members[i])
            }

            // create balances array as per membersArray
            let balancesArray = []
            for(let i = 0; i < membersArray.length; i++){
                let addressBalance = await erc20.balanceOf(membersArray[i]);
                let hex = addressBalance._hex
                if (hex.length % 2) { hex = '0' + hex; }

                var bn = BigInt(hex);

                var d = bn.toString(10);
                var balance = d.slice(0, 5)
                balancesArray.push(balance)
            }
            // assign balance to the corresponding address
            membersArray.forEach((el, i) => {
                membersObject[el] = balancesArray[i];
            })
            console.log(membersObject)
        } catch (error) {

        }
    }
    
    // on mount useEffect
    useEffect(() => {
        
        getTokenInfo()
        getMembers();
    }, []);
    
    

    
    return (
    <div className={style.dashboardDiv}>
        <div className={style.nameDiv}>
            <h1 className={style.daoName}>{contractInfo.displayName}</h1>
            <h3 className={style.contractAddress}>{contractAddress}</h3>
        </div>
        <div className={style.break}>
        </div>
        <div className={style.members}>
            <div className={style.membersHeader}>
                <h3 className={style.contentTitles}>
                    Members
                </h3>
            </div>
        </div>
        <div className={style.proposals}>
            <div className={style.proposalsHeader}>
                <h3 className={style.contentTitles}>
                    Proposals
                </h3>
                <div className={style.proposalDetails}>
                    <span className={style.proposalId}></span>
                    <span className={style.proposalTitle}></span>
                    <span className={style.proposalStatus}></span>
                </div>
            </div>

        </div>
    </div>
  );
}
