import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input()
card: card;

@Output() newClick = new EventEmitter< cardButton | menuButton>();

  constructor(public router: Router, ) { }

  ngOnInit(): void {
  }

  onClick(button: cardButton | menuButton): void{
    'id' in button ? this.newClick.emit(button) : this.router.navigate([button.url]);
    console.log('click ', button);
  }

}

export class card {
  title: string;
  subTitle: string;
  content: string;
  icon: string;
  button?: cardButton[];
  color?: string;
  backGround?: string;
  menuButton?: menuButton[];

}

export class cardButton {
  name: string;
  url: string;
  color?: string;
  id?: string;
}
export class menuButton {
  name: string;
  icon: string;
  id: string;
  type: string;
  url?: string;
}