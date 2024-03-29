/* global BigInt */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import style from "./Dashboard.module.css";
import { ethers } from "ethers";
import erc20abi from "./erc20abi.json";
import governanceAbi from "./governanceAbi.json"
import { styled } from "@mui/system";
import { Modal } from "@mui/material";
import { Button } from "@mui/material";
import { instance } from "../../utils/axiosConfig";
import ProposalForm from "./Proposal";

 const Dashboard = props => {

  let { governanceAddress } = useParams();
  

  const [daoInfo, setDaoInfo] = useState([])

  
  const getDaoData = () => {
    instance.get('/dao-info/governanceAddress/' + governanceAddress)
    .then(res =>  { 
      console.log(res.data[0]);
      setDaoInfo(res.data[0]);
      console.log(daoInfo)
    })
    .catch(error => console.log(error))
  }

  const contractAddress = daoInfo.tokenAddress;
  const [contractInfo, setContractInfo] = useState({
    displayName: "",
    tokenSymbol: "",
    totalSupply: "",
    getSpacesLeft: "",
  });

  const [membersInfo, setMembersInfo] = useState({
    memInfo: []
  });

  var provider;
  var erc20;
  

  const getTokenInfo = async () => {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    erc20 = new ethers.Contract(contractAddress, erc20abi, provider);
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
        for (let j = 0; j < membersArray.length; j++) {
          let addressBalance = await erc20.balanceOf(membersArray[j]);
          let hex = addressBalance._hex;
          if (hex.length % 2) {
            hex = "0" + hex;
          }
  
          var bn = BigInt(hex);
  
          var d = bn.toString(10);
          var addBalance = d.slice(0, 5);
          balancesArray.push(addBalance);
          finalArray.push({
            address: members[i],
            balance: addBalance
          })
        }
      }


      // create balances array as per membersArray

      
      // assign balance to the corresponding address
      membersArray.forEach((el, i) => {
        membersObject[el] = balancesArray[i];
      });
    } catch (error) {}
    memberRows = Object.entries(membersObject)
    setMembersInfo({
      ...membersInfo, memInfo: memberRows
    })

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
    getDaoData();
    
  }, []);

  useEffect(() => {
    getTokenInfo();
    getMembers();
  }, [getDaoData]);

  // approve member
  // approvel member modal
  const [AMopen, AMsetOpen] = React.useState(false);
  const AMhandleOpen = () => AMsetOpen(true);
  const AMhandleClose = () => AMsetOpen(false);

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
  // create proposal
  // create proposal modal
  const [CPopen, CPsetOpen] = React.useState(false);
  const CPhandleOpen = () => CPsetOpen(true);
  const CPhandleClose = () => CPsetOpen(false);

  // create proposal form
  const [CPForm, setCPForm] = useState({
    targets: [],
    values: [],
    signatures: [],
    calldata: [],
    description: ''
  });

  const handleCPChange = (e) => {
    setCPForm({ ...CPForm, [e.target.name]: e.target.value });
  };


  const CPSubmit = async (e) => {
    e.preventDefault();
    const targets = e.target.targets.value;
    const values = e.target.values.value;
    const signatures = e.target.signatures.value;
    const calldata = e.target.calldata.value;
    const description = e.target.description.value;

    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const gov = new ethers.Contract(daoInfo.governanceAddress, governanceAbi, signer);
    const tx = await gov.propose(targets, values, signatures, calldata, description)
    await tx.wait();
    
  }

  if(daoInfo === undefined) {
    return <h1>Still Loading...</h1>
  }
  return (
    <div className={style.dashboardDiv}>
      <div className={style.nameDiv}>
        <h1 className={style.daoName}>{daoInfo.tokenName}</h1>
        <h3 className={style.contractAddress}>{governanceAddress}</h3>
      </div>
      <div className={style.break}></div>
      <div className={style.members}>
        <div className={style.membersHeader}>
          <span>
            <h3 className={style.contentTitles}>Members</h3>
          </span>
          <span>
            <Button className={style.memberButtons} onClick={AMhandleOpen}>
              Approve Member
            </Button>
            <Button className={style.memberButtons}>One Time Mint</Button>
            <Modal
              open={AMopen}
              onClose={AMhandleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className={style.approveMemberModal}>
                <h2 className={style.amModalTitle}>
                  Add Members to Approved List
                </h2>
                <p className={style.amModalP}>
                  Functionality only available to the contract deployer
                </p>
                <p className={style.amModalPSpaces}>
                  Spaces left: {contractInfo.getSpacesLeft}
                </p>
                <div>
                  <form className={style.amFormDiv} onSubmit={amSubmit}>
                    <input
                      className={style.amAddress}
                      type="text"
                      name="amAddress"
                      value={amForm.amAddress}
                      onChange={handleAMChange}
                    />
                    <input className={style.input} type="submit" />
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
            <Button className={style.memberButtons} onClick={CPhandleOpen}>
              Create Proposal
            </Button>
            <Modal
              open={CPopen}
              onClose={CPhandleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className={style.createProposalModal}>
                <h2 className={style.amModalTitle}>Create Dao Proposal</h2>
                <p className={style.amModalP}>
                  Create proposals for your DAO's next move below!
                </p>
                <div>
                  <form className={style.amFormDiv} onSubmit={CPSubmit}>
                    <input
                      className={style.CPinput}
                      type="text"
                      placeholder="List of Target Addresses"
                      name="targets"
                      value={CPForm.targets}
                      onChange={handleCPChange}
                    />
                    <input
                      className={style.CPinput}
                      type="text"
                      placeholder="Values (i.e. msg.value) to be sent"
                      name="values"
                      value={CPForm.values}
                      onChange={handleCPChange}
                    />
                    <input
                      className={style.CPinput}
                      type="text"
                      placeholder="Signatures required"
                      name="signatures"
                      value={CPForm.signatures}
                      onChange={handleCPChange}
                    />
                    <input
                      className={style.CPinput}
                      type="text"
                      placeholder="Calldata i.e. function calls from Box contract"
                      name="calldata"
                      value={CPForm.calldata}
                      onChange={handleCPChange}
                    />
                    <textarea
                      className={style.textarea}
                      placeholder="Description of the proposal"
                      name="description"
                      value={CPForm.description}
                      onChange={handleCPChange}
                    />
                    <input className={style.amAddress} type="submit" />
                  </form>
                </div>
              </Box>
            </Modal>
            <ProposalRoot>
              <table
                className={style.membersTable}
                aria-label="custom pagination table"
              >
                <thead>
                  <tr>
                    <th className={style.membersTH}>ID</th>
                    <th className={style.membersTH}>Proposal Title</th>
                    <th className={style.membersTH}>Status</th>
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
export default Dashboard;