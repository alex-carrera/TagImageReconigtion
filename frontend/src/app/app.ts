import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: {
    '[attr.data-theme]': 'theme()'
  }
})
export class App {
  readonly theme = signal<'light' | 'dark'>('dark');
  protected readonly title = signal('frontend');
}
