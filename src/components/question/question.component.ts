import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: 'question',
  templateUrl: 'question.component.html',
  styleUrls: ['question.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent {

}