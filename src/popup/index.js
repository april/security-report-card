import React from 'react';
import ReactDOM from 'react-dom';
import HstsPreload from './hsts-preload';
import HttpObservatory from './http-observatory';


class Popup extends React.Component {
  constructor(props) {
    super(props);

    // if we get a request to update the state from the backend middleware, push
    // it down into React
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (sender.envType === 'addon_child' && request.action === 'updateState') {
        this.setState(request.state);
      }

      sendResponse({});
    });

    // set the default state during mounting
    this.state = {
      scans: {
        hstsPreload: {},
        httpObservatory: {},
      }
    };
  }


  async componentDidMount() {
    // get the current hostname
    const tab = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    // get the Redux store from the backend
    const bg = await browser.runtime.sendMessage({
      action: 'getStore',
    });

    // initiate scans, if they haven't been initiated yet
    await browser.runtime.sendMessage({
      action: 'initiateScans',
      hostname: new URL(tab[0].url).hostname,
      tabId: tab[0].id,
    });

    this.setState({
      ...this.state,
      hostname: new URL(tab[0].url).hostname,
      ...bg,
    })

  }

  render() {
    if (this.state) {
      return (
        <div>
          <HstsPreload hostname={ this.state.hostname } scan={this.state.scans.hstsPreload[this.state.hostname]} />
          <HttpObservatory hostname={ this.state.hostname } scan={this.state.scans.httpObservatory[this.state.hostname]} />
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
}

ReactDOM.render(<Popup/>, document.getElementById('app'));
