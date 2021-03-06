const EventEmitter = require('events');
const Consumers = require('../consumer');

class Session {
  constructor(username) {
    this.username = username;
    this.chatGroups = {};
    this.emitter = new EventEmitter();
    this.consumer = new Consumers();
    this.socket = null;
    this.consumerEvents = this.consumerEvents.bind(this);
    this.consumerEvents();
  }

  /**
   * start consuming the chat we want
   * @param {string} chatId 
   */
  consumeChat(chatId) {
    console.log("Session getting chat", chatId)
    const consumer = this.consumer.getConsumer(chatId);
    consumer.addEmitter(this.emitter);
    // consumer.readMessages(50);
  }

  /**
   * Consumes the events that come from RabbitMQ and sends to the socket.io-client session
   */
  consumerEvents() {
    this.emitter.on('message', ({chatId, data}) => {
      console.log("New message", chatId, data.content.toString())
      if (this.socket) this.socket.emit('message', {
        chatId: chatId,
        message: data.content.toString()
      });
    });

    this.emitter.on('error', (err) => {
      // do nothing
    });
  }
}

module.exports = Session;