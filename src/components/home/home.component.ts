import { ChangeDetectionStrategy, Component } from "@angular/core";
import { QuizzService } from "../../services/quizz.service";

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly loading$ = this.quizzService.loading$;
  readonly loaded$ = this.quizzService.loaded$;

  constructor (private readonly quizzService: QuizzService){}
}