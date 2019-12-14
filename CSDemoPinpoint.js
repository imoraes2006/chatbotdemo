"use strict";

/**
 *  CSDemoPinpoint Lambda
 *  Acts on event from SNS client (need to pass in bot name and pinpoint project id name)
 *  Sends request to CSSMSBot
 *  Processes response
 *  Sends reponse to SMS client
 * 
 *  TODO: A lot. This is a prototype to show it works.  Need to handle failure scenarios.
 */
 
const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.Region
});
const pinpoint = new AWS.Pinpoint();
const lex = new AWS.LexRuntime();

var AppId = process.env.PinpointApplicationId;
// var AppId = 'a7e2d3ff5fff477291d890c50542d8c0';
var botName = process.env.BotName;
var botAlias = process.env.BotAlias;

exports.handler = (event, context)  => {
    /*
    * Event info is sent via the SNS subscription: https://console.aws.amazon.com/sns/home
    * 
    * - PinpointApplicationId is your Pinpoint Project ID.
    * - BotName is your Lex Bot name.
    * - BotAlias is your Lex Bot alias (aka Lex function/flow).
    */
    console.log('Received event in CSDemoPinpoint: ' + event.Records[0].Sns.Message);
    var message = JSON.parse(event.Records[0].Sns.Message);
    var customerPhoneNumber = message.originationNumber;
    var chatbotPhoneNumber = message.destinationNumber;
    var response = message.messageBody.toLowerCase();
    var userId = customerPhoneNumber.replace("+1", "");

    var params = {
        botName: botName,
        botAlias: botAlias,
        inputText: response,
        userId: userId
    };
    console.log('In pinpoint lambda');
    response = lex.postText(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        }
        else if (data != null && data.message != null) {
            console.log("Lex response: " + data.message);
            sendResponse(customerPhoneNumber, chatbotPhoneNumber, response.response.data.message);
        }
        else {
            console.log("Lex did not send a message back!");
        }
    });
}

function sendResponse(custPhone, botPhone, response) {
    var paramsSMS = {
        ApplicationId: AppId,
        MessageRequest: {
            Addresses: {
                [custPhone]: {
                    ChannelType: 'SMS'
                }
            },
            MessageConfiguration: {
                SMSMessage: {
                    Body: response,
                    MessageType: "TRANSACTIONAL",
                    OriginationNumber: botPhone
                }
            }
        }
    };
    console.log('custPhone'+custPhone);
    pinpoint.sendMessages(paramsSMS, function (err, data) {
        if (err) {
            console.log("An error occurred herer .\n");
            console.log(err, err.stack);
        }
        else if (data['MessageResponse']['Result'][custPhone]['DeliveryStatus'] != "SUCCESSFUL") {
            console.log("Failed to send SMS response:");
            console.log(data['MessageResponse']['Result']);
        }
        else {
            console.log("Successfully sent response via SMS from " + botPhone + " to " + custPhone);
        }
    });
}