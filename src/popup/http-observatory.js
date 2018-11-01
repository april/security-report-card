import { NAME, SITE } from '../background_scripts/http-observatory';
import { sameWindowLinkOpener } from './utils';
import Grade from './grade';
import React from 'react';

export default class HttpObservatory extends React.Component {
  render() {
    const scan = this.props.scan ? this.props.scan.data : undefined;

    return (
      <div className="scan">
        <span className="origin"><a href={SITE + '/analyze/' + this.props.hostname} onClick={sameWindowLinkOpener}>{ NAME }:</a></span> 
        <Grade grade={ scan ? scan.grade : undefined } />
      </div>
    );
  }
}
