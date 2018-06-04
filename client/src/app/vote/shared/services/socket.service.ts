
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { Event } from '../model/event';
// import { Observable } from 'rxjs/Observable';
// import { Observer } from 'rxjs/Observer';
import { Vote } from '../model/vote';


const SERVER_URL = 'http://localhost:8080';

@Injectable()
export class SocketService {
  private socket;

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  public send(vote: Vote): void {
    this.socket.emit('vote', vote);
  }

  public onVote(): Observable<Vote> {
    return new Observable<Vote>(observer => {
      this.socket.on('vote', (data: Vote) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}