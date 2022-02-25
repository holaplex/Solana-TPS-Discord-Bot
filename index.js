require('dotenv').config();
const { chromium } = require("playwright-chromium");
const Discord = require('discord.js');
const bot = new Discord.Client();

const url = "https://explorer.solana.com/";

const interval_in_sec = 60

async function getTPS (){
  console.log(`[${Date()}] begin scrape`);
  const browser = await chromium.launch({ chromiumSandbox: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);

  await page.waitForSelector("table");
  const tables = await page.locator("table").allTextContents();
  const tps = tables[1].split("(TPS)")[1].trim();
  await browser.close();

  bot.user.setActivity(String(tps + " TPS"));
  bot.user.setUsername("Solana TPS Bot");
};

bot.on('ready', () => {
  setInterval(getTPS, interval_in_sec * 1000);
  bot.user.setActivity(String("Starting up..."));
});

bot.login(process.env.BOT_TOKEN);