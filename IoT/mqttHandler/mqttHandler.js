const mqtt = require("mqtt");
const AirQualityService = require("../services/air-quality-service");
const UserService = require("../services/user-service");
const TelegramBot = require("../telegram-bot/telegram-bot");

exports.startMqttListener = async (brokerUrl, clientId, topic) => {
  const mqttClient = mqtt.connect(brokerUrl, { clientId, clean: true });

  mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");
    subscribeToTopic();
  });

  mqttClient.on("message", (mqttTopic, message) => {
    const wildcardValue = extractWildcardValue(topic, mqttTopic);
    handleMqttMessage(mqttTopic, message, wildcardValue);
  });

  const subscribeToTopic = () => {
    mqttClient.subscribe(`${topic}/+`, (err) => {
      if (!err) {
        console.log(`Subscribed to ${topic} topics`);
      } else {
        console.error(`Error subscribing to ${topic} topics:`, err);
      }
    });
  };
  const extractWildcardValue = (subscriptionTopic, actualTopic) => {
    const wildcardPosition = subscriptionTopic.indexOf("+");
    const wildcardValue = actualTopic.substring(
      wildcardPosition + topic.length + 2
    );
    return wildcardValue;
  };

  const handleMqttMessage = async (mqttTopic, message, wildcardValue) => {
    const jsonMessage = JSON.parse(message.toString());
    if (jsonMessage.temperature >= 50) {
      const user = await UserService.getUserByRoomId(parseInt(wildcardValue));
      TelegramBot.sendMessage(
        user.chatId,
        `*Alert: Your room temperature is reaching over 50°C (currently ${jsonMessage.temperature}°C)*`,
        { parse_mode: "Markdown" }
      );
    }
    AirQualityService.saveAirQuality(
      parseInt(wildcardValue),
      JSON.parse(message.toString())
    );
  };
};
