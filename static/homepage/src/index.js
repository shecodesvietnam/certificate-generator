import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "./index.css";

import Homepage from "./components/Homepage";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/generate" component={Homepage} />
        <Route exact path="/send-email" component={Homepage} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
