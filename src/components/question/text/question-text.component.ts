import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { ReplaySubject } from 'rxjs';
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

  ngOnDestroy() {
    this._question$.complete();
  }
}
