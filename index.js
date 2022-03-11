require('dotenv').config();
const { chromium } = require("playwright-chromium");
const Discord = require('discord.js');
const bot = new Discord.Client();

const url = "https://explorer.solana.com/";

const interval_in_sec = 60
const moons = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"]

async function getTPS() {
  let tps = "...";
  let emoji_status = "";

  try {
    const browser = await chromium.launch({ chromiumSandbox: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url);

    await page.waitForSelector("table");
    const tables = await page.locator("table").allTextContents();
    tps = tables[1].split("(TPS)")[1].trim();
    await browser.close();
    if (Number(tps.replace(',', '')) < 1500) {
      emoji_status = "🚫";
    }

    if (Number(tps.replace(',', '')) > 1500) {
      emoji_status = "🟠";
    }

    if (Number(tps.replace(',', '')) > 2000) {
      emoji_status = "🟢";
    }


    bot.user.setActivity(String(tps + " TPS " + emoji_status));
    console.log(`[${Date()}] scraped - ${tps}`);
  } catch (e){
    console.error("Couldnt Scrape!");
    console.error(e);
    bot.user.setActivity(String(tps + " TPS " + emoji_status + emoji_status));
  }
};

bot.on('ready', () => {
  setInterval(getTPS, interval_in_sec * 1000);
  for (i = 0; i < 59; i++) {
    bot.user.setActivity(String("Starting up..." + moons[i % moons.length]));
    var waitTill = new Date(new Date().getTime() + (1 * 1000));
    while (waitTill > new Date()) { }
  }
});

bot.login(process.env.BOT_TOKEN);
