import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  map,
  of,
  switchMap,
  tap,
  interval,
  filter,
  startWith,
} from 'rxjs';
import { QuizzService } from '../../services/quizz.service';
import { notNullOrUndefined } from '../../utils/util';

@Component({
  selector: 'question',
  templateUrl: 'question.component.html',
  styleUrls: ['question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex-fill-column',
  },
})
export class QuestionComponent implements OnDestroy {
  readonly id$ = this.route.params.pipe(map((params) => params['id']));
  readonly question$ = this.id$.pipe(
    tap(() => this._answer$.next(undefined)),
    switchMap((id) =>
      id ? this.quizzService.getQuestionById(id) : of(undefined)
    )
  );
  readonly questions$ = this.quizzService.questions$;
  readonly playStartTs$ = this.quizzService.playStartTs$;

  readonly timer$ = this.playStartTs$.pipe(
    filter(notNullOrUndefined),
    switchMap((ts) =>
      interval(1 * 1000).pipe(
        startWith(0),
        map(() => new Date().getTime() - ts),
        map((time) => Math.round(time / 1000))
      )
    )
  );

  // answer cache should be replace by a form control if subfield has been value accessor
  private readonly _answer$ = new BehaviorSubject<unknown | undefined>(
    undefined
  );
  readonly answer$ = this._answer$.asObservable();

  constructor(
    private readonly quizzService: QuizzService,
    private readonly route: ActivatedRoute
  ) {}

  next() {
    this.quizzService.next(this._answer$.value);
  }

  ngOnDestroy() {
    this._answer$.complete();
  }

  onAnswerChange(data: unknown) {
    this._answer$.next(data);
  }
}
