import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-tool-bar-scalable',
  templateUrl: './tool-bar-scalable.component.html',
  styleUrls: ['./tool-bar-scalable.component.scss']
})
export class ToolBarScalableComponent implements OnInit {

  constructor(private router:Router, private authService: AuthService) { }

  ngOnInit() {
  }
  
  logout() {
      this.authService.logout();
      this.router.navigate(["/"]); // redirect home
  }

}
