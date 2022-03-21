/* global BigInt */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import style from "./Dashboard.module.css";
import { ethers } from "ethers";
import erc20abi from "./erc20abi.json";
import { styled } from "@mui/system";
import { Modal } from "@mui/material";
import { Button } from "@mui/material";

export default function Dashboard() {

  let { governanceAddress } = useParams();

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
  let finalArray = [];
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
    } catch (error) {}
    memberRows = Object.entries(membersObject)
    console.log(memberRows)

  };

  
  // members tables

  function createDataMembers(address, balance) {
    return { address, balance };
  }

  var memberRows = [
    createDataMembers("0x0a4A683e62d14B85fd174E5428730515a907b658", "22000"),
    createDataMembers("0x2767CD05FdC45389aDb55e016358003227CfeBA5", "34000"),
    createDataMembers("0x4281ecf07378ee595c564a59048801330f3084ee", "22000"),
    createDataMembers("0xdd08bc1127a0826bd093fdc8d584a037834f04d9", "34000"),
    createDataMembers("0x0a4A683e62d14B85fd174E5428730515a907b643", "22000"),].sort();


  const MemberRoot = styled("div")``;

  const [memberPage, setMemberPage] = React.useState(0);
  const [rowsMemberPerPage, setMemberRowsPerPage] = React.useState();

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyMemberRows =
    memberPage > 0 ? Math.max(0, (1 + memberPage) * rowsMemberPerPage - memberRows.length) : 0;


   // proposals tables

   function createDataProposal(id, title, status) {
    return { id, title, status };
  }

  var proposalRows = [
    createDataProposal(5, "Proposal to increase dao max capacity by 5", "Pending"),
    createDataProposal(4, "Proposal to sell 75% of the treasury UNI on Uniswap", "Pending"),
    createDataProposal(3, "Proposal to stake 50% of the treasury ETH with Lido", "Executed"),
    createDataProposal(2, "Proposal to use 5% of the DAO treasury to purchase MATIC", "Defeated"),
    createDataProposal(1, "Proposal to aquire a basket of DEFI tokens", "Executed"),  
  ].sort();


  const ProposalRoot = styled("div")``;

  const [proposalPage, setProposalPage] = React.useState(0);
  const [rowsProposalPerPage, setProposalRowsPerPage] = React.useState();

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyProposalRows =
    proposalPage > 0 ? Math.max(0, (1 + proposalPage) * rowsProposalPerPage - proposalRows.length) : 0;



  // on mount useEffect
  useEffect(() => {
    getTokenInfo();
    getMembers();
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
        <h3 className={style.contractAddress}>{governanceAddress}</h3>
      </div>
      <div className={style.break}></div>
      <div className={style.members}>
        <div className={style.membersHeader}>
          <span>
            <h3 className={style.contentTitles}>Members</h3>
          </span>
          <span>
            <Button className={style.memberButtons} onClick={handleOpen}>Approve Member</Button>
            <Button className={style.memberButtons} >One Time Mint</Button>
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
            <MemberRoot>
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
                  {(rowsMemberPerPage > 0
                    ? memberRows.slice(
                        memberPage * rowsMemberPerPage,
                        memberPage * rowsMemberPerPage + rowsMemberPerPage
                      )
                    : memberRows
                  ).map((row) => (
                    <tr key={row.address}>
                      <td className={style.addressTD}>{row.address}</td>
                      <td className={style.balanceTD}>{row.balance}</td>
                    </tr>
                  ))}

                  {emptyMemberRows > 0 && (
                    <tr style={{ height: 41 * emptyMemberRows }}>
                      <td colSpan={3} />
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr></tr>
                </tfoot>
              </table>
            </MemberRoot>
          </div>
        </div>
      </div>
      <div className={style.proposals}>
        <div className={style.proposalsHeader}>
          <h3 className={style.contentTitles}>Proposals</h3>
          <div className={style.membersTableDiv}>
          <Button className={style.memberButtons} >Create Proposal</Button>
            <ProposalRoot>
              <table
                className={style.membersTable}
                aria-label="custom pagination table"
              >
                <thead>
                  <tr>
                    <th className={style.membersTH}>
                      ID
                    </th>
                    <th className={style.membersTH}>
                      Proposal Title
                    </th>
                    <th className={style.membersTH}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(rowsProposalPerPage > 0
                    ? proposalRows.slice(
                        proposalPage * rowsProposalPerPage,
                        proposalPage * rowsProposalPerPage + rowsProposalPerPage
                      )
                    : proposalRows
                  ).map((row) => (
                    <tr key={row.address}>
                      <td className={style.addressTD}>{row.id}</td>
                      <td className={style.balanceTD}>{row.title}</td>
                      <td className={style.balanceTD}>{row.status}</td>
                    </tr>
                  ))}

                  {emptyProposalRows > 0 && (
                    <tr style={{ height: 41 * emptyProposalRows }}>
                      <td colSpan={3} />
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr></tr>
                </tfoot>
              </table>
            </ProposalRoot>
          </div>
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
