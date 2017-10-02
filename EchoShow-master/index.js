var Alexa = require('alexa-sdk');
var request = require('request');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.APP_ID = 'amzn1.ask.skill.716569c1-1d59-4ec7-b109-c4e713f76144';
  alexa.registerHandlers(handlers);
  alexa.TableName = "session";
  alexa.execute();
};

var handlers = {

  'LaunchRequest': function () {
    //this.emit(':ask',"Hello welcome to Autotrader.");
    var message = "Hello welcome to Autotrader, you can say find me a make in city.";
    var cardContent = "Let's find you a car";

       const builder = new Alexa.templateBuilders.BodyTemplate3Builder();
       const makePlainText = Alexa.utils.TextUtils.makeRichText;
       const makeImage = Alexa.utils.ImageUtils.makeImage;

       let template = builder.setTitle('Autotrader')
       .setBackgroundImage(makeImage('https://78.media.tumblr.com/93e3cdbdf45270b37974ae9f93ae22a2/tumblr_owzvi52jfh1uzg32xo1_1280.jpg'))
       .setTextContent(makePlainText(cardContent))
       .build();

      if(!this.event.context.System.device.supportedInterfaces.Display)
      {
          //If device doesn't have a display screen
          this.emit(':ask', message);
      }
      else
      //If the device has a display screen
      {

          this.response.speak(message).renderTemplate(template).listen(cardContent);
          this.emit(':responseReady');
      }
  },

  'getCarIntent': function() {

      var makeArray = [
        ['ACURA', 'Acura'],
        ['ALFA', 'Alfa Romeo'],
        ['AMC', 'AMC'],
        ['ASTON', 'Aston Martin'],
        ['AUDI', 'Audi'],
        ['BENTL', 'Bentley'],
        ['BMW', 'BMW'],
        ['BUGATTI', 'Bugatti'],
        ['BUICK', 'Buick'],
        ['CAD', 'Cadillac'],
        ['CHEV', 'Chevrolet'],
        ['CHRY', 'Chrysler'],
        ['DAEW', 'Daewoo'],
        ['DATSUN', 'Datsun'],
        ['DELOREAN', 'DeLorean'],
        ['DODGE', 'Dodge'],
        ['EAGLE', 'Eagle'],
        ['FER', 'Ferrari'],
        ['FIAT', 'FIAT'],
        ['FISK', 'Fisker'],
        ['FORD', 'Ford'],
        ['FREIGHT', 'Freightliner'],
        ['GENESIS', 'Genesis'],
        ['GEO', 'Geo'],
        ['GMC', 'GMC'],
        ['HONDA', 'Honda'],
        ['AMGEN', 'HUMMER'],
        ['HYUND', 'Hyundai'],
        ['INFIN', 'INFINITI'],
        ['ISUZU', 'Isuzu'],
        ['JAG', 'Jaguar'],
        ['JEEP', 'Jeep'],
        ['KIA', 'Kia'],
        ['LAM', 'Lamborghini'],
        ['ROV', 'Land Rover'],
        ['LEXUS', 'Lexus'],
        ['LINC', 'Lincoln'],
        ['LOTUS', 'Lotus'],
        ['MAS', 'Maserati'],
        ['MAZDA', 'Mazda'],
        ['MCLAREN', 'McLaren'],
        ['MB', 'Mercedes-Benz'],
        ['MERC', 'Mercury'],
        ['MINI', 'MINI'],
        ['MIT', 'Mitsubishi'],
        ['NISSAN', 'Nissan'],
        ['OLDS', 'Oldsmobile'],
        ['PLYM', 'Plymouth'],
        ['PONT', 'Pontiac'],
        ['POR', 'Porsche'],
        ['RAM', 'RAM'],
        ['RR', 'Rolls-Royce'],
        ['SAAB', 'Saab'],
        ['SATURN', 'Saturn'],
        ['SCION', 'Scion'],
        ['SMART', 'smart'],
        ['SRT', 'SRT'],
        ['SUB', 'Subaru'],
        ['SUZUKI', 'Suzuki'],
        ['TESLA', 'Tesla'],
        ['TOYOTA', 'Toyota'],
        ['VOLKS', 'Volkswagen'],
        ['VOLVO', 'Volvo'],
        ['YUGO', 'Yugo']
    ];
    // var zip = this.event.request.intent.slots.zip.value;
    // var make = this.event.request.intent.slots.make.id;
    var city = this.event.request.intent.slots.city.value;
    var make = this.event.request.intent.slots.make.value;
    var makeCode = null;

    for(var i = 0; i < makeArray.length; i++) {
      if(makeArray[i][1].toLowerCase() === make.toLowerCase()) {
          console.log("FORLOOP! " + makeArray[i][1]);
          makeCode = makeArray[i][0];
          break;
      }
    }

    console.log("MAKECODE! " + makeCode + " MAKE! " + make);

    // var year = this.event.request.intent.slots.year.value;
    // var model = this.event.request.intent.slots.model.value;
    // var city = this.event.request.intent.slots.city.value;
    // var state = this.event.request.intent.slots.state.value;
    // var endpoint = "https://mdotqa:bNV35gGvLlD2Y8D0YVke@api-qa-origin.autotrader.com/rest/v0/listings?makeCodeList="+ make;

    var endpoint = "yourEndPoint" ;
    
    console.log(endpoint);

    //Issue a get request
    request.get(endpoint, (error, response, body) => {
        if (response.statusCode !== 200) {
            console.log("There was an error processing your request. Here\'s what happened: " +
            response.statusCode + " " + response.statusCode);
            console.log(error);          
        }
        else{
            //parse the data into the JSON body
            data=JSON.parse(body);
            console.log(body);

            var listingImage = data.listings[0].imageURL;
            var listingTitle = data.listings[0].title;
            var ownerName = data.listings[0].ownerName;
            var price = data.listings[0].salePrice;

            var message = "I found you a " + listingTitle + " priced at " + price
                + ". Want to search for another listing?";
            var cardContent = listingTitle + "\n "
                + price + "\n"
                + ownerName;

          const builder = new Alexa.templateBuilders.BodyTemplate3Builder();
          const makePlainText = Alexa.utils.TextUtils.makeRichText;
          const makeImage = Alexa.utils.ImageUtils.makeImage;

          let template = builder.setTitle('Autotrader')
              .setBackgroundImage(makeImage('https://image.freepik.com/free-vector/dark-blue-watercolor-background-design_1034-737.jpg'))
              .setImage(makeImage(listingImage))
              .setTextContent(makePlainText(cardContent))
              .build();

          if(!this.event.context.System.device.supportedInterfaces.Display)
          {
              //If device doesn't have a display screen
              this.emit(':ask', message);
          }
          else
          //If the device has a display screen
          {
              this.response.speak(message).renderTemplate(template).listen('Want to keep searching?');
              this.emit(':responseReady');
          }
        }
    });

  },

  'AMAZON.StopIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Goodbye.`);
  },
  'AMAZON.CancelIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Goodbye.`);
  },
  'SessionEndedRequest': function () {
    // Force State Save When User Times Out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent' : function () {
    this.emit(':ask', `You can tell me to find you a specific car in a specific city or near you . Where would you like me to find you a car?`);
  },
  'Unhandled' : function () {
    this.emit(':ask', `You can tell me to find you a specific car in a specific city or near you . Where would you like me to find you a car?`);
  }

};