import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map, of, switchMap } from 'rxjs';
import { QuizzService } from '../../services/quizz.service';

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
    switchMap((id) =>
      id ? this.quizzService.getQuestionById(id) : of(undefined)
    )
  );
  readonly questions$ = this.quizzService.questions$;

  private _data$ = new BehaviorSubject<unknown | undefined>(undefined);

  constructor(
    private readonly quizzService: QuizzService,
    private readonly route: ActivatedRoute
  ) {}

  next() {
    this.quizzService.next(this._data$.value);
  }

  ngOnDestroy() {
    this._data$.complete();
  }

  onDataChange(data: unknown) {
    this._data$.next(data)
  }
}
