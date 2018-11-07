import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectService} from "../../services/project.service";
import {FormDataService} from "../../services/form-data.service";
import {MatDialog} from "@angular/material";
import {DialogData, EvalListComponent} from "../eval-list/eval-list.component";
import {EvalAssignService} from "../services/eval-assign.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {NavBarTitleService} from "../../components/services/nav-bar-title.service";
import {PresentationControlService} from "../services/presentation-control.service";
import {STATES} from "../../core/model/prsentation-control";

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})
export class PresentationComponent implements OnInit, OnDestroy {

  projectId
  originalPId;
  presentId;

  panelState: boolean

  onceLoaded = false;

  groupList: any[];

  stateTitle = "No operations"

  disabledPauseButton = true;
  disabledCancelButton = true;
  disabledStartButton = true;

  presentationState = STATES.finished;

  selectedGroup

  finishedList = [];


  constructor(private router: Router,
              private route: ActivatedRoute,
              private projectService: ProjectService,
              public formDataService: FormDataService,
              private titleBar: NavBarTitleService,
              private dialog: MatDialog,
              private evs: EvalAssignService,
              public presentControl: PresentationControlService) {
  }

  ngOnInit() {
    this.titleBar.setTitle("Presentation")
    this.route.parent.parent.params.subscribe(params => {
      this.projectId = Number(params.id);
      console.log(params)
      this.route.params.subscribe(next => {
        this.presentId = next.id
        this.projectService.getOriginalProjectId(this.projectId)
          .subscribe(next => {
            this.originalPId = next

            this.formDataService.presentationId = this.presentId;
            this.formDataService.projectId = this.originalPId;

            this.presentControl.getGroupList(this.originalPId).subscribe(next => this.groupList = next)
            this.presentControl.getFinishedList(this.originalPId, this.presentId).subscribe(next => this.finishedList = next)
            this.presentControl.getRealTimeStates(this.originalPId, this.presentId).subscribe(
              next => {

              }
            )
          })
      })


    });


  }

  createForm() {

    this.router.navigate(['/create-form'])
  }


  ngOnDestroy(): void {
  }

  panelStateOpen() {
    this.panelState = true
    this.onceLoaded = true
  }

  panelStateClose() {
    this.panelState = false
  }

  shareForm(event) {

    let dialogRef;

    this.evs.getAssigneeList({id: event}).pipe(
      switchMap(value => {
        if (value != undefined)
          dialogRef = this.dialog.open(EvalListComponent, {
            data: {evalList: value} as DialogData,
            panelClass: "custom-modalbox",
            width: "600px"
          });
        else
          dialogRef = this.dialog.open(EvalListComponent, {
            data: {evalList: []} as DialogData,
            panelClass: "custom-modalbox",
            width: "600px"
          });
        return of(dialogRef)
      }),
      switchMap(
        value => {
          return dialogRef.componentInstance.onAssign

        }
      )
    ).subscribe(
      next => {
        let k = dialogRef.componentInstance.selectedMap
        let evalList = []
        k.forEach(item => evalList.push(item))
        this.evs.assignEvaluators({formId: event, evalList: evalList})

      }
    )
  }


  startPresentation() {
    this.presentControl.setStates(STATES.suspended, "1", this.originalPId, this.presentId)
    console.log(STATES.suspended)
    if (this.presentationState == STATES.running) {
      this.pausePresentation();
    }
    else if (this.presentationState == STATES.paused) {
      this.startPresentation()
    }
  }

  pausePresentation() {

  }

  cancelPresentation() {

  }

  finishPresentation() {

  }


  selectionChange(event) {
    this.selectedGroup = event.value;
    this.disabledStartButton = false
  }

  setButtonStates(state: STATES, validGroupSelected) {
    if (validGroupSelected) {

      switch (state) {

        case STATES.finished: {
          this.disabledStartButton = false
          this.disabledPauseButton = true;
          this.disabledCancelButton = true;
          break
        }

        case STATES.running: {
          this.disabledStartButton = true;
          this.disabledPauseButton = false;
          this.disabledCancelButton = false;
          break
        }

        case STATES.paused: {
          this.disabledStartButton = false;
          this.disabledPauseButton = true;
          this.disabledCancelButton = false;
          break
        }
        case STATES.suspended: {
          this.disabledStartButton = false;
          this.disabledPauseButton = true;
          this.disabledCancelButton = true;
        }

      }

    }
    else {
      this.disabledStartButton = true;
      this.disabledPauseButton = true;
      this.disabledCancelButton = true;
    }
  }

  isValidGroupSelected() {
    if (this.finishedList.find(next => this.selectedGroup == next)) {
      return false
    }
    else {
      return true
    }
  }

}

export interface CurStateAndGroup {
  currentSate?: STATES
  currentGroup?

}
