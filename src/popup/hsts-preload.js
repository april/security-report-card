import { NAME, SITE } from '../background_scripts/hsts-preload';
import { sameWindowLinkOpener } from './utils';
import Grade from './grade';
import React from 'react';

export default class HstsPreload extends React.Component {
  render() {
    const scan = this.props.scan ? this.props.scan.data : {};
    const preloaded = ['preloaded', 'pending'].includes(scan.status);

    return (
      <div className="scan">
        <span className="origin"><a href={SITE + '/?domain=' + this.props.hostname} onClick={sameWindowLinkOpener}>{ NAME }:</a></span> 
        <Grade grade={ scan.status ? preloaded : undefined } />
      </div>
    );
  }
}
