import BotConfig from './botConfig.js';
import { info } from './utils/logger.js';
import { LCDClient, Coin, MsgWithdrawDelegatorReward, MnemonicKey, MsgSend, MsgDelegate } from '@terra-money/terra.js';

async function getWalletBalance(terra, botConfig){

    var balance = await terra.bank.balance(botConfig.walletAddress);
    var rawBalance = 0;

    if(balance[0]["_coins"]["uluna"] !== undefined){
        rawBalance=balance[0]["_coins"]["uluna"].amount
    }
    var humanReadableBalance=parseFloat(rawBalance)/1000000

    return [ rawBalance, humanReadableBalance ]


}

function getWallet(terra, botConfig){

    const mk = new MnemonicKey({
        mnemonic: botConfig.nemonic
      });

      
    return terra.wallet(mk);

}

async function broadcastMessage(terra, wallet, messages){

    return wallet.createAndSignTx({
                msgs: messages
            })
            .then(tx => terra.tx.broadcast(tx))

}

async function autoStake(terra, botConfig){

    let [balance, humanReadableBalance] = await getWalletBalance(terra, botConfig)
    info("Current luna balance: "+humanReadableBalance)
    const rewards = await terra.distribution.rewards(botConfig.walletAddress)

    const currentLunaRewards=parseFloat(rewards["rewards"][botConfig.validatorAddress]["_coins"]["uluna"]["amount"])/1000000

    info("Current luna rewards: "+currentLunaRewards)

    if(currentLunaRewards > botConfig.minLunaAmmount){
        info("Starting reward collection")

        info("Creating claim message")

        var withdrawMessage=new MsgWithdrawDelegatorReward(botConfig.walletAddress.toString(), botConfig.validatorAddress.toString())
        console.log(withdrawMessage)

        info("Claim message has been created")

        
        let wallet = getWallet(terra, botConfig)

        broadcastMessage(terra, wallet,[withdrawMessage])
            .then(async result => {
                info(`TX hash: ${result.txhash}`)

                info("Claim has been done")

                let [balance, humanReadableBalance] = await getWalletBalance(terra, botConfig)

                info("Current wallet balance: "+humanReadableBalance)

                info("Staking amount: "+balance)
                let delegateCoin = new Coin("uluna", balance)

                info("Staking: "+delegateCoin.toString())

                info("Creating delegation message")

                let delegateMsg = new MsgDelegate(botConfig.walletAddress, botConfig.validatorAddress, delegateCoin)

                info("Delegate msg has been created")

                console.log(delegateMsg)

                broadcastMessage(terra, wallet, [delegateMsg]).then(result => {
                    info(`TX hash: ${result.txhash}`)
                }
                )
            })

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