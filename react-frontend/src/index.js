import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MembersTable from './components/membersTable';
import NewProposals from './components/NewProposals';
import { StyledEngineProvider } from '@mui/material/styles';

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <MembersTable />
    <NewProposals />
  </StyledEngineProvider>,
  document.getElementById('root')
);

