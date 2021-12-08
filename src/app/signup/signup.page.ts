import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  email: string = ""
  password: string = ""
  cpassword: string = ""
  constructor( 
    public router:Router,
    public afAuth : AngularFireAuth,
    public alert : AlertController
    ) { }

  ngOnInit() {
  }

  async signup() {
    const { email, password, cpassword} = this
    //Handeling password confirmation error.
    if (password !== cpassword)
    {
      this.showAlert("Password Error !", "Passwords don't match ! ")
      return console.error("passwords don't match")
    }
    try{
      //Handeling succesfull registration.
      const res = await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log(res);
      this.email = "";
      this.password = "";
      this.cpassword = "";
      this.showAlert("User created", " Welcome ! ")
      this.router.navigateByUrl('login');
    }
    catch(err){
      console.dir(err)
      //Handeling already registered users error.
      if (err.code === "auth/email-already-in-use")
      {
        this.showAlert("User registered", "User already have an account.")
        console.log ("user already registered ")
      }
      //Handeling weak password error.
      if (err.code === "auth/weak-password")
      {
        this.showAlert("Weak Password", "Password should be at least 6 characters.") // firebase minimuim length for a password is 6 characters.
        console.log ("Weak Password")
      }

      //Handeling invalid email format.
      if (err.code === "auth/invalid-email")
      {
        this.showAlert("Wrong email format", "Please check your email format.")
        console.log ("Wrong email format")
      }
    }
  }

  //if you an account already the click here link
  //will take you to the login interface.
   login(){
    this.router.navigateByUrl('login');
  }

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
