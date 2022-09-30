import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { map, Observable, delay } from 'rxjs';
import { QuestionDto } from '../models/dto';

export interface Question {
  readonly id: string;
  readonly order: number;
  readonly dto: QuestionDto;
  readonly previousId: string | undefined;
  readonly nextId: string | undefined;
  readonly data: unknown | undefined;
  readonly valid: boolean;
}

interface State {
  readonly loaded: boolean;
  readonly loading: boolean;
  readonly questions: Question[];
  readonly bestScore: number;
  readonly playing: boolean;
  readonly played: boolean;
  readonly finished: boolean;
  readonly currentStep: string | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class QuizzService extends ComponentStore<State> {
  readonly loaded$ = this.select(({ loaded }) => loaded);
  readonly loading$ = this.select(({ loading }) => loading);
  readonly questions$ = this.select(({ questions }) => questions);
  readonly bestScore$ = this.select(({ bestScore }) => bestScore);
  readonly playing$ = this.select(({ playing }) => playing);
  readonly played$ = this.select(({ played }) => played);
  readonly finished$ = this.select(({ finished }) => finished);
  readonly currentStep$ = this.select(({ currentStep }) => currentStep);

  constructor(private readonly http: HttpClient) {
    super({
      loaded: false,
      loading: false,
      questions: [],
      bestScore: 0,
      playing: false,
      played: false,
      finished: false,
      currentStep: undefined,
    });
  }

  getQuestionById(id: string): Observable<Question | undefined> {
    return this.questions$.pipe(
      map((questions) => questions.find((question) => question.id === id))
    );
  }

  readonly loading = this.updater((state) => ({
    ...state,
    loading: true,
  }));
  readonly loadSuccess = this.updater((state, questions: Question[]) => ({
    ...state,
    questions,
    loading: false,
    loaded: true,
  }));
  readonly loadFailed = this.updater((state) => ({
    ...state,
    loading: false,
  }));
  readonly load = this.effect(() => {
    this.loading();
    return this._load().pipe(
      tapResponse<Question[]>(
        (questions) => this.loadSuccess(questions),
        () => this.loadFailed()
      )
    );
  });

  readonly start = this.updater((state) => ({
    ...state,
    currentStep: state.questions[0]?.id,
    playing: false,
    finished: false,
  }));

  readonly next = this.updater((state, data: unknown) => {
    const currentStep = state.currentStep;
    const currentQuestion = state.questions.find(
      ({ id }) => id === currentStep
    );
    const nextId = currentQuestion?.nextId;
    const finished = !nextId;
    return {
      ...state,
      currentStep: nextId,
      playing: !finished,
      finished,
      questions: [
        ...state.questions.filter(({ id }) => id !== currentStep),
        {
          ...currentQuestion,
          data,
          valid: this._validateQuestion(currentQuestion.dto, data),
        },
      ],
    };
  });

  readonly reset = this.updater((state) => ({
    ...state,
    currentStep: undefined,
    playing: false,
    played: true,
    finished: false,
    questions: state.questions.map(question => ({
      ...question,
      data: undefined,
      valid: false
    }))
  }));

  private _load(): Observable<Question[]> {
    return this.http
      .get<QuestionDto[]>(
        'https://storage.googleapis.com/netwo-public/quizz.json'
      )
      .pipe(
        // simulate 3s delay loading
        delay(3000),
        map((res) =>
          res
            .map((dto, i) => ({
              id: this._generateId(),
              order: i + 1,
              dto,
              data: undefined,
              valid: false,
            }))
            .map((question, i, arr) => ({
              ...question,
              previousId: arr[i - 1]?.id,
              nextId: arr[i + 1]?.id,
            }))
        )
      );
  }

  private _validateQuestion(question: QuestionDto, data: unknown): boolean {
    switch (question.answerType) {
      case 'choice':
      case 'text': {
        if (!this._isString(data)) {
          return false;
        }
        return question.answer === data;
      }

      case 'multiple-choice': {
        if (!this._isArray(data)) {
          return false;
        }
        return question.answers.every((answer) =>
          data.some((d) => answer === d)
        );
      }

      default:
        return false;
    }
  }

  private _generateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  private _isString(obj: unknown): obj is string {
    return typeof obj === 'string';
  }

  private _isArray<T>(obj: unknown): obj is Array<T> {
    return Array.isArray(obj);
  }
}
