import { Component, OnInit } from '@angular/core';

import {AuthService} from '../auth.service';

@Component({
  selector: 'app-tool-bar-scalable',
  templateUrl: './tool-bar-scalable.component.html',
  styleUrls: ['./tool-bar-scalable.component.scss']
})
export class ToolBarScalableComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

}
