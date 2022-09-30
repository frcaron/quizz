import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Question, QuizzService } from '../../services/quizz.service';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex-fill-column',
  },
})
export class HomeComponent {
  readonly loading$ = this.quizzService.loading$;
  readonly loaded$ = this.quizzService.loaded$;
  readonly questions$ = this.quizzService.questions$;
  readonly bestScore$ = this.quizzService.bestScore$;
  readonly played$ = this.quizzService.played$;

  constructor(private readonly quizzService: QuizzService) {}

  start() {
    this.quizzService.start();
  }
}
