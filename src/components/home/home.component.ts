import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Question, QuizzService } from '../../services/quizz.service';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  readonly loading$ = this.quizzService.loading$;
  readonly loaded$ = this.quizzService.loaded$;
  readonly questions$ = this.quizzService.questions$;
  readonly bestScore$ = this.quizzService.bestScore$;
  readonly playAtLeastOne$ = this.quizzService.playAtLeastOne$;

  constructor(
    private readonly quizzService: QuizzService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    // load quizz question
    this.quizzService.load();
  }

  start(questions: Question[]) {
    const [first] = questions;
    if (!first) {
      return;
    }
    this.router.navigate(['question', first.id]);
  }
}
