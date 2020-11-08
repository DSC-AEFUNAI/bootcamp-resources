import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatChip } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  dayOneForm: FormGroup;
  titleControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5)
  ]);
  linkControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+\..+/)
  ]);
  assignmentControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(20)
  ]);
  correction1Control: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(20)
  ]);
  correction2Control: FormControl = new FormControl(
    '',
    Validators.minLength(20)
  );
  correction3Control: FormControl = new FormControl(
    '',
    Validators.minLength(20)
  );
  tracks: { value: string; viewValue: string }[] = [
    { value: 'frontend', viewValue: 'FrontEnd' },
    { value: 'backend', viewValue: 'BackEnd' },
    { value: 'design', viewValue: 'Design' },
    { value: 'python_ml', viewValue: 'Python/Machine Learning' }
  ];
  selectedTrack = 'design';
  constructor(public auth: AngularFireAuth, private snackBar: MatSnackBar) {
    this.dayOneForm = new FormGroup({
      title: this.titleControl,
      link: this.linkControl,
      assignment: this.assignmentControl,
      correction1: this.correction1Control,
      correction2: this.correction2Control,
      correction3: this.correction3Control
    });
  }

  onSubmit(dayOneForm): void {
    if (dayOneForm.status === 'INVALID') {
      return;
    } else {
      console.log(dayOneForm.value);
      this.snackBar.open('Day 1 successfully updated', '', {
        duration: 2000
      });
    }
  }
}
