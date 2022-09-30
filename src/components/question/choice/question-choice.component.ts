import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { QuestionChoiceDto } from '../../../models/dto';

@Component({
  selector: 'question-choice[question]',
  templateUrl: 'question-choice.component.html',
  styleUrls: ['question-choice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex-fill-column',
  },
})
export class QuestionChoiceComponent implements OnDestroy {
  @Input()
  set question(input: QuestionChoiceDto) {
    this._question$.next(input);
    this.control.reset();
  }
  private readonly _question$ = new ReplaySubject<QuestionChoiceDto>(1);
  readonly question$ = this._question$.asObservable();

  readonly control = new FormControl();

  @Output() answerChange = this.control.valueChanges as Observable<string>;

  ngOnDestroy() {
    this._question$.complete();
  }
}
