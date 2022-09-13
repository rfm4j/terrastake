# LUNC AutoStaking Bot

Terra is a Layer-1 blockchain protocol, using a delegated POS (proof-of-stake) consensus. This is validated by decentralized **validators**.

Any LUNA holder can delegate it's tokens to a validator, and get rewards in return (it's known as **staking**). This staking is done using the terra station platform.

However, this is not an autostaking protocol, wich means, every time a LUNA holder want's to claim the rewards, and re-stake it, it has to be done manually. This bot is intended to automate it.

> :warning: Use this bot at your own risk

> :warning: This has only been tested with terra classic network

## Installation

```
git clone https://github.com/rfm4j/terrastake.git
cd terrastake
npm install
```


## The AutoStaking bot

This is a really simple auto staking bot based on the logic: 
  
  - Every X minutes check the pending rewards
  - If the rewards are greater than a specific ammount, claim it
  - If some rewards has been claimed, re-stake it again using the same validator.


## Minimal configuration

> :warning: WARNING: KEEP YOUR NEMO PRIVATE!!!


Create a *<code>.env</code>* file in the root folder of the project, with the following content:

```properties
# Your wallet address
WALLET_ADDRESS=<PUT_YOUR_WALLET_ADDRESS_HERE> (For example terra...fasfw)
# Your wallet private NEMO. KEEP THIS PRIVATE!!!
WALLET_NEMO=<PUT_YOUR_MEMO_KEY_HERE>
# VALIDATOR ADDRESS
VALIDATOR_ADDRESS=<PUT_THE_VALIDATOR_YOU_CHOOSE_HERE> (For example terravaloper....)
# Min LUNA ammount to claim reward
MIN_LUNA_REWARD_AMMOUNT=1
# Every X minutes to check if has to restack
MINUTES_SCHEDULE=5
# Chain URL
CHAIN_URL=https://columbus-lcd.terra.dev
# Chain ID
CHAIN_ID=columbus-5
# Is this classic terra chain
IS_CLASSIC=true
```

## Launch
To launch this bot, just type:

```bash
npm start
```

## License
You can do whatever you want with this bot 
