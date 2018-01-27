import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { Message } from 'primeng/components/common/message';

@Injectable()
export class NotificationService {
    private onNewMessageSubject: Subject<Message> = new Subject<Message>();

    public onNewMessageStream(): Subject<Message> {
        return this.onNewMessageSubject;
    }

    constructor() {}

    public addError(summary: string, detail: string): void {
        this.addMessage('error', summary, detail);
    }

    public addSuccess(summary: string, detail: string): void {
        this.addMessage('success', summary, detail);
    }

    public addInfo(summary: string, detail: string): void {
        this.addMessage('info', summary, detail);
    }

    private addMessage(severity: string, summary: string, detail: string): void {
        this.onNewMessageSubject.next({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }
}