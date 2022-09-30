import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  VERSION,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, exhaustMap, filter, takeUntil, timer } from 'rxjs';
import { QuizzService } from '../services/quizz.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'flex-fill-column',
  },
})
export class AppComponent implements OnInit {
  readonly debug = false;
  readonly state$ = this.quizzService.state$;
  readonly currentStep$ = this.quizzService.currentStep$;
  readonly playing$ = this.quizzService.playing$;
  readonly finished$ = this.quizzService.finished$;

  constructor(
    private readonly quizzService: QuizzService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    // load quizz question
    this.quizzService.load();

    // not necessary to unsubscibe cause we are in the root component
    combineLatest({
      currentStep: this.currentStep$,
      finished: this.finished$,
    }).subscribe(({ currentStep, finished }) => {
      if (currentStep) {
        this.router.navigate(['..', 'question', currentStep]);
        return;
      }
      if (finished) {
        this.router.navigate(['..', 'result']);
        return;
      }
      this.router.navigate(['..', 'home']);
      return;
    });

    // automatically stop the game after 2mn
    // not necessary to unsubscibe cause we are in the root component
    this.playing$
      .pipe(
        filter((is) => is),
        exhaustMap(() =>
          timer(2 * 60 * 1000).pipe(
            takeUntil(this.finished$.pipe(filter((is) => is)))
          )
        )
      )
      .subscribe(() => this.quizzService.stop());
  }
}
