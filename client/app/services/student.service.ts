import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Student } from '../shared/models/student.model';
import { Langage } from '../shared/models/langage.model';

@Injectable()
export class StudentService {

  mail = '';
  name = '';

  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>('/api/students');
  }

  getMe(): Observable<Student> {
    const id = localStorage.getItem('WCS_ID');
    return this.http.get<Student>(`/api/student/wcs/${id}`);
  }

  getMyLocation(): Observable<Student> {
    const locationid = localStorage.getItem('locationId');
    return this.http.get<Student>(`/api/student/wcs/${locationid}`);
  }

  getLangageById(langageId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`/api/student/langage/${langageId}`);
  }
  getStudentById(WCS_ID: number): Observable<Student[]> {
    return this.http.get<Student[]>(`/api/student/${WCS_ID}`);
  }
  getStudentBySession(sessionId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`/api/student/session/${sessionId}`);
  }
  countStudents(): Observable<number> {
    return this.http.get<number>('/api/students/count');
  }

  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>('/api/student', student);
  }

  addStudentIfNotExists(student: Student): Observable<Student> {
    return this.http.post<Student>('/api/student/ifNotExists', student);
  }

  getStudent(studentid: string): Observable<Student> {
    return this.http.get<Student>(`/api/student/${studentid}`);
  }

  editStudent(student: Student): Observable<string> {
    return this.http.put(`/api/student/${student._id}`, student, { responseType: 'text' });
  }

  deleteStudent(student: Student): Observable<string> {
    return this.http.delete(`/api/student/${student._id}`, { responseType: 'text' });
  }
}
