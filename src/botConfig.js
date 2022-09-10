import dotenv from 'dotenv'
import { info } from './utils/logger.js';
import chalk from 'chalk';
import { Table } from 'console-table-printer';

export default class BotConfig {


    constructor(){
        dotenv.config()
        this.walletAddress=process.env.WALLET_ADDRESS;
        this.validatorAddress=process.env.VALIDATOR_ADDRESS;
        this.minLunaAmmount=parseFloat(process.env.MIN_LUNA_REWARD_AMMOUNT);
        this.scheduleMinutes=process.env.MINUTES_SCHEDULE;
        this.chainUrl=process.env.CHAIN_URL;
        this.chainId=process.env.CHAIN_ID;
        this.isClassic=(process.env.IS_CLASSIC === 'true');
        this.nemonic=process.env.WALLET_NEMO;

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
            { "Key" :"Luna reward to claim ", "Value" : this.minLunaAmmount},
            { "Key" :"Schedule minutes", "Value" : this.scheduleMinutes},
            { "Key" :"Chain URL", "Value" : this.chainUrl},
            { "Key" :"ChainId", "Value" : this.chainId},
            { "Key" :"Is classic", "Value" : this.isClassic}



        ]);

        p.printTable()


    }
}