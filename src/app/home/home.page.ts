import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth'


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 
  toDoList = []
  today : any;
  uid : any;
  constructor(public router:Router,
              public afAuth : AngularFireAuth,
              public DB : AngularFireDatabase) {
    this.today = Date.now();
    this.afAuth.authState.subscribe(user => {
    this.uid = user.uid; // connected user ID
    //console.log (this.uid)
  })
  this.getListToDo();
  }
  addNewItem()
  {
    //add-new-task interface
    this.router.navigateByUrl('add-new-task');
  }

  //ending user session
  logout()
  {
     return this.afAuth.signOut().then(() => {
      this.uid = ''
      this.router.navigateByUrl('login');
    })
  }
  //Fetching Data from the DB.
  getListToDo()
  {//always detecting changes and reloading the data with child_added and child_removed.
    this.DB.list('Tasks/').snapshotChanges(['child_added', 'child_removed']).subscribe(actions => {
      this.toDoList = [];  
      actions.forEach(action => {
          if(action.payload.exportVal().user_id == this.uid){//==> filter on connected user id.
            this.toDoList.push({
              key: action.key,
              name: action.payload.exportVal().name,
              category: action.payload.exportVal().category,
              priority: action.payload.exportVal().priority,
              hour: action.payload.exportVal().date.substring(11, 16),
              checked: action.payload.exportVal().checked,
              uid: action.payload.exportVal().user_id
            });
          }
      });
    });
  }
  //from to do to done status.
  changeCheck(task: any) {
  this.DB.object('Tasks/' + task.key + '/checked/').set(task.checked);
}
}
