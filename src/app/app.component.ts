import { OnInit, Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatChip } from '@angular/material/chips';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { DailyResource } from './daily-resource.model';
import { WindowRef } from './windowref';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  forms: FormGroup[] = [];

  tracks: { value: string; viewValue: string }[] = [
    { value: 'frontend', viewValue: 'FrontEnd' },
    { value: 'backend', viewValue: 'BackEnd' },
    { value: 'design', viewValue: 'Design' },
    { value: 'python_ml', viewValue: 'Python/Machine Learning' },
  ];

  selectedTrack = 'design';

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

  resourceSub: Subscription;

  constructor(
    public auth: AngularFireAuth,
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private windowRef: WindowRef
  ) {
    let index = 0;
    do {
      const title: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]);
      const description: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(20),
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
          description,
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

  ngOnInit(): void {
    this.assignResourceSub();
  }

  async onSubmit(form, day): Promise<void> {
    if (form.status === 'INVALID') {
      return;
    } else {
      day++;
      try {
        await this.db
          .doc<DailyResource>(
            `/resources/bootcamp1/${this.selectedTrack}/day${day}`
          )
          .set(form.value, { merge: true });
        this.snackBar.open(`Day ${day} successfully updated`, '', {
          duration: 2000,
        });
      } catch (error) {
        this.snackBar.open(`Error: ${error.message}. Please retry`, '', {
          duration: 2000,
        });
      }
    }
  }

  assignResourceSub(): void {
    this.resourceSub = this.db
      .collection<DailyResource>(`/resources/bootcamp1/${this.selectedTrack}`)
      .snapshotChanges()
      .subscribe((changes) => {
        for (let change of changes) {
          try {
            const index = Number(change.payload.doc.id.replace('day', '')) - 1;
            const controls = this.forms[index].controls;
            const resource = change.payload.doc.data() as DailyResource;
            for (let key of Object.keys(controls)) {
              controls[key].setValue(resource[key]);
            }
          } catch (error) {
            this.snackBar.open(
              `Error: ${error.message}. Please inform organizers`,
              '',
              {
                duration: 2000,
              }
            );
          }
        }
      });
  }

  reassignResourceSub(event: MatSelectChange): void {
    this.resourceSub.unsubscribe();
    this.forms.forEach((form) => form.reset());
    this.assignResourceSub();
  }
}
