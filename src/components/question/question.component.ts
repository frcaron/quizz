import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
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
  readonly id$ = this.route.params.pipe(map(params => params['id']));
  readonly question$ = 

  constructor(private readonly quizzService: QuizzService, private readonly route: ActivatedRoute) {}

  next() {
    this.quizzService.next();
  }
}
