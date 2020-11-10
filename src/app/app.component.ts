import { OnInit, Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatChip } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { DailyResource, IntroResource, Resource } from './resources.model';
import { WindowRef } from './windowref';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  forms: FormGroup[] = [];

  tracks: { value: string; viewValue: string }[] = [
    { value: 'frontend', viewValue: 'FrontEnd' },
    { value: 'backend', viewValue: 'BackEnd' },
    { value: 'design', viewValue: 'Design' },
    { value: 'python_ml', viewValue: 'Python/Machine Learning' }
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
    this.forms[0] = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(5)]),
      description: new FormControl('', [Validators.required, Validators.minLength(20)]),
      objectives: new FormArray(
        [  
          new FormControl('', [Validators.required, Validators.minLength(20)]),
          new FormControl('', [Validators.required, Validators.minLength(20)])
        ],
        [Validators.required, Validators.minLength(2)]
      ),
      requirements: new FormArray(
        [new FormControl('', [Validators.required, Validators.minLength(20)])],
        [Validators.required, Validators.minLength(2)]
      )
    });
    
    let index = 1;
    do {
      const title: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ]);
      const description: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(20)
      ]);
      const objectives: FormArray = new FormArray(
        [  
          new FormControl('', [Validators.required, Validators.minLength(20)]),
          new FormControl('', [Validators.required, Validators.minLength(20)])
        ],
        [Validators.required, Validators.minLength(2)]
      );
      const link: FormControl = new FormControl('', [
        Validators.required,
        Validators.pattern(/^https?:\/\/.+\..+/)
      ]);
      const assignment: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(20)
      ]);
      const corrections: FormArray = new FormArray(
        [new FormControl('', [Validators.required, Validators.minLength(20)])],
        [Validators.required, Validators.minLength(1)]
      );

      this.forms.push(
        new FormGroup({
          title,
          description,
          objectives,
          link,
          assignment,
          corrections
        })
      );
      index++;
    } while (index <= 30);
  }

  ngOnInit(): void {
    this.assignResourceSub();
  }

  async onSubmit(form, day): Promise<void> {
    if (form.status === 'INVALID') {
      this.snackBar.open('Please correct the errors', '', {
        duration: 2000
      });
      return;
    } else {
      try {
        await this.db
          .doc<DailyResource>(
            `/resources/bootcamp1/${this.selectedTrack}/day${day}`
          )
          .set(form.value, { merge: true });
        this.snackBar.open(`Day ${day} successfully updated`, '', {
          duration: 2000
        });
      } catch (error) {
        this.snackBar.open(`Error: ${error.message}. Please retry`, '', {
          duration: 2000
        });
      }
    }
  }

  assignResourceSub(): void {
    this.resourceSub = this.db
      .collection<Resource>(`/resources/bootcamp1/${this.selectedTrack}`)
      .snapshotChanges()
      .subscribe((changes) => {
        for (let change of changes) {
          try {
            const index = Number(change.payload.doc.id.replace('day', ''));
            const controls = this.forms[index].controls;
            const resource = index === 0 
              ? change.payload.doc.data() as IntroResource
              : change.payload.doc.data() as DailyResource;
            for (let key of Object.keys(controls)) {
              if (Array.isArray(resource[key])) {
                (controls[key] as FormArray).clear();
                resource[key].forEach((value) => {
                  (controls[key] as FormArray).push(new FormControl(value));
                });
              } else {
                controls[key].setValue(resource[key]);
              }
            }
          } catch (error) {
            this.snackBar.open(
              `Error: ${error.message}. Please inform organizers`,
              '',
              {
                duration: 2000
              }
            );
          }
        }
      });
  }

  reassignResourceSub(): void {
    this.resourceSub.unsubscribe();
    this.forms.forEach((form) => form.reset());
    this.assignResourceSub();
  }

  addControl(array: FormArray): void {
    array.push(new FormControl());
  }

  removeControl(array: FormArray, index: number): void {
    array.removeAt(index);
  }
}
