import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { SessionService } from '../services/session.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Session } from '../shared/models/session.model';
import { WcsService } from '../wcs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
})
export class SessionComponent implements OnInit {
  newSession: Session = new Session();
  session = new Session();
  sessions: Session[] = [];
  isLoading = true;
  isEditing = false;

  addSessionForm: FormGroup;
  date = new FormControl('', Validators.required);
  WCS_ID = new FormControl('', Validators.required);
  // locationId = new FormControl('', Validators.required);

  constructor(
    private sessionService: SessionService,
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    public toast: ToastComponent,
    private wcsService: WcsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.addSessionByStudent();
    this.getSession();
    this.addSessionForm = this.formBuilder.group({
      date: this.date,
      WCS_ID: this.WCS_ID,
    });
  }
  getSession() {
    this.sessionService.getSessions().subscribe(
      (data) => {
        // console.log(data);
        this.sessions = data;
      },
      error => console.log(error),
      () => (this.isLoading = false),
    );
  }

  addSessionByStudent() {
    this.studentService.getMe().subscribe((me) => {
      this.addSessionForm.value.date = me.session;
      this.addSessionForm.value.WCS_ID = me.sessionId;
      this.addSessionForm.value.locationId = me.locationId;
      // console.log(me);
      this.sessionService.addIfNotExist(this.addSessionForm.value).subscribe(
        (session) => {
          this.newSession = new Session;
          // this.sessions.push(session);
          this.addSessionForm.reset();
          console.log(session);
          this.toast.setMessage('item added successfully.', 'success');
        },
        error => console.log(error),
      );
    });
  }

  addSession() {
    if (this.canAddSession()) {
      this.sessionService.addSession(this.addSessionForm.value).subscribe(
          (session) => {
            this.newSession = new Session;
            this.sessions.push(session);
            this.addSessionForm.reset();
            // console.log(session);
            this.toast.setMessage('item added successfully.', 'success');
          },
          error => console.log(error),
        );
    } else {
      this.addSessionForm.reset();
      this.toast.setMessage('projet already exist.', 'warning');
    }
  }

  enableEditing(session: Session) {
    this.isEditing = true;
    this.session = session;
  }

  cancelEditing() {
    this.isEditing = false;
    this.session = new Session();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the cats to reset the editing
    this.getSession();
  }

  editSession(session: Session) {
    this.sessionService.editSession(session).subscribe(
      () => {
        this.isEditing = false;
        this.session = session;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error),
    );
  }

  deleteSession(session: Session) {
    if (
      window.confirm('Are you sure you want to permanently delete this item?')
    ) {
      this.sessionService.deleteSession(session).subscribe(
        () => {
          const pos = this.sessions.map(elem => elem._id).indexOf(session._id);
          this.sessions.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error),
      );
    }
  }

  canAddSession() {
    for (let i = 0; i < this.sessions.length; i += 1) {
      if (this.sessions[i].date === this.addSessionForm.value.date) {
        return false;
      }
    }
    return true;
  }
}
