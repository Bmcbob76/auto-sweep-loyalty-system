const Alexa = require('ask-sdk-core');
const User = require('../models/User');
const Reward = require('../models/Reward');

// Launch Request Handler
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speakOutput = 'Welcome to the Loyalty System! You can ask me about your points, rewards, or sweepstakes. What would you like to know?';
    
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

// Get Points Intent Handler
const GetPointsIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetPointsIntent';
  },
  async handle(handlerInput) {
    try {
      // Get user email from Alexa account linking
      const { userId } = handlerInput.requestEnvelope.context.System.user;
      const user = await User.findOne({ alexaUserId: userId });
      
      if (!user) {
        const speakOutput = 'I couldn\'t find your account. Please link your account in the Alexa app.';
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
      }

      const speakOutput = `You have ${user.loyaltyPoints} loyalty points and you are in the ${user.tier} tier.`;
      
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    } catch (error) {
      console.error('Get points error:', error);
      const speakOutput = 'Sorry, I had trouble getting your points. Please try again later.';
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
  }
};

// Get Rewards Intent Handler
const GetRewardsIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetRewardsIntent';
  },
  async handle(handlerInput) {
    try {
      const { userId } = handlerInput.requestEnvelope.context.System.user;
      const user = await User.findOne({ alexaUserId: userId });
      
      if (!user) {
        const speakOutput = 'Please link your account first.';
        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
      }

      const rewards = await Reward.find({
        isActive: true,
        pointsCost: { $lte: user.loyaltyPoints },
        $or: [{ tier: 'all' }, { tier: user.tier }]
      }).limit(3);

      let speakOutput = 'Here are your available rewards: ';
      if (rewards.length === 0) {
        speakOutput = 'You don\'t have enough points for any rewards yet. Keep earning!';
      } else {
        rewards.forEach((reward, index) => {
          speakOutput += `${index + 1}. ${reward.name} for ${reward.pointsCost} points. `;
        });
      }

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    } catch (error) {
      console.error('Get rewards error:', error);
      return handlerInput.responseBuilder
        .speak('Sorry, I had trouble getting rewards.')
        .getResponse();
    }
  }
};

// Get Sweepstakes Intent Handler
const GetSweepstakesIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetSweepstakesIntent';
  },
  async handle(handlerInput) {
    try {
      const Sweepstakes = require('../models/Sweepstakes');
      const activeSweepstakes = await Sweepstakes.find({ status: 'active' }).limit(2);

      let speakOutput = 'Active sweepstakes: ';
      if (activeSweepstakes.length === 0) {
        speakOutput = 'There are no active sweepstakes right now. Check back soon!';
      } else {
        activeSweepstakes.forEach((sweep, index) => {
          speakOutput += `${index + 1}. ${sweep.title}. `;
        });
      }

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    } catch (error) {
      console.error('Get sweepstakes error:', error);
      return handlerInput.responseBuilder
        .speak('Sorry, I had trouble getting sweepstakes information.')
        .getResponse();
    }
  }
};

// Help Intent Handler
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'You can ask me about your loyalty points, available rewards, or active sweepstakes. What would you like to know?';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

// Cancel and Stop Intent Handler
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speakOutput = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

// Error Handler
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error('Error handled:', error);
    const speakOutput = 'Sorry, I had trouble processing your request. Please try again.';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

// Skill Builder
const skillBuilder = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    GetPointsIntentHandler,
    GetRewardsIntentHandler,
    GetSweepstakesIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler
  )
  .addErrorHandlers(ErrorHandler);

module.exports = {
  handler: skillBuilder.lambda()
};
