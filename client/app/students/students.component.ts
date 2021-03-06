import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { StudentService } from '../services/student.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Student } from '../shared/models/student.model';
import { WcsService } from '../wcs.service';
import { ActivatedRoute } from '@angular/router';
import { LangageService } from '../services/langage.service';
import { Langage } from '../shared/models/langage.model';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {

  student = new Student();
  students: Student[];
  members: Student[];
  isLoading = true;
  isEditing = false;
  me;
  langage = new Langage();
  langages: Langage[];
  addStudentForm: FormGroup;
  name = new FormControl('', Validators.required);
  lastname = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);
  github = new FormControl('', Validators.required);
  crew = new FormControl('', Validators.required);
  framework = new FormControl('', Validators.required);

  constructor(
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    public toast: ToastComponent,
    private wcsService: WcsService,
    private route: ActivatedRoute,
    private langageService: LangageService,
  ) {}

  ngOnInit() {
    this.getStudent();
    this.getMe();
    this.getLanguage();
  }

  /* getStudent() {
    const token = this.route.snapshot.paramMap.get('token');
    localStorage.getItem('token_wcs');
    this.wcsService.getMe().subscribe((data) => {
      this.wcsService.student = data;
      console.log(data);
      const student = new Student();
      student.name = data['firstname'];
      student.lastname = data['lastname'];
      student.email = data['email'];
      student.WCS_ID = data['id'];
      student.github = data['github'];
      student.admin = data['admin'];
      student.banished = data['banished'];
      student.crew = data['current_crew'];
      console.log(student);
      this.students = student
    });
  } */
  getMe() {
    this.studentService.getMe().subscribe(
      (data) => {
        this.me = data;
        // console.log(this.me);
      },
      error => console.log(error),
      () => this.isLoading = false,
  );
  }

  getStudent() {
    this.studentService.getStudents().subscribe(
      (data) => {
        // console.log(data);
        this.students = data;
        this.members = this.students;
      },
      error => console.log(error),
      () => this.isLoading = false,
    );
  }

  getLanguage() {
    this.langageService.getLangages().subscribe(
      (data) => {
        // console.log(data);
        this.langages = data;
      },
      error => console.log(error),
      () => (this.isLoading = false),
    );
  }

  enableEditing(student: Student) {
    this.isEditing = true;
    this.student = student;
  }

  cancelEditing() {
    this.isEditing = false;
    this.student = new Student();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the cats to reset the editing
    this.getStudent();
  }

  editStudent(student: Student) {
    this.studentService.editStudent(student).subscribe(
      () => {
        this.isEditing = false;
        this.student = student;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error),
    );
  }

  deleteStudent(student: Student) {
    if (
      window.confirm('Are you sure you want to permanently delete this item?')
    ) {
      this.studentService.deleteStudent(student).subscribe(
        () => {
          const pos = this.students.map(elem => elem._id).indexOf(student._id);
          this.students.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error),
      );
    }
  }

  canAddStudent() {
    for (let i = 0; i < this.students.length; i += 1) {
      if (this.students[i].name === this.addStudentForm.value.name) {
        return false;
      }
    }
    return true;
  }

/*   isAdmin() {
    return this.student.admin = true;
  }

  isNotAdmin() {
    return this.student.admin = false;
  }
 */
}
