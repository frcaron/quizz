
interface QuestionBaseDto {
  readonly label: string;
  readonly answerType: 'text' | 'choice' | 'multiple-choice';
}

export interface QuestionTextDto extends QuestionBaseDto {
  readonly answerType: 'text';
  readonly answer: string;
}

export interface QuestionChoiceDto extends QuestionBaseDto {
  readonly answerType: 'choice';
  readonly choices: string[];
  readonly answer: string;
}

export interface QuestionMultipleChoiceDto extends QuestionBaseDto {
  readonly answerType: 'multiple-choice';
  readonly choices: string[];
  readonly answers: string[];
}

export type QuestionDto = QuestionTextDto | QuestionChoiceDto | QuestionMultipleChoiceDto;