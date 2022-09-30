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
}

interface State {
  readonly loaded: boolean;
  readonly loading: boolean;
  readonly questions: Question[];
  readonly bestScore: number;
  readonly playAtLeastOne: boolean;
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
  readonly playAtLeastOne$ = this.select(
    ({ playAtLeastOne }) => playAtLeastOne
  );
  readonly finished$ = this.select(({ finished }) => finished);
  readonly currentStep$ = this.select(({ currentStep }) => currentStep);

  constructor(private readonly http: HttpClient) {
    super({
      loaded: false,
      loading: false,
      questions: [],
      bestScore: 0,
      playAtLeastOne: false,
      finished: false,
      currentStep: undefined,
    });
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
    finished: false,
  }));

  readonly next = this.updater((state) => {
    const nextId = state.questions.find(
      ({ id }) => id === state.currentStep
    )?.nextId;
    const finished = !nextId;
    return {
      ...state,
      currentStep: nextId,
      finished,
    };
  });

  readonly reset = this.updater((state) => state);

  private _load(): Observable<Question[]> {
    return this.http
      .get<QuestionDto[]>(
        'https://storage.googleapis.com/netwo-public/quizz.json'
      )
      .pipe(
        // simulate long loading
        delay(3000),
        map((res) =>
          res
            .map((dto, i) => ({
              id: this.generateId(),
              order: i + 1,
              dto,
            }))
            .map((question, i, arr) => ({
              ...question,
              previousId: arr[i - 1]?.id,
              nextId: arr[i + 1]?.id,
            }))
        )
      );
  }

  private generateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
