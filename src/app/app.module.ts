import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    QuestionComponent,
    ResultComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
