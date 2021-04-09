import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { Message } from '../message.model';
import { User } from '../../user.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Header } from 'src/app/shared/page-header/page-header.component';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MessageListComponent implements OnInit {
  Messages: Message[];
  sent: Message[];
  inbox: Message[];
  showMessages: Message[] = [];
  user: User;
  selected = true;

  dataSource = this.showMessages;
  columnsToDisplay = ['sender', 'title', 'date', 'action'];
  expandedElement: Message | null;

  header: Header = {title:'Messages',button:'new message',url:'/dashboard/create-message'};

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this. user = JSON.parse(localStorage.getItem('user'));
    this.messageService.getMessageList(this.user.email).subscribe(res => {
      this.Messages = res.map( e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Message
        } as Message;
      });
      this.Messages = [...new Map(this.Messages.map((item: Message) =>   [item.id, item])).values()];
      this.Messages.sort((a, b) =>  new Date(a.date).getTime() - new Date(b.date).getTime());
      this.showMessages = this.Messages;
      this.sent = this.Messages.filter((item: Message) => item.sender === this.user.email)
                                .sort((a, b) =>  new Date(a.date).getTime() - new Date(b.date).getTime());
      this.inbox = this.Messages.filter((item: Message) => item.reciver.includes( this.user.email))
                                .sort((a, b) =>  new Date(a.date).getTime() - new Date(b.date).getTime());
      this.selected ? this.showMessages = this.inbox : this.showMessages = this.sent;
    });

  }
setInbox(data){
  if (data === 'inbox'){
    this.showMessages = this.inbox;
    this.selected = true;
  }else{
    this.showMessages = this.sent;
    this.selected = false;
  }
}
expanded(message){
    console.log(message);

    if (this.expandedElement?.id === message.id){ return null; } else {
      this.messageService.markAsRead(message, false, this.user.email);
      return message;
    }
}

removeMessage = message => this.messageService.deleteMessage(message, this.user.email);

markAsReadMessage = (message) => this.messageService.markAsRead(message, !message.new, this.user.email);

color = email => {
  if (email ){ return {color: 'black', background: 'beige', 'font-weight': 'bold' };} else {return {color: 'black', background: 'white'}; }
}



}
