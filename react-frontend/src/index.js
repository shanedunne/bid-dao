import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MembersTable from './components/membersTable';
import NewProposals from './components/NewProposals';
import TokenForm from './components/tokenForm/tokenForm';
import GovernanceForm from './components/governanceForm/governanceForm';
import { StyledEngineProvider } from '@mui/material/styles';

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <App />
  </StyledEngineProvider>,
  document.getElementById('root')
);

