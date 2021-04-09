import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {
@Input() header: Header;
  constructor() { }

  ngOnInit(): void {
  }
  back(): void{
    window.history.back()
  }
}

export class Header {
  title: string;
  button?: string;
  url?: string;
}