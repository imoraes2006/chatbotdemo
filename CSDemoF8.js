//   

/** 
 * CSDemoF8 is a Lambda 
 * CSBud is a Lex Bot with two intents
 *     returnExchange has a number of utterances (exchange audible book, exchange book, return audible book, etc)
 *     unknownCharge (what is this charge, unknown charge, etc)
 *  TODO: This is a demo and needs work to handle errors, etc.
 */
 
 function unknownChargeNew(event, categ) {
    let contentStr = 'Here is what can help you for unknown charges!: https://audible.custhelp.com/app/answers/detail/a_id/9182';
    let trailer = 'Tip: If you need to contact us about a charge, please have the 9 digit alpha-numeric code available. It will help us find the charge faster!';
    console.log('reached  in here and event.sessionAttributes is' + event.sessionAttributes);
    console.log('event.currentIntent.slots' + event.currentIntent.slots);
    let charge = event.currentIntent.slots.Charge;
    console.log('Charge is' + charge);
    console.log('InvocationSource is ' + event.InvocationSource);
    if (charge == 14.95) 
        contentStr = 'Note: Prices differ across surfaces, products & platforms.  If you enrolled in a free trial, membership charges begin following the 30-day free trial period. Audible will charge your default Amazon card to avoid any disruptions to your service and benefits, including: 1 credit a month good for any audiobook, regardless of price. Complimentary access to original audio shows/comedy &more, 30% discounts on addtl audiobook purchases, easy xchanges & more';
    else if (charge == 1) 
        contentStr = 'A $1.00 charge on your billing statement is an authorization hold from your bank on a recently-placed order with Audible. This is only a temporary charge. If you purchased an Audible book on Amazon or Audible, or attempted to enroll in a free trial offer, this $1.00 charge will appear on your billing statement, and should go away quickly';
    else 
        contentStr = 'Other charges from Audible may include Whispersync for Voice and Immersion Reading purchases. When you purchase a Kindle book on Amazon, you have the option of adding Audible narration at a discount via these features. This lets you read and listen at the same time. If you dont remember making a purchase, we can help you learn how Whispersync for Voice and Immersion Reading work, or you can make a return.'    
     }
    const source = event.invocationSource;
    let lamb_response = {
        "dialogAction": {
            "type": "Close",
            "fulfillmentState": "Fulfilled",
            "message": {
                "contentType": "PlainText",
                "content": contentStr + trailer,
            },
            'responseCard': {
                'version': '0',
                'contentType': 'application/vnd.amazonaws.card.generic',        
                'genericAttachments': [
                    {
                        'title': 'Contact Us 24x7',
                        'subTitle': '<<Place holder for whatever>>',
                        'attachmentLinkUrl': 'https://audible.custhelp.com/app/answers/detail/a_id/9182',
                        'imageUrl': 'https://www.audible.com/blog/img/audible-icon-t.png'
                    }
                ] 
            }
        }
    }

    if (event.currentIntent.slots.Charge == null) {
       lamb_response = {     
        "sessionAttributes": {
            "nextStep":  "return/exchang"
        },   
        "dialogAction": {
            "type": "ElicitSlot",
            "slots": "Charge",
            "slotToElicit" : "Charge",
            "intentName" : "unknownCharge",
         "message": {
                "contentType": "PlainText",
                "content": "What is the amount yoyo"
          }
        }
       }
    }
    return lamb_response;
 }

function returnBook(event, categ) {
    const source = event.invocationSource;
    console.log('invoationSource in getNews=' + source);
    console.log("intent = " + event.currentIntent.name);
    let lamb_response = {     
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': 'Here is what can help to return/exchange an audio book! ;)'
            },
            'responseCard': {
                'version': '0',
                'contentType': 'application/vnd.amazonaws.card.generic',        
                'genericAttachments': [
                    {
                        'title': 'Returning/Exchange Books',
                        'subTitle': 'Audible Return Books',
                        'attachmentLinkUrl': 'https://audible.custhelp.com/app/answers/detail/a_id/4592',
                        'imageUrl': 'https://www.audible.com/blog/img/audible-icon-t.png'
                    }
                ] 
            }
        }
        }
    return lamb_response; 
}

exports.handler = async (event) => {
    console.log('---------------');
    console.log(event.invocationSource);
    var categ = event.currentIntent.slots.BUDGET_CATEGORY;
    console.log('intent=' + event.currentIntent.name);
    console.log('In CSDemoF8: outputDialogMode=' + event.outputDialogMode);
    console.log(event.currentIntent);
    var lambda_response = "";
    if (event.currentIntent.name === "unknownCharge")
       lambda_response = unknownChargeNew(event, categ);
    if (event.currentIntent.name === "returnExchange")
       lambda_response = returnBook(event, categ);
    console.log('RESPONSE');
    console.log(lambda_response);
    return lambda_response;
}