import React from 'react';

export default class Grade extends React.Component {
  render() {
    let grade = this.props.grade;
    let text;
    const spinner = <img className="spinner" src="spinner.svg" />;

    if (typeof grade === 'string') {
      text = grade[0].toUpperCase();
      grade = grade[0].toLowerCase();
    } else if (typeof grade === 'boolean') {
      text = grade ? '✓' : '✗';
      grade = grade.toString();
    } else {
      text = spinner;
      grade = '?';
    }

    return (
      <span className="grade" data-grade={grade}>{text}</span>
    );
  }
}
