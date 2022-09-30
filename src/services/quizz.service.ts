import { Injectable } from '@angular/core';

import { ComponentStore } from '@ngrx/component-store';

interface QuestionBase {
  readonly label: string;
  readonly type: string;
}

interface QuestionText extends QuestionBase {
  readonly type: 'text';
  readonly answer: string;
}

interface QuestionChoice extends QuestionBase {
  readonly type: 'choice';
  readonly choices: string[];
  readonly answer: string;
}

interface QuestionMultipleChoice extends QuestionBase {
  readonly type: 'multiple-choice';
  readonly choices: string[];
  readonly answers: string[];
}

type Question = QuestionText | QuestionChoice | QuestionMultipleChoice;

interface State {
  readonly loaded: boolean;
  readonly loading: boolean;
  readonly questions: Question[];
  readonly bestScore: number;
  readonly playAtLeastOne: boolean;
}

@Injectable()
export class QuizzService extends ComponentStore<State> {
  readonly loaded$ = this.select(({ loaded }) => loaded);
  readonly loading$ = this.select(({ loading }) => loading);
  readonly questions$ = this.select(({ questions }) => questions);
  readonly bestScore$ = this.select(({ bestScore }) => bestScore);
  readonly playAtLeastOne$ = this.select(
    ({ playAtLeastOne }) => playAtLeastOne
  );

  constructor() {
    super({
      loaded: false,
      loading: false,
      questions: [],
      bestScore: 0,
      playAtLeastOne: false,
    });
  }
}
