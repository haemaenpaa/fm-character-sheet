import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css'],
})
export class LoginButtonComponent {
  constructor(private auth: AuthService, private route: ActivatedRoute) {}
  handleLogin() {
    this.auth.loginWithRedirect({
      appState: {
        target: this.route.pathFromRoot.join('/'),
      },
    });
  }
}
