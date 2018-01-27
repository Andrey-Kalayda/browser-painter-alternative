import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { Subscription } from 'rxjs/Rx';
import { NotificationService } from './core/notification.service';

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  messages: Array<Message> = [];

  constructor(private notificationService: NotificationService) { }

  private messageSubscription: Subscription;

  ngOnInit() {
    this.messageSubscription = this.notificationService.onNewMessageStream().subscribe(message => {
      this.messages.push(message);
    });
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }
}
