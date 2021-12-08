import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth'


@Component({
  selector: 'app-add-new-task',
  templateUrl: './add-new-task.page.html',
  styleUrls: ['./add-new-task.page.scss'],
})
export class AddNewTaskPage implements OnInit {
  task : string;
  category : string;
  priority : string;
  uid : string;
  constructor(public router:Router,
              public afAuth : AngularFireAuth,
              public DB : AngularFireDatabase) { }

  ngOnInit() {
  }
  Cancel(){
    this.router.navigateByUrl('home');
  }
  
  //adding a new task
  add()
  {
  this.afAuth.authState.subscribe(user => {
    this.uid = user.uid; // getting the current user id.
    //console.log('user : '+ this.uid + ' task : ' + this.task + " category : " + this.category + " priority : " + this.priority);
    this.DB.list('Tasks/').push({
      user_id : this.uid,
      name : this.task,
      category : this.category,
      priority : this.priority,
      date : new Date().toISOString(),
      checked: false
  });})
    this.router.navigateByUrl('home');
  }
}
