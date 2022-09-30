import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs';
import { QuizzService } from '../../services/quizz.service';

@Component({
  selector: 'result',
  templateUrl: 'result.component.html',
  styleUrls: ['result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex-fill-column',
  },
})
export class ResultComponent {
  readonly bestScore$ = this.quizzService.bestScore$;
  readonly questions$ = this.quizzService.questions$;
  readonly nbQuestionValid$ = this.questions$.pipe(
    map((questions) => questions.filter(({ valid }) => valid).length)
  );

  constructor(private readonly quizzService: QuizzService) {}

  close() {
    this.quizzService.reset();
  }
}
