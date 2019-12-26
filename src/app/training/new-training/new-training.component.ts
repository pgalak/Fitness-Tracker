import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  trainingForm = this.fb.group({
    exercise: ['', Validators.required]
  })

  exercises: Exercise[];
  isLoading = true;
  exerciseSubscription: Subscription;
  loadingSubscription: Subscription;

  constructor(private trainingService: TrainingService,
              private fb: FormBuilder,
              private uiService: UIService) { }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    })
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.exercises = exercises;
    });
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExcercises();
  }

  onStartTraining() {
    this.trainingService.startExersice(this.trainingForm.value.exercise);
  }

  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    if ( this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
