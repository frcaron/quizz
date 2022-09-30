import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { map, Observable, ReplaySubject } from 'rxjs';
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

  readonly model = new SelectionModel();

  @Output() dataChanges = this.model.changed.pipe(
    map(() => this.model.selected)
  ) as Observable<string[]>;

  ngOnDestroy() {
    this._question$.complete();
  }
}
