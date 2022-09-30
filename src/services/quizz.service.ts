import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { map, Observable, delay } from 'rxjs';
import { QuestionDto } from '../models/dto';
import { generateId, isArray, isString } from '../utils/util';

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
  readonly playStartTs: number | undefined;
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
  readonly playStartTs$ = this.select(({ playStartTs }) => playStartTs);
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
      playStartTs: undefined,
      playing: false,
      played: false,
      finished: false,
      currentStep: undefined,
    });
  }

  /**
   * Find question with the given id
   */
  getQuestionById(id: string): Observable<Question | undefined> {
    return this.questions$.pipe(
      map((questions) => questions.find((question) => question.id === id))
    );
  }

  /**
   * Load quizz
   */
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

  /**
   * Start quizz
   */
  readonly start = this.updater((state) => ({
    ...state,
    currentStep: state.questions[0]?.id,
    playStartTs: new Date().getTime(),
    playing: true,
    finished: false,
  }));

  /**
   * Stop quizz
   */
  readonly stop = this.updater((state) => ({
    ...state,
    currentStep: undefined,
    playing: false,
    finished: true,
  }));

  /**
   * Next question
   */
  readonly next = this.updater((state, data: unknown) => {
    const currentStep = state.currentStep;
    const currentQuestion = state.questions.find(
      ({ id }) => id === currentStep
    );
    const nextId = currentQuestion?.nextId;
    const finished = !nextId;
    const questions = [
      ...state.questions.filter(({ id }) => id !== currentStep),
      {
        ...currentQuestion,
        data,
        valid: this._validateQuestion(currentQuestion.dto, data),
      },
    ];
    const score = questions.filter(({ valid }) => valid).length;
    return {
      ...state,
      currentStep: nextId,
      playing: !finished,
      finished,
      questions,
      bestScore: score > state.bestScore ? score : state.bestScore,
    };
  });

  /**
   * Reset quizz
   */
  readonly reset = this.updater((state) => ({
    ...state,
    currentStep: undefined,
    playStartTs: undefined,
    playing: false,
    played: true,
    finished: false,
    questions: state.questions.map((question) => ({
      ...question,
      data: undefined,
      valid: false,
    })),
  }));

  private _load(): Observable<Question[]> {
    return this.http
      .get<QuestionDto[]>(
        'https://storage.googleapis.com/netwo-public/quizz.json'
      )
      .pipe(
        // simulate 2s delay loading
        delay(2000),
        map((res) =>
          res
            .map((dto, i) => ({
              id: generateId(),
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
        if (!isString(data)) {
          return false;
        }
        return question.answer.trim().toLowerCase() === data.trim().toLowerCase();
      }

      case 'multiple-choice': {
        if (!isArray(data)) {
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
}
