export interface ResponseAnswerQuestion{
  isCorrect: boolean,
  questionId: number,
  correctAnswer:string

}


export interface ResponseProgressQuestion{
  answered: number,
  unanswered: number,
  correct: number,
  wrong: number,
  total:number
}
