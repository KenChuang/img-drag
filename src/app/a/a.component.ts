import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-a',
  templateUrl: './a.component.html',
  styleUrls: ['./a.component.css']
})
export class AComponent implements OnInit {

  title = "Report Title";

  constructor() { }

  ngOnInit(): void {
    const q = 'aaa';
    console.log(q);
    console.log('main更新code');
  }

}
