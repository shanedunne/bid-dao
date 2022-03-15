/* global BigInt */
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import style from "./Dashboard.module.css";
import Icon from "@mui/material/Icon";
import { ethers } from "ethers";
import erc20abi from "./erc20abi.json";
import { styled } from "@mui/system";
import { Modal } from "@mui/material";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";

export default function Dashboard() {
  const contractAddress = "0xEbB5967119030791FC3f1022C4D1A0c9514d56dF";
  const [contractInfo, setContractInfo] = useState({
    displayName: "",
    tokenSymbol: "",
    totalSupply: "",
    getSpacesLeft: "",
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  var erc20 = new ethers.Contract(contractAddress, erc20abi, provider);

  const getTokenInfo = async () => {
    try {
      const displayName = await erc20.name();
      const tokenSymbol = await erc20.symbol();
      const totalSupply = await erc20.totalSupply();
      var getSpacesLeft = await erc20.spacesLeft()
    
      getSpacesLeft = parseInt(getSpacesLeft);


      setContractInfo({
        displayName,
        tokenSymbol,
        totalSupply,
        getSpacesLeft
      });
    } catch (error) {
      console.error(error);
    }
  };
  let membersObject = {};
  let membersArray = [];
  let balancesArray = [];
  const getMembers = async () => {
    try {
      const members = await erc20.getMembersArray();
      // create js members array
      for (let i = 0; i < members.length; i++) {
        membersArray.push(members[i]);
      }


      // create balances array as per membersArray

      for (let i = 0; i < membersArray.length; i++) {
        let addressBalance = await erc20.balanceOf(membersArray[i]);
        let hex = addressBalance._hex;
        if (hex.length % 2) {
          hex = "0" + hex;
        }

        var bn = BigInt(hex);

        var d = bn.toString(10);
        var balance = d.slice(0, 5);
        balancesArray.push(balance);
      }
      // assign balance to the corresponding address
      membersArray.forEach((el, i) => {
        membersObject[el] = balancesArray[i];
      });
      console.table(membersObject);
    } catch (error) {}
  };

  function createData(address, balance) {
    return { address, balance };
  }

  const rows = [
    createData("0x0a4A683e62d14B85fd174E5428730515a907b658", "22000"),
    createData("0x2767CD05FdC45389aDb55e016358003227CfeBA5", "34000"),
    createData("0x0a4A683e62d14B85fd174E5428730515a907b448", "22000"),
    createData("0x2767CD05FdC45389aDb55e016358003227CfeB12", "34000"),
    createData("0x0a4A683e62d14B85fd174E5428730515a907b643", "22000"),
    createData("0x2767CD05FdC45389aDb55e016358003227CfeB678", "34000"),
    createData("0x0a4A683e62d14B85fd174E5428730515a907b65h56", "22000"),
    createData("0x2767CD05FdC45389aDb55e016358003227CfeB667", "34000"),
  ].sort();

  function dataRows() {
    for (let i = 0; i <= membersArray.length; i++) {
      for (let j = 0; j <= balancesArray.length; j++) {
        rows.push(createData(membersArray[i], balancesArray[j]));
      }
    }
  }

  // for (const [key, value] of Object.entries(membersObject)) {
  // rows.push(createData(`${key}, ${value}`));
  // }

  const Root = styled("div")``;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState();

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // on mount useEffect
  useEffect(() => {
    getTokenInfo();
    getMembers();
    dataRows();
  }, []);

  // approve member
  // modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // approve member form
  const [amForm, setAMForm] = useState({
    amAddress: '',
  });

  const handleAMChange = (e) => {
    setAMForm({ ...amForm, [e.target.name]: e.target.value });
  };


  const amSubmit = async (e) => {
    e.preventDefault();
    const submitAddress = e.target.amAddress.value;
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    erc20 = new ethers.Contract(contractAddress, erc20abi, signer);
    await erc20.addMembersToApprovedList(submitAddress)
  }

  return (
    <div className={style.dashboardDiv}>
      <div className={style.nameDiv}>
        <h1 className={style.daoName}>{contractInfo.displayName}</h1>
        <h3 className={style.contractAddress}>{contractAddress}</h3>
      </div>
      <div className={style.break}></div>
      <div className={style.members}>
        <div className={style.membersHeader}>
          <span>
            <h3 className={style.contentTitles}>Members</h3>
          </span>
          <span>
            <Button onClick={handleOpen}>Approve Member</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className={style.approveMemberModal}>
                <h2 className={style.amModalTitle}>
                    Add Members to Approved List
                </h2>
                <p className={style.amModalP}>Functionality only available to the contract deployer</p>
                <p className={style.amModalPSpaces}>Spaces left: {contractInfo.getSpacesLeft}</p>
                <div >
                <form className={style.amFormDiv} onSubmit={amSubmit}>
                    <input className={style.amAddress} type="text" name="amAddress" value={amForm.amAddress} onChange={handleAMChange} />
                    <input className={style.amAddress} type="submit" />
                </form>
                </div>
              </Box>
            </Modal>
          </span>
          <div className={style.membersTableDiv}>
            <Root>
              <table
                className={style.membersTable}
                aria-label="custom pagination table"
              >
                <thead>
                  <tr>
                    <th className={style.membersTH}>
                      {contractInfo.displayName} Members
                    </th>
                    <th className={style.membersTH}>
                      {contractInfo.tokenSymbol}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(rowsPerPage > 0
                    ? rows.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : rows
                  ).map((row) => (
                    <tr key={row.address}>
                      <td className={style.addressTD}>{row.address}</td>
                      <td className={style.balanceTD}>{row.balance}</td>
                    </tr>
                  ))}

                  {emptyRows > 0 && (
                    <tr style={{ height: 41 * emptyRows }}>
                      <td colSpan={3} />
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr></tr>
                </tfoot>
              </table>
            </Root>
          </div>
        </div>
      </div>
      <div className={style.proposals}>
        <div className={style.proposalsHeader}>
          <h3 className={style.contentTitles}>Proposals</h3>

          <div className={style.proposalDetails}>
            <span className={style.proposalId}></span>
            <span className={style.proposalTitle}></span>
            <span className={style.proposalStatus}></span>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
