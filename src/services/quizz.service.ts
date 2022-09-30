import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { map, Observable } from 'rxjs';

interface Question {
  readonly id: number;
  readonly dto: QuestionDto;
}

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

  constructor(private readonly http: HttpClient) {
    super({
      loaded: false,
      loading: false,
      questions: [],
      bestScore: 0,
      playAtLeastOne: false,
    });
  }

  readonly load = this.effect(() => {
    this.loading();
    return this._load().pipe(
      tapResponse<Question[]>(
        (questions) => this.loadSuccess(questions),
        () => this.loadFailed()
      )
    );
  });

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

  private _load(): Observable<Question[]> {
    return this.http
      .get<QuestionDto[]>(
        'https://storage.googleapis.com/netwo-public/quizz.json'
      )
      .pipe(
        map((res) =>
          res.map((dto, id) => ({
            id,
            dto,
          }))
        )
      );
  }
}
