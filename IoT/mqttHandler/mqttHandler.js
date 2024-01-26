const mqtt = require("mqtt");
const AirQualityService = require("../services/air-quality-service");

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

  const handleMqttMessage = (mqttTopic, message, wildcardValue) => {
    AirQualityService.saveAirQuality(
      parseInt(wildcardValue),
      JSON.parse(message.toString())
    );
  };
};
