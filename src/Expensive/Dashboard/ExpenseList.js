import React from "react";
import Spinner from "Expensive/Spinner";
import Failure from "Expensive/Dashboard/Failure";
import Pagination from "Expensive/Dashboard/Pagination";
import Expense from "Expensive/Dashboard/ExpenseList/Expense";
import NewExpense from "Expensive/Dashboard/ExpenseList/NewExpense";
import {authentication} from "Expensive/authentication";

export default class ExpenseList extends React.Component {
  constructor(props) {
    super(props);

    const page = _.toInteger(this.props.location.query.page || "1");

    this.state = { which: "loading", page };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  get shouldLoadAll() { return !!this.props.location.query.all; }
  componentWillMount() { this._loadData(); }

  componentWillReceiveProps(nextProps) {
    const all = !!nextProps.location.query.all;
    if(all != this.shouldLoadAll) {
      this._loadData(this.state.page, all);
    }
  }

  handleChangePage(event, page) {
    this.props.router.push(`/dashboard/expenses?page=${page}`);
    this.setState({ page });
    this._loadData(page);
  }

  handleRefresh() {
    this._loadData();
  }

  render() {
    return (<div>{
        this.state.which == "loading" ? <Spinner /> :
          this.state.which == "failed" ? <Failure /> :
          this.renderNormal()}
      </div>);
  }

  renderNormal() {
    return (
      <div className="dashboard-expense-list">
        <Pagination pages={this.state.pages} page={this.state.page}
          onChangePage={this.handleChangePage} />
        <NewExpense onRefresh={this.handleRefresh} />
        {_.map(this.state.expenses, (e) => {
          return (<Expense key={e.id} data={e} onRefresh={this.handleRefresh} />);
        })}
        <Pagination pages={this.state.pages} page={this.state.page}
          onChangePage={this.handleChangePage} />
      </div>
    );
  }

  _renderCreateExpense() {

  }

  _loadData(page = this.state.page, shouldLoadAll = this.shouldLoadAll) {
    const all = shouldLoadAll ? "&all=true" : "";
    authentication
      .performAuthorizedGet(`/api/expenses.json?page=${page}${all}`)
      .then(({data: result}) => {
        this.setState({
          which: "normal",
          expenses: result.data,
          pages: result.meta.pages
        });
      })
      .catch((...a) => {
        this.setState({ which: "failed" });
        return Promise.reject(...a);
      });
  }
}

ExpenseList.propTypes = {
  location: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired
}
