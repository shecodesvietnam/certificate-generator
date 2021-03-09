import React, { Component } from "react";
import { Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className="container mt-2">
        <h1>Please choose your action!</h1>
        <div>
          <Link to="/generate" className="mr-5">
            Generate Certificates
          </Link>
          <Link to="/send-email">Generate Certificates and Send Emails</Link>
        </div>
      </div>
    );
  }
}
export default App;
