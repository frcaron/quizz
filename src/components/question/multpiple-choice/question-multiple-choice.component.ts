import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { QuestionMultipleChoiceDto } from '../../../models/dto';

@Component({
  selector: 'question-multiple-choice[question]',
  templateUrl: 'question-multiple-choice.component.html',
  styleUrls: ['question-multiple-choice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex-fill-column',
  },
})
export class QuestionMultipleChoiceComponent implements OnDestroy {
  @Input()
  set question(input: QuestionMultipleChoiceDto) {
    this._question$.next(input);
  }
  private readonly _question$ = new ReplaySubject<QuestionMultipleChoiceDto>(1);
  readonly question$ = this._question$.asObservable();

  ngOnDestroy() {
    this._question$.complete();
  }
}
