import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'

import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string  = ""
  password: string = ""

  constructor( 
    public router:Router,
    public afAuth : AngularFireAuth,
    public alert : AlertController
    ) { }

  ngOnInit() {
  }

 async login()
  {
    const { email, password } = this
    try{
      //Handeling succesfull login.
      const res = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log(res)
      this.email = "";
      this.password = "";
      this.showAlert("Login", "Welcome ^^ ")
      this.router.navigateByUrl('home');
    }
    catch(err)
    {
      console.dir(err)

      //Handeling inexistent user account in the db error.
      if (err.code === "auth/user-not-found")
      {
        this.showAlert("Inexistent user", "user not found.")
        console.log("user not found")
      }

      //Handeling wrong password error.
      if (err.code === "auth/wrong-password")
      {
        this.showAlert("Password error", "you entered a wrong password !")
        console.log("wrong password")
      }

      //Handeling invalid email format.
      if (err.code === "auth/invalid-email")
      {
        this.showAlert("Wrong email format", "Please check your email format.")
        console.log ("Wrong email format")
      }
    }
  }

  //if you don't have an account already the signup link
  //will take you to the registration form where you can create your account.
   signup(){
    this.router.navigateByUrl('signup');
  }

  //Show alert is responsible for displaying the ionic alert dialog box.
  async showAlert(header: string, message: string)
  {
    const alert = this.alert.create({
      header : header,
      message : message,
      buttons : ["Ok"]
    });
    (await alert).present()
  }
}
