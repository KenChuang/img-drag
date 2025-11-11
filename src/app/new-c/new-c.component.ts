import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-c',
  templateUrl: './new-c.component.html',
  styleUrls: ['./new-c.component.css']
})
export class NewCComponent implements OnInit {

  list: string[] = [];

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < 10; i++) {
      this.list.push(`NO_${i}`);
    }
  }

}
