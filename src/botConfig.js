import dotenv from 'dotenv'
import { info, error } from './utils/logger.js';
import chalk from 'chalk';
import { Table } from 'console-table-printer';

export default class BotConfig {


    constructor(){
        dotenv.config()
        const args = process.argv.slice(2);
        let VALIDATOR_NAME=args[0];
        if (VALIDATOR_NAME === "undefined"){
          error("Missing validator")
          process.exit(1)
        }
        
        dotenv.config({ path: `.env.${VALIDATOR_NAME}`, override: true })
        this.walletAddress=process.env.WALLET_ADDRESS;
        this.walletMinLuncToDelegate=parseFloat(process.env.WALLET_MIN_LUNC_TO_DELEGATE);
        this.validatorAddress=process.env.VALIDATOR_ADDRESS;
        this.validatorDelegateAddress=process.env.VALIDATOR_DELEGATE_ADDRESS;
        this.minLunaAmmount=parseFloat(process.env.MIN_LUNA_REWARD_AMMOUNT);
        this.scheduleMinutes=process.env.MINUTES_SCHEDULE;
        this.chainUrl=process.env.CHAIN_URL;
        this.chainId=process.env.CHAIN_ID;
        this.isClassic=(process.env.IS_CLASSIC === 'true');
        this.nemonic=process.env.WALLET_NEMO;
        this.convertUstc=(process.env.CONVERT_USTC === 'true');
        this.minUstcToKeep=process.env.MIN_USTC_TO_KEEP;
        this.minUstcToConvert=process.env.MIN_USTC_TO_CONVERT;
        this.onlyDelegate=(process.env.ONLY_DELEGATE === 'true');

        console.log(chalk.green("Bot config: "))
        console.log(chalk.green("---------------------"))

        const p = new Table({
            columns: [
              { name: "Key", alignment: "left", color: "green"},
              { name: "Value", alignment: "left", color: "green" },
            ],
          });

        p.addRows([
            { "Key" : "Wallet Address", "Value" : this.walletAddress},
            { "Key" :"Validator Address", "Value" : this.validatorAddress},
            { "Key" :"ValidatorDelegate Address", "Value" : this.validatorDelegateAddress},
            { "Key" :"Luna reward to claim ", "Value" : this.minLunaAmmount},
            { "Key" :"Min LUNC wallet balance to stake", "Value" : this.walletMinLuncToDelegate},
            { "Key" :"Schedule minutes", "Value" : this.scheduleMinutes},
            { "Key" :"Chain URL", "Value" : this.chainUrl},
            { "Key" :"ChainId", "Value" : this.chainId},
            { "Key" :"Is classic", "Value" : this.isClassic},
            { "Key" :"Convert USTC", "Value" : this.convertUstc},
            { "Key" :"Min USTC to Keep", "Value" : this.minUstcToKeep},
            { "Key" :"Min USTC to Convert", "Value" : this.minUstcToConvert},
            { "Key" :"Only Delegate", "Value" : this.onlyDelegate}



        ]);

        p.printTable()


    }
}