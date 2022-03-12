## To Do

### Smart Contracts
##### Token
Make token non transferable
Add even split of balance function based on token holdings

##### Deployment
Deploy once off Collection contract
Deploy token and timelock contracts from onSubmit on token form
Deploy governance contract after plugging in address of token and timelock contracts. This should also be done from an onSubmit of the governance contract


### Frontend
Find a way to check for DAOs/Tokens associated with address. This could be done by adding each token address to an array or maybe using IPFS
Order of Display of Components:
- Connect Wallet with logo + Bid Dao info
- If connected, display a page showing DAOs or create DAO button
- Mint token page
- Governance customisation page
- Dao Dashboard
- - DAO Name
- - Create Proposal button
- - Add members button
- - Members list with balances of DAO token
- - DAOs asset lists
- - Proposal list
- Proposals
- - Be able to click into Proposal and read what it is and then vote