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

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    MatButtonModule
  ],
  declarations: [AppComponent, HomeComponent, QuestionComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
