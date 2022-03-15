import { Component } from "react";
import styles from "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import TokenForm from './components/tokenForm/tokenForm';
import GovernanceForm from './components/governanceForm/governanceForm';
import MembersTable from './components/membersTable';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard'

// import firebase from "firebase/compat/app";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <TokenForm />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;