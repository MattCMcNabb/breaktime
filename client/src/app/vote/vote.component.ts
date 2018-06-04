import { Component, OnInit } from '@angular/core';
import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Vote } from './shared/model/vote';
import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { DialogUserType } from './dialog-user/dialog-user-type';

const AVATAR_URL = 'https://api.adorable.io/avatars/285';

@Component({
  selector: 'tcc-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  action = Action;
  user: User;
  votes: Vote[] = [];
  voteContent: string;
  ioConnection: any;
  dialogRef: MatDialogRef<DialogUserComponent> | null;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      dialogType: DialogUserType.NEW
    }
  };

  constructor(
    private socketService: SocketService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initModel();
    // Using timeout due to https://github.com/angular/angular/issues/14748
    setTimeout(() => {
      this.openUserPopup(this.defaultDialogUserParams);
    }, 0);
  }

  private initModel(): void {
    const randomId = this.getRandomId();
    this.user = {
      id: randomId,
      avatar: `${AVATAR_URL}/${randomId}.png`
    };
  }

  private getRandomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onVote()
      .subscribe((vote: Vote) => {
        this.votes.push(vote);
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  public onClickUserInfo() {
    this.openUserPopup({
      data: {
        username: this.user.name,
        title: 'Edit Details',
        dialogType: DialogUserType.EDIT
      }
    });
  }

  private openUserPopup(params): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      this.user.name = paramsDialog.username;
      if (paramsDialog.dialogType === DialogUserType.NEW) {
        this.initIoConnection();
        this.sendNotification(paramsDialog, Action.JOINED);
      } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
        this.sendNotification(paramsDialog, Action.RENAME);
      }
    });
  }

  public sendVote(vote: string): void {
    if (!vote) {
      return;
    }

    this.socketService.send({
      from: this.user,
      content: vote
    });
    this.voteContent = null;
  }

  public sendNotification(params: any, action: Action): void {
    let vote: Vote;

    if (action === Action.JOINED) {
      vote = {
        from: this.user,
        action: action
      };
    } else if (action === Action.RENAME) {
      vote = {
        action: action,
        content: {
          username: this.user.name,
          previousUsername: params.previousUsername
        }
      };
    }

    this.socketService.send(vote);
  }
}
