# Chatbots for CS
**CONTEXT**

To get help to common questions, users have to navigate a web page to get answers to common questions that result in engagement with Audible Customer Service.  Customer Service leadership indicated that for simple questions such as these it is of value to our customers to provide them with more expedient ways to get answers to these questions 

**USE CASE**

A chat bot  responds to queries (two common questions implemented thus far): explanation of charges and how to return/exchange books.  All Chatbot input uses existing publically accessible material.  Two clients have been implemented: Facebook App and SMS. 

**IMPLEMENTATION DETAILS**

The implementation is NAWS using Pinpoint, Lambda, SNS, and Lex. There are two bots to interact with
- CSBud  has two intents: returnExchange and unknownCharge. The bot has a Lambda (CSDemoF8) associated with it. Ensure the bot has channels integration settings for Facebook. See details below. Appendix 1
- CSSMSBot has two intents: returnExchangesSMS and unknownChargesSMS. The bot has a Lambda (CSDemo) associated with it to support interaction via SMS using Pinpoint. Lambda (CSDemoPinpoint) respond to SMS messages in the SNS topic called CSDemoPinpointSNS which CSDemoPinpoint is subscribed to.

**FILES**
- CSBud_Export.json: Import CSBud bot configuration https://docs.aws.amazon.com/lex/latest/dg/import-from-lex.html that manages FB client interaction
- CSSMSBot_Export.json: Import CSSMSBot bot configuration that manages SMS interaction 
- CSDemoPinpointSNS: SNS Topic
- firstone: Project is firstone
- CSDemoPinpoint: Lambda to support Pinpoint and Lex integration
- CSDemoF8: Lambda to support CSBud bot
- CSDemo: Lambda to support CSSMSBot bot
- LexPinPointIntegratoinDemo-role-r7a18iay 

## APPENDIX 1: Amazon Lex and Facebook
CSBud bot interacts with Facebook Client
- Remember to build and publish bot first
- You will need to setup Facebook Channel
- Choose a unique channel name: <<whatever you want>>
- IAM Role: AWSServiceRoleForLexChannels
- KMS Key: aws/lex
- Alias: prod
- Verify token: fblex
- Page Access Token: See below
- App Secret Key: See below

Copy endpoint URL and then go to https://developers.facebook.com/apps/1045336569130754/messenger/settings/ and change the URL in Messenger/Settings (edit Callback URL and verify token)

**Development Notes**

Test using FB Client (IMM Chat Bot page) or Lex Test Window. For FB Client integration
- Republishing bot: a. Make sure you build and test the bot, b. Publish the bot, and c. You have to change Lex channels settings (remember page access token, app secret key and verify token, choose alias) and get a new callback URL
- Update Facebook Webhooks: Update callback URL and verify token
- When updating lambda: No update of FB or bot required
- References for initial setup: https://read.acloud.guru/how-to-integrate-an-amazon-lex-chatbot-with-facebook-messenger-84a3ac84161

After initial setup, you will need it so 
- Save Page Access Token
- Save App Secret Key
- Verify Token: fblex

## APPENDIX 2: Amazon Lex interacts with SMS via Pinpoint
Use Pinpoint to allow interaction with Bot via SMS. Richness of content differs (no respond cards used) as SMS does not support it. Pinpoint Project details are:

- Name: firstone
- Default message type: transactional
- Long number: +1 251-267-8687
- SMS enabled (2 way SMS enabled)
- SMS and Voice
- Create a long code (+1 251-267-8687)

Incoming SMS messages are dumped in an SNS topic (CSDemoPinpointSNS). A lambda function subscribes to the SNS topic. In this Lambda function (CSDemoPinpoint), you communicate between Pinpoint and Lex.
- Receive SMS message from SNS topic
- Send message to Lex
- Receive response
- Use pinpoint to send message to subscriber

Used the LexPinPointIntegratoinDemo-role-r7a18iay role
