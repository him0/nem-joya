import React, { Component } from 'react';
import nem from 'nem-sdk';
import './App.css';

import Header from './components/header';
import Footer from './components/footer';

export default class App extends Component {

  constructor(props) {
    super(...arguments)
    this.state = {
      tanu: false,
      usedTxIds: [],
      blockHeight: 0
    };
    this.address = 'NBBNC2K72UDIN5HMRAEUWJ4F22RZPQL2LYONUDET';
    const objects = nem.model.objects.create('endpoint');
    this.websockets_endpoint = objects(nem.model.nodes.defaultMainnet, nem.model.nodes.websocketPort);
    this.api_endpoint = objects(nem.model.nodes.defaultMainnet, nem.model.nodes.defaultPort);

    nem.com.requests.chain.height(this.api_endpoint).then(response => {
      this.setState({ blockHeight: response['height'] });
    });
  }

  componentDidMount(props) {
    this.connetctToNis();
  }

  connetctToNis() {
    const websockets = nem.com.websockets;
    const connector = websockets.connector.create(this.websockets_endpoint, this.address);

    connector.connect().then(() => {
      console.log('Websockets Connected');
      
      websockets.subscribe.chain.blocks(connector, response => {
        console.log('blocks', response);
        const height = response['height'];
        if (response['transactions'].some(tx => tx['recipient'] === this.address)) {
          this.setState({ tanu: true, height }, () => {
            setTimeout(() => { this.setState({ tanu: false }); }, 7000);
          });
          return;
        }
        this.setState({ height });
      });
    });
  }

  renderContents() {
    const image_url = this.state.tanu ? 'images/god_tanu.jpg' : 'images/joyanokane.png';

    return (
      <main className="main">
        <p>
          <img src={image_url} />
        </p>
        {this.state.tanu ? (
          <p>
            <audio src="sounds/gon.mp3" autoPlay />
          </p>
        ) : null}
        <div className="flex">
          <h2>NEM で良いお年を👏</h2>
          <p>Block Height: <span>{this.state.blockHeight}</span></p>
        </div>
        <div className="main__description">
          <p>誰かが XEM や MOSAIC をお賽銭するとゴーンします🔊</p>
          <p>{this.address}</p>
          <p>
            <img width="200px" src="images/qr.png" />
          </p>
        </div>
      </main>
    );
  }

  render() {
    return (
      <div className="App">
        <Header />
        {this.renderContents()}
        <Footer />
      </div>
    );
  }
}
