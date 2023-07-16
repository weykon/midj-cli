#!/usr/bin/env tsx
import chalk from 'chalk';
import boxen from 'boxen';
import yargs from 'yargs';
import readline from 'readline';
import { Midjourney } from 'midjourney';
import { readFileSync } from 'fs';
import { hideBin } from 'yargs/helpers'
import fetch from "node-fetch";

console.log('node version', process.version)

const greeting = chalk.white.bold("Hello!");

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "green",
    backgroundColor: "#555555"
};

const msgBox = boxen(greeting, boxenOptions);
console.log(msgBox);

const options = yargs(hideBin(process.argv)).argv

if (!options.load) {
    // sorry
    console.log(chalk.red("对不起，您需要指定要加载的文件，类似: npx midj --load ./config.json"));
    process.exit(1);
}

console.log(chalk.green(`正在加载 ${options.load}...`));
const file = readFileSync(options.load, "utf8");

const config = JSON.parse(file);
const serverStr = config.channel.split("/").slice(-2)[0];
const channelStr = config.channel.split("/").slice(-2)[1];

console.log(chalk.green(`正在连接到 ${serverStr} 的 ${channelStr} 频道...`));

const midj = new Midjourney({
    ServerId: serverStr,
    ChannelId: channelStr,
    SalaiToken: config.token,
    Debug: true,
    fetch: fetch,
    Ws: true,
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function createQ(q) {
    return new Promise((resolve, reject) => {
        rl.question(q, ans => {
            console.log(`你的输入: , ${ans}!`);
            resolve(ans);
        });
    })
}


async function askWhatToDo() {
    const ans = await createQ("你想要做什么？ (imagine): ");
    if (ans === "imagine") {
        imagine();
    }
}
async function imagine() {
    console.log("正在生成...")
    const ansPrompt = await createQ("输入你的prompt: ") as string;
    let ansNum = await createQ("你想要几组4x4的？ (int, number): ") as number;
    if (ansNum > 4) {
        console.log("对不起，最多只能生成4组4x4的");
        ansNum = 4
    }

    const can_next = 'INTERACTION_SUCCESS';
    
    const promise_list = new Array(ansNum).fill(
        midj.Imagine(ansPrompt, (uri, progress) => {
            console.log(`[${progress}] ${uri}`);
        })
    )

    for (let i of promise_list) {
        await i;
        console.log(`正在发起一次请求`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log(`3 秒`);
    }
}

try {
    (async () => {
        console.log("正在尝试连接...")
        await midj.Connect();
        console.log("连接成功！");
        await askWhatToDo();
    })()
} catch (error) {
    console.log('错误', error);
}

