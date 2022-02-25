require('dotenv').config();
const { chromium } = require("playwright-chromium");
const Discord = require('discord.js');
const bot = new Discord.Client();

const url = "https://explorer.solana.com/";

const interval_in_sec = 60

async function getTPS (){
  const browser = await chromium.launch({ chromiumSandbox: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);

  await page.waitForSelector("table");
  const tables = await page.locator("table").allTextContents();
  const tps = tables[1].split("(TPS)")[1].trim();
  await browser.close();
  let emoji_status = ""
  (tps > 2000) ?  emoji_status = "🟢" : emoji_status = "🟠"
  bot.user.setActivity(String(tps + " TPS " + emoji_status ));
  console.log(`[${Date()}] scraped - ${tps}`);
};

bot.on('ready', () => {
  setInterval(getTPS, interval_in_sec * 1000);
  bot.user.setActivity(String("Starting up..."));
});

bot.login(process.env.BOT_TOKEN);