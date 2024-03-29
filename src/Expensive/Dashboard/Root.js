import React from "react";
import {AreaChart} from "react-chartkick";
import Topfigure from "Expensive/Dashboard/Root/Topfigure";
import ShortExpenseList from "Expensive/Dashboard/Root/ShortExpenseList";
import ShortReportList from "Expensive/Dashboard/Root/ShortReportList";
import Spinner from "Expensive/Spinner";
import Failure from "Expensive/Dashboard/Failure";

import {authentication} from "Expensive/authentication";

export default class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = { which: "loading" };
  }

  get shouldLoadAll() { return !!this.props.location.query.all; }
  componentWillMount() { this._loadData(); }
  componentWillReceiveProps(nextProps) {
    const all = !!nextProps.location.query.all;
    if(all != this.shouldLoadAll) {
      this._loadData(all);
    }
  }

  render() {
    return (
      <div className="action-dashboard-root">
        {this.state.which == "loading" ? <Spinner /> :
        this.state.which == "failed" ? <Failure /> :
        this.renderNormal()}
      </div>
    );
  }

  renderNormal() {
    return (
      <div>
        <Topfigure data={this.state.topfigure} />
        <div className="dashboard-graph">
          <AreaChart data={this.state.graph} colors={["#f7efce"]}
            library={{chart: {backgroundColor: "#327ccb"},
              xAxis: {labels: {style: {color: "#f7efce"}}},
              yAxis: {labels: {style: {color: "#f7efce"}}}}}/>
        </div>
        <div className="dashboard-expenses">
          <h1 className="dashboard-expenses-title">Recent Expenses</h1>
          <ShortExpenseList data={this.state.expenses} />
        </div>

        <div className="dashboard-reports">
          <h1 className="dashboard-reports-title">Recent Reports</h1>
          <ShortReportList data={this.state.reports} />
        </div>

      </div>
    );
  }

  _loadData(shouldLoadAll = this.shouldLoadAll) {
    const all = shouldLoadAll ? "?all=true" : "";
    authentication
      .performAuthorizedGet(`/api/dashboard.json${all}`)
      .then(({data: result}) => {
        this.setState({
          which: "normal",
          topfigure: result.data.topfigure,
          expenses: result.data.expenses,
          reports: result.data.reports,
          graph: result.data.graph
        });
      })
      .catch((...a) => {
        this.setState({ which: "failed" });
        return Promise.reject(...a);
      });
  }
}

Root.propTypes = {
  location: React.PropTypes.object.isRequired
}
