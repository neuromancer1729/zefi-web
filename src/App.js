import React from "react";
import "./styles.css";
import web3Obj from "./utils";

import { EthAddress, Card, Text, Icon, Button } from "rimble-ui";

class App extends React.Component {
  state = {
    account: null,
    publicAddress: "",
    balance: "",
    userInfo: {},
    buildEnv: "testing",
    modalVisible: false
  };

  componentDidMount() {
    const isTorus = sessionStorage.getItem("pageUsingTorus");
    if (isTorus) {
      web3Obj.initialize(isTorus).then(() => {
        this.setStateInfo();
      });
    }
  }

  setStateInfo = () => {
    web3Obj.web3.eth.getAccounts().then(accounts => {
      this.setState({ account: accounts[0] });
      web3Obj.web3.eth.getBalance(accounts[0]).then(balance => {
        this.setState({ balance: balance });
      });
    });
  };

  enableTorus = async e => {
    const { buildEnv } = this.state;
    e.preventDefault();
    try {
      await web3Obj.initialize(buildEnv);
      this.setStateInfo();
    } catch (error) {
      console.error(error);
    }
  };

  getPublicAddress = () => {
    web3Obj.torus
      .getPublicAddress({
        verifier: this.state.selectedVerifier,
        verifierId: this.state.verifierId
      })
      .then(this.console);
  };

  createWallet = async () => {
    const userInfo = await web3Obj.torus.getUserInfo();
    console.log(userInfo);

    const publicAddress = await web3Obj.torus.getPublicAddress({
      verifier: "google",
      verifierId: "random@gmail.com"
    });

    this.setState({ userInfo: userInfo, publicAddress: publicAddress });
    console.log(publicAddress);
  };

  wyreOnboard = () => {
    web3Obj.torus
      .initiateTopup("wyre", {
        selectedCurrency: "USD",
        fiatValue: "100",
        selectedCryptoCurrency: "DAI"
      })
      .catch(err => console.log(err.message));
  };

  render() {
    let { account, publicAddress } = this.state;
    return (
      <div className="App">
        {!account && (
          <form onSubmit={this.enableTorus}>
            <h1>Welcome to ZeFi</h1>
            <h5>A high yeild savings account from future!</h5>
            <button>Get Started</button>
          </form>
        )}
        {account && (
          <div>
            {!publicAddress ? (
              <button style={{ marginTop: "20px" }} onClick={this.createWallet}>
                Create Wallet
              </button>
            ) : null}

            {publicAddress ? (
              <div>
                <Card>Your Ethereum wallet address</Card>
                <EthAddress address="0x9505C8Fc1aD98b0aC651b91245d02D055fEc8E49" />
                <Card
                  width={"auto"}
                  maxWidth={"420px"}
                  marginTop={"20px"}
                  mx={"auto"}
                  px={[3, 3, 4]}
                >
                  <Text
                    caps
                    fontSize={0}
                    fontWeight={4}
                    mb={3}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Icon name={"AccountBalanceWallet"} mr={2} />
                    Add funds to your wallet:
                  </Text>

                  <Button
                    onClick={this.wyreOnboard}
                    style={{ marginRight: "20px" }}
                    width={[1, "auto", "auto"]}
                    px={[3, 4, 4]}
                  >
                    Debit Card
                  </Button>

                  <Button width={[1, "auto", "auto"]} px={[3, 4, 4]}>
                    Transfer DAI
                  </Button>
                </Card>
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

export default App;
