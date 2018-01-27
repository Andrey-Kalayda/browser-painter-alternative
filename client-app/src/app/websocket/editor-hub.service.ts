import { Injectable } from '@angular/core';
import {HubConnection} from '@aspnet/signalr-client';
import { environment } from 'environments/environment.prod';
import { Subject } from 'rxjs/Subject';

export class HubMessage {
    key: string;
    value: string;
}

@Injectable()
export class EditorHubService {
    protected _hubUrl: string;

    private editorHub: HubConnection;

    private onMessageReceived: Subject<HubMessage> = new Subject<HubMessage>();

    public onMessageReceivedStream(): Subject<HubMessage> {
        return this.onMessageReceived;
    }

    constructor() {
        this._hubUrl = environment.editor_hub_url;
        this.editorHub = new HubConnection(this._hubUrl);
    }

    public connect(): void {
        this.editorHub
            .start()
            .then(() => {
                console.log('%cEditorHub connection started', 'color:green');
                this.sendMessage({
                    key: 'onConnect',
                    value: 'New User connected to our editor app'
                });
            })
            .catch(() => {
                console.error('Error establishing the EditorHub connection');
            });
        this.addReceiveHandler('onConnect');
        this.addReceiveHandler('onDisconnect');
    }

    public disconnect(): void {
        this.editorHub.stop();
    }

    public sendMessage(message: HubMessage): void {
        this.editorHub.invoke(message.key, message.value)
            .catch(error => console.error(error));
    }

    public addReceiveHandler(key: string) {
        this.editorHub.on(key, data => {
            this.onMessageReceived.next({
                key: key,
                value: data
            });
        });
    }
}