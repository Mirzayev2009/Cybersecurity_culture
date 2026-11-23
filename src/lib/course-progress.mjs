import { FEEDBACK_CHOICES, isFeedbackId, normalizeFeedback } from './student-feedback.mjs';

/** Fresh attempts never reuse numeric answers from another content version. */
export function createProgress(contentVersion) {
  return {contentVersion,lang:'uz',langUserSelected:false,collapsed:false,labs:{},labAnswers:{},labChecks:{},missionAnswers:{},missionIndex:0,quizAnswers:{},quizIndex:0,submitted:false,homeAnswer:'',choiceOrders:null,registered:false,previousRegistrationConfirmed:false,migrationNotice:false,feedbackChoice:'',feedbackText:'',feedbackId:'',feedbackSubmitted:false};
}

function answers(value, count, optionCount) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([index, answer]) =>
    /^(0|[1-9]\d*)$/.test(index) && Number(index) < count && Number.isInteger(answer) && answer >= 0 && answer < optionCount));
}

export function validChoiceOrders(orders, questions) {
  return Array.isArray(orders) && orders.length === questions.length && Array.from(orders).every((order,index) =>
    Array.isArray(order) && order.length === questions[index].o.length &&
    new Set(order).size === order.length && Array.from(order).every(n => Number.isInteger(n) && n >= 0 && n < order.length));
}

export function restoreProgress(value, contentVersion) {
  const fresh = createProgress(contentVersion);
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fresh;
  const preferences = {lang:value.langUserSelected === true && value.lang === 'en' ? 'en' : 'uz',langUserSelected:value.langUserSelected === true,collapsed:value.collapsed === true};
  if (value.contentVersion !== contentVersion) {
    return {...fresh,...preferences,previousRegistrationConfirmed:value.registered === true || value.previousRegistrationConfirmed === true,migrationNotice:true};
  }
  const restored = {...fresh,...value,...preferences,contentVersion};
  restored.labs = Object.fromEntries(Object.entries(value.labs || {}).filter(([k,v]) => /^[0-4]$/.test(k) && v === true));
  restored.labAnswers = answers(value.labAnswers,3,3);
  restored.missionAnswers = answers(value.missionAnswers,6,3);
  restored.quizAnswers = answers(value.quizAnswers,20,4);
  restored.labChecks = {};
  for (const i of [0,1,3]) {
    if (Array.isArray(value.labChecks?.[i])) restored.labChecks[i] = [...new Set(value.labChecks[i].filter(n => Number.isInteger(n) && n >= 0 && n < 4))];
  }
  if (Number.isInteger(value.labChecks?.[4]) && value.labChecks[4] >= 0 && value.labChecks[4] < 5) restored.labChecks[4] = value.labChecks[4];
  restored.missionIndex = Number.isInteger(value.missionIndex) && value.missionIndex >= 0 && value.missionIndex < 6 ? value.missionIndex : 0;
  restored.quizIndex = Number.isInteger(value.quizIndex) && value.quizIndex >= 0 && value.quizIndex < 20 ? value.quizIndex : 0;
  restored.submitted = value.submitted === true && Object.keys(restored.quizAnswers).length === 20;
  restored.registered = value.registered === true;
  restored.previousRegistrationConfirmed = value.previousRegistrationConfirmed === true;
  restored.migrationNotice = value.migrationNotice === true;
  restored.homeAnswer = ['safe','risky'].includes(value.homeAnswer) ? value.homeAnswer : '';
  restored.feedbackChoice = FEEDBACK_CHOICES.includes(value.feedbackChoice) ? value.feedbackChoice : '';
  restored.feedbackText = typeof value.feedbackText === 'string' ? value.feedbackText.slice(0,1000) : '';
  restored.feedbackId = isFeedbackId(value.feedbackId) ? value.feedbackId : '';
  restored.feedbackSubmitted = value.feedbackSubmitted === true && !!restored.feedbackId && !!normalizeFeedback(restored.feedbackChoice,restored.feedbackText);
  return restored;
}
