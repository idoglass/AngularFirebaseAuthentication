import { Component, OnInit } from '@angular/core';
import { Header } from 'src/app/shared/page-header/page-header.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  header: Header;
  constructor() { }

  ngOnInit(): void {
    this.header = {title: 'Settings', button: 'Save', url: '/dashboard/group-profile/'};
  }

}
