import { Component, OnInit } from '@angular/core';
import { Header } from 'src/app/shared/page-header/page-header.component';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  header: Header;
  constructor() { }

  ngOnInit(): void {
    this.header = {title: 'Help '};
  }

}
