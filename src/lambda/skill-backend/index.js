const Alexa = require('ask-sdk-core');
const fs = require('fs');
const path = require('path');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speakOutput = 'Welcome, you can ask for garbage collection schedule.';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const GarbageCollectionDayIntentHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'GarbageCollectionDayIntent'
    );
  },
  handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { slots } = request.intent;
    const weekTypeSlot = slots.weekType;
    const weekDateSlot = slots.weekDate;

    if (weekTypeSlot.value) {
      const weekType = weekTypeSlot.value;

      if (weekType === 'this week' || weekType === 'next week') {
        const currentDate = new Date();
        const nextTuesday = getNextTuesday(currentDate);
        const weekDate = nextTuesday.toISOString().split('T')[0];

        return handleGarbageCollection(handlerInput, weekDate);
      } else {
        // Invalid weekType value
        return handlerInput.responseBuilder.speak('Invalid request.').getResponse();
      }
    } else if (weekDateSlot) {
      const newDate = new Date(weekDateSlot.value);
      const nextTuesday = getNextTuesday(newDate);

      const weekDate = nextTuesday.toISOString().split('T')[0];
      return handleGarbageCollection(handlerInput, weekDate);



    } else {

      // Invalid request, neither weekType nor weekDate slot provided
      return handlerInput.responseBuilder.speak('Invalid request.').getResponse();
    }
  },
};

function handleGarbageCollection(handlerInput, weekDate) {
  const scheduleData = loadScheduleData(); // Load schedule data from JSON file
  const schedule = scheduleData.find((row) => row[2] === weekDate);

  if (schedule) {
    const [, , , organics, garbage, recycling, yardwaste, christmasTree] = schedule;
    const scheduleItems = [];

    if (organics === 'T') {
      scheduleItems.push('Organics');
    }
    if (garbage === 'T') {
      scheduleItems.push('Garbage');
    }
    if (recycling === 'T') {
      scheduleItems.push('Recycling');
    }
    if (yardwaste === 'T') {
      scheduleItems.push('Yard Waste');
    }
    if (christmasTree === 'T') {
      scheduleItems.push('Christmas Tree');
    }

    let speechText;
    if (scheduleItems.length > 0) {
      const formattedDate = formatDate(new Date(weekDate));
      const itemList = scheduleItems.join(', ');
      speechText = `The garbage collection schedule for the week of ${formattedDate} is as follows: ${itemList}`;
    } else {
      speechText = `There's no schedule available for the week of ${weekDate}.`;
    }

    return handlerInput.responseBuilder.speak(speechText).getResponse();
  } else {
    // Handle the case when no schedule is found for the provided weekDate
    const speechText = `There's no schedule available for the week of ${weekDate}.`;
    return handlerInput.responseBuilder.speak(speechText).getResponse();
  }
}

function formatDate(date) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}


// Helper function to load schedule data from a JSON file
function loadScheduleData() {
  const scheduleDataPath = path.resolve(__dirname, 'scheduleData.json');
  try {
    const fileContent = fs.readFileSync(scheduleDataPath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    return jsonData.records || [];
  } catch (error) {
    console.error('Error loading schedule data:', error);
    return [];
  }
}

function getNextTuesday(today) {
  const currentDate = today instanceof Date ? today : new Date(); // Use current date if today is not a valid Date object
  const dayOfWeek = currentDate.getDay();

  // Calculate the difference in days until the next Tuesday
  const daysUntilNextTuesday = (9 - dayOfWeek) % 7;

  // Calculate the next Tuesday's date by adding the difference in days
  const nextTuesday = new Date(currentDate.getTime() + daysUntilNextTuesday * 24 * 60 * 60 * 1000);

  return nextTuesday;
}



const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'You can ask for the garbage collection schedule.';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

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
  },
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'Sorry, I don\'t know how to help with that request.';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error('Error handled:', error);

    const speakOutput = 'Sorry, I encountered an error. Please try again later.';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GarbageCollectionDayIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
