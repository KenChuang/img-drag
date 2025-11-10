import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-b',
  templateUrl: './b.component.html',
  styleUrls: ['./b.component.css']
})
export class BComponent implements OnInit {

  titleB = '顯示元件B表頭';

  constructor() { }

  ngOnInit(): void {
  }

}
