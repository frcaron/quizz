import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { QuestionTextDto } from '../../../models/dto';

@Component({
  selector: 'question-text[question]',
  templateUrl: 'question-text.component.html',
  styleUrls: ['question-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex-fill-column',
  },
})
export class QuestionTextComponent implements OnDestroy {
  @Input()
  set question(input: QuestionTextDto) {
    this._question$.next(input);
  }
  private readonly _question$ = new ReplaySubject<QuestionTextDto>(1);
  readonly question$ = this._question$.asObservable();

  readonly control = new FormControl();

  @Output() dataChanges = this.control.valueChanges as Observable<string>;

  ngOnDestroy() {
    this._question$.complete();
  }
}
