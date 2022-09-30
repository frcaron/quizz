import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  constructor(private readonly quizzService: QuizzService) {}

  close() {
    this.quizzService.reset();
  }
}
