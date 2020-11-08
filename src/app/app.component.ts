import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatChip } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { WindowRef } from './windowref';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  controls: {
    title: FormControl;
    link: FormControl;
    assignment: FormControl;
    correction1: FormControl;
    correction2: FormControl;
    correction3: FormControl;
  }[] = [];
  forms: FormGroup[] = [];

  tracks: { value: string; viewValue: string }[] = [
    { value: 'frontend', viewValue: 'FrontEnd' },
    { value: 'backend', viewValue: 'BackEnd' },
    { value: 'design', viewValue: 'Design' },
    { value: 'python_ml', viewValue: 'Python/Machine Learning' },
  ];

  window = this.windowRef.nativeWindow;

  scrolledDown$: Observable<boolean> = new Observable((subscriber) => {
    const checkScroll = (): void => {
      if (this.window.scrollY > this.window.innerHeight) {
        subscriber.next(true);
      } else {
        subscriber.next(false);
      }
    };

    this.window.addEventListener('scroll', checkScroll);

    return () => {
      this.window.removeEventListener('scroll', checkScroll);
    };
  });

  selectedTrack = 'design';
  constructor(public auth: AngularFireAuth, private snackBar: MatSnackBar, private windowRef: WindowRef) {
    let index = 0;
    do {
      const title: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]);
      const link: FormControl = new FormControl('', [
        Validators.required,
        Validators.pattern(/^https?:\/\/.+\..+/),
      ]);
      const assignment: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(20),
      ]);
      const correction1: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(20),
      ]);
      const correction2: FormControl = new FormControl(
        '',
        Validators.minLength(20)
      );
      const correction3: FormControl = new FormControl(
        '',
        Validators.minLength(20)
      );

      this.forms.push(
        new FormGroup({
          title,
          link,
          assignment,
          correction1,
          correction2,
          correction3,
        })
      );
      index++;
    } while (index < 30);
  }

  onSubmit(form, day): void {
    if (form.status === 'INVALID') {
      return;
    } else {
      console.log(form.value);
      this.snackBar.open(`Day ${day + 1} successfully updated`, '', {
        duration: 2000,
      });
    }
  }
}
