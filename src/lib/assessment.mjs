export const PASS_SCORE = 16;
export const QUESTION_COUNT = 20;

export function validAnswers(answers) {
  return Array.isArray(answers) && answers.length === QUESTION_COUNT && Array.from(answers).every(answer => Number.isInteger(answer) && answer >= 0 && answer < 4);
}

export function scoreAnswers(answers, answerKey) {
  return answers.filter((answer,index) => answer === answerKey[index]).length;
}
