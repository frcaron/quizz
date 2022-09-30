import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from '../components/home/home.component';
import { QuestionComponent } from '../components/question/question.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ResultComponent } from '../components/result/result.component';
import { QuestionTextComponent } from '../components/question/text/question-text.component';
import { QuestionMultipleChoiceComponent } from '../components/question/multpiple-choice/question-multiple-choice.component';
import { QuestionChoiceComponent } from '../components/question/choice/question-choice.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    QuestionComponent,
    QuestionChoiceComponent,
    QuestionMultipleChoiceComponent,
    QuestionTextComponent,
    ResultComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
