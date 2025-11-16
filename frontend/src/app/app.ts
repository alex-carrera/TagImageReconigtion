import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styleUrl: './app.css',
  host: {
    '[attr.data-theme]': 'theme()'
  }
})
export class App {
  readonly theme = signal<'light' | 'dark'>('light');
  protected readonly title = signal('frontend');
}
