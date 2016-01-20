'use strict';

//TODO: Create date display component and move refresh code to there

var _ = require("lodash"),
    moment = require("moment"),
    classNames = require("classnames"),
    AnswerOptions = require("./AnswerOptions");

var Poll = React.createClass({
  vote: function(option) {
    if (!this.hasVoted()) {
      var pollRef = this.props.pollRef.child("options/" + option);
      var refreshListener;
      
      //TODO: check if hasn't already voted    
      //TODO: check if a vote needs to be removed from another option

      pollRef.child("votes/" + Auth.getAuth().uid).set({
        timestamp: Date.now(),
        location: "lorem"
      });

      //TODO: figure out how to restrict access to this function
      //increment denormalised count
      pollRef.child("count").transaction(function(count) {
        if (!count) {
          return 1;
        } else {
          return count+1;
        }
      });

      pollRef.parent().parent().child("votes").transaction(function(count) {
        if (!count) {
          return 1;
        } else {
          return count+1;
        }
      });
    }
  },

  hasVoted: function() {
    return true;
  },

  getInitialState: function() {
    return {};
  },

  attachListener: function(data) {
    this.setState({
      data: data.val()        
    });
  },

  getPollDateDisplay: function(ms) {
    return moment(ms).fromNow();//.duration().humanize();
  },

  componentWillMount: function() {
    this.props.pollRef.on("value", this.attachListener);
  },

  componentWillUnmount: function() {
    this.props.pollRef.off("value", this.attachListener);
    window.clearInterval(this.refreshListener);
  },

  componentRefresh: function() {
    this.setState({});
  },

  componentDidMount: function() {
    this.refreshListener = setInterval(this.componentRefresh, 60000);
  },

  render: function() {
    var classes = classNames({
      'poll': true,
      'voted': this.hasVoted()
    });

    return (
      <div className={classes}>
        <span className="question">{this.state.data.question}</span>
        <span className="votes pull-right">{this.state.data.votes}</span>
        <span className="date pull-right"> {this.getPollDateDisplay(this.state.data.created_at)}&nbsp;&nbsp;&nbsp;</span>
        <AnswerOptions vote={this.vote} options={this.state.data.options}/>
      </div>
    );
  }
});

module.exports = Poll;
