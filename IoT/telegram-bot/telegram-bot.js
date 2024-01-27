const TelegramBot = require("node-telegram-bot-api");
const AirQualityService = require("../services/air-quality-service");
const UserService = require("../services/user-service");
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await UserService.checkChatId(chatId);
  if (user) {
    bot.sendMessage(
      chatId,
      `Welcome back ${user.fullName} \n` + "Type /help to see command options"
    );
  } else {
    const keyboard = {
      reply_markup: {
        keyboard: [[{ text: "Share my phone number", request_contact: true }]],
        resize_keyboard: true,
      },
    };

    bot.sendMessage(
      chatId,
      "In order to use the system you need to be using the phone number that is registered with your room. " +
        "Click the button to share your contact",
      keyboard
    );
  }
});

bot.on("contact", async (msg) => {
  const chatId = msg.chat.id;
  const phoneNumber = msg.contact.phone_number;
  await UserService.registerChatId(chatId, phoneNumber);
  bot.sendMessage(
    chatId,
    `Thank you for sharing your contact! Phone number: ${phoneNumber}. Type /help to see command options`
  );
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Type /now to see the lastest air quality parameters\n" +
      "Type /avg to see the average air quality parameters in the last 24 hours"
  );
});

bot.onText(/\/now/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const { roomId, data } = await AirQualityService.getAirQualityByUserChatId(
      chatId
    );
    const dataMessage =
      `Time: ${data.createdAt}\n` +
      `Temperature: ${data.temperature}°C\n` +
      `Humidity: ${data.humidity}\n` +
      `PM: ${data.pm}\n`;
    bot.sendMessage(chatId, `Air quality of room ${roomId}:\n` + dataMessage);
  } catch (error) {
    console.error("Error:", error);
    bot.sendMessage(msg.chat.id, "Error occurred. Please try again later.");
  }
});

bot.onText(/\/avg/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const { roomId, averageData } =
      await AirQualityService.getAverageIn24hByUserChatId(chatId);
    let averageDataMessage = "";
    averageData.forEach((element) => {
      averageDataMessage +=
        `\nHour ${element.dataValues.hour}:\n` +
        `   Average temperature: ${element.dataValues.averageTemperature}°C\n` +
        `   Average humidity: ${element.dataValues.averageHumidity}\n` +
        `   Average PM: ${element.dataValues.averagePm}\n`;
    });
    bot.sendMessage(
      chatId,
      `Average air quality in the last 24 hours of room ${roomId}:\n` +
        averageDataMessage
    );
  } catch (error) {
    console.error("Error:", error);
    bot.sendMessage(msg.chat.id, "Error occurred. Please try again later.");
  }
});
bot.onText(/\/help/, (msg) => {});
bot.onText(/\/help/, (msg) => {});
bot.on("polling_error", (error) => {
  console.error("Polling error:", error.message);
});

module.exports = bot;
