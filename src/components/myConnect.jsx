import { ConnectButton } from '@rainbow-me/rainbowkit';
// import "../../App.css";


export const MyConnect = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div className="wallet-div"
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                <div>
                  <button onClick={openConnectModal} type="myButton" className="notConnectedButton">Connect Wallet</button>
                </div>
                );
              }

              if (chain.unsupported) {
                return (
                  <div>
                    <button onClick={openChainModal} type="myButton" className="myButton">
                      Wat chain??
                    </button>
                  </div>
                );
              }

              return (
                <div className="connectedWallet">
                  <button
                    onClick={openChainModal}
                    type="myButton" className="networkBox">
                    {chain.name}
                  </button>

                  <button onClick={openAccountModal} type="myButton" className="addressBox">
                    {account.displayName}
                    {/* {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''} */}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

