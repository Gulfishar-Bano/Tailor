import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-measurements',
  standalone: true,
  imports: [Navbar],
  template: `
    <app-navbar></app-navbar>
    <div style="max-width: 480px; margin: 4rem auto; text-align: center; font-family: 'Work Sans', sans-serif; color: #6B6255;">
      <h2 style="font-family: 'Fraunces', Georgia, serif; color: #2F4156;">Saved Measurements</h2>
      <p>This feature is coming soon — you'll be able to save your measurements here for faster future orders.</p>
    </div>
  `,
})
export class Measurements {}