import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { Header } from 'src/app/shared/page-header/page-header.component';
import { User } from '../../user.model';
import { MessageService } from '../message.service';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Group } from '../../group/group.model';
import { MatInput } from '@angular/material/input';
import { ElementRef } from '@angular/core';
import { group } from '@angular/animations';



@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.css']
})
export class CreateMessageComponent implements OnInit {
  public messageForm: FormGroup;
  group: Group;
  user: User;
  users: string[] = [];
  header: Header = {title: 'Create New Message'};
  // @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('emailInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  visible = true;
  selectable = true;
  removable = true;
  // addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: string[] = [];
  // selected: string;
  reciver = new FormControl({value: this.emails});
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor(
    public messageService: MessageService,
    public formBuilder: FormBuilder,
    public router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
    const now = new Date();
    this.messageForm = this.formBuilder.group({
      sender: {value: this.user.email, disabled: false},
      reciver: this.reciver,
      date: {value: now, disabled: false},
      title: [''],
      body: ['']
    });
  }

  ngOnInit(): void {
    this.filteredOptions = this.reciver.valueChanges.pipe(
      startWith(''),
      map((email: string | null) => email ? this._filter(email) : this.options.slice()));

    // this.reciver.valueChanges.subscribe(data => this.filteredOptions = this.filter())
    this.group = JSON.parse(localStorage.getItem('group')) as Group;

    for (const key in this.group) {
      if (this.group.hasOwnProperty(key) && this.group[key].status === 'true') {
        this.group[key].uid = key;
        this.users.push(this.group[key].email);
        }
      }
    this.options = this.options.concat(this.users);
  }

  filter(){
   return this.reciver.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  onSubmit(): void {
    console.log(this.emails)
    this.messageForm.value.reciver = this.emails;
    this.messageService.createMessage(this.messageForm.value);
    this.router.navigate(['dashboard/list-messages']);
   }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // add group user
    if ((value || '').trim()) {
      const isOptionSelected = this.matAutocomplete.options.some(option => option.selected);
      if (!isOptionSelected) {
      this.emails.push(value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.reciver.setValue('');
  }

  remove(fruit: string): void {
    const index = this.emails.indexOf(fruit);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    event.option.deselect();
    const val = event.option.viewValue;
    if ( val === this.group.name) {this.emails.push(...this.users);}
    else { this.emails.push(event.option.viewValue); }
    console.log(val)
    this.fruitInput.nativeElement.value = '';
    this.reciver.setValue('');
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(email => email.toLowerCase().indexOf(filterValue) === 0);
  }

  addOnBlur(event: FocusEvent): void {
    const target: HTMLElement = event.relatedTarget as HTMLElement;
    if (!target || target.tagName !== 'MAT-OPTION') {
      const matChipEvent: MatChipInputEvent = {input: this.fruitInput.nativeElement, value : this.fruitInput.nativeElement.value};
      this.add(matChipEvent);
    }
  }

}
