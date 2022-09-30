import { ChangeDetectionStrategy, Component } from '@angular/core';
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
export class QuestionComponent {
  constructor(private readonly quizzService: QuizzService) {}

  next() {
    this.quizzService.next();
  }
}
