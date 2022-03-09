import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MembersTable from './components/membersTable';
import NewProposals from './components/NewProposals';
import TokenForm from './components/tokenForm/tokenForm';
import { StyledEngineProvider } from '@mui/material/styles';

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <TokenForm />
  </StyledEngineProvider>,
  document.getElementById('root')
);

