import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';
 
export class Message {
  key: string;
  value: string;
}


@Injectable()
export class EditorStorageService {
  private onMessage: Subject<Message> = new Subject<Message>();

  public onMessageStream(): Subject<Message> {
    return this.onMessage;
  }

  constructor() {
    window.addEventListener('storage', (evt) => this.onStorageUpdate(evt), false);
  }

  public sendMessage(data: Message): void {
    localStorage.setItem(data.key, data.value);
  }

  private onStorageUpdate(evt: StorageEvent): void {
    this.onMessage.next({
      key: evt.key,
      value: evt.newValue
    });
  }
}