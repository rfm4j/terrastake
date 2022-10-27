import BotConfig from './botConfig.js';
import { info } from './utils/logger.js';
import { LCDClient, Coin, MsgWithdrawDelegatorReward, MnemonicKey, MsgDelegate, MsgSwap, MsgExecuteContract } from '@terra-money/terra.js';

async function parseWalletBalance(balance, symbol){

    var rawBalance = 0;

    if(balance[0]["_coins"][symbol] !== undefined){
        rawBalance=balance[0]["_coins"][symbol].amount
    }

    return rawBalance;

}

function humanReadable(rawBalance){
    return parseFloat(rawBalance)/1000000;
}


function getWallet(terra, botConfig){

    const mk = new MnemonicKey({
        mnemonic: botConfig.nemonic
      });

      
    return terra.wallet(mk);

}

async function broadcastMessage(terra, wallet, messages){

    return await wallet.createAndSignTx({
                msgs: messages
            })
            .then(tx => terra.tx.broadcast(tx))

}

async function delegate(terra, wallet, botConfig){
    let rawBalance = await terra.bank.balance(botConfig.walletAddress);
    let luncBalance = await parseWalletBalance(rawBalance, "uluna")


    info("Current wallet balance: "+humanReadable(luncBalance))

    info("Staking amount: "+luncBalance)
    let delegateCoin = new Coin("uluna", luncBalance)

    info("Staking: "+delegateCoin.toString())

    info("Creating delegation message")

    let delegateMsg = new MsgDelegate(botConfig.walletAddress, botConfig.validatorAddress, delegateCoin)

    info("Delegate msg has been created")

    console.log(delegateMsg)

    broadcastMessage(terra, wallet, [delegateMsg]).then(result => {
        info(`TX hash: ${result.txhash}`)
    })
}

async function autoStake(terra, botConfig){
    let rawBalance = await terra.bank.balance(botConfig.walletAddress);
    let luncBalance = await parseWalletBalance(rawBalance, "uluna")
    let ustcBalance= await parseWalletBalance(rawBalance, "uusd")
    info("Current wallet balance: ")
    info(humanReadable(luncBalance)+" LUNC")
    info(humanReadable(ustcBalance)+" USTC")
    
    const rewards = await terra.distribution.rewards(botConfig.walletAddress)

    console.log

    const currentLunaRewards=parseFloat(rewards["rewards"][botConfig.validatorAddress]["_coins"]["uluna"]["amount"])/1000000

    info("Current luna rewards: "+currentLunaRewards)


    let wallet = getWallet(terra, botConfig)


    if(currentLunaRewards > botConfig.minLunaAmmount){
       if(botConfig.onlyDelegate){
        delegate(terra, wallet, botConfig)
       } 
       else {
        info("Starting reward collection")

        info("Creating claim message")

        var withdrawMessage=new MsgWithdrawDelegatorReward(botConfig.walletAddress.toString(), botConfig.validatorAddress.toString())
        console.log(withdrawMessage)

        info("Claim message has been created")

        broadcastMessage(terra, wallet,[withdrawMessage])
            .then(async result => {
                info(`TX hash: ${result.txhash}`)

                info("Claim has been done")

                delegate(terra, wallet, botConfig)

                
            })

       }
    } else {
        info("No enouth luna rewards to collect yet")
    }

}

async function main(){
    info("Starting bot")
    const botConfig = new BotConfig();

    info("Creating terra connection")

    const terra = new LCDClient({
        URL: botConfig.chainUrl,
        chainID: botConfig.chainId,
        isClassic: botConfig.isClassic
      });

    info("Terra connection created")

    console.log(terra.config)
    
    await autoStake(terra, botConfig)


    let interval = botConfig.scheduleMinutes * 60 * 1000;

    info("Scheduling every "+interval)

    setInterval(async function() {
        await autoStake(terra, botConfig)
      }, interval);
    
}

main()