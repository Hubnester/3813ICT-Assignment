import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any = [];
  isGroupAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  currentUser: string | null = null;
  newUserRole: string = "none";

  constructor(private dataService: DataService) { }

  async ngOnInit(): Promise<void> {
    this.currentUser = localStorage.getItem("currentUser");
    this.isGroupAdmin = (await this.dataService.checkUserAuthorised("groupAdmin")).authorised;
    this.isSuperAdmin = (await this.dataService.checkUserAuthorised("superAdmin")).authorised;
    this.refeshData();
  }

  async refeshData(){
    this.users = await this.dataService.getUsers();
  }

  // Display the drop down menu of the button when clicked
  toggleDropdown(user: any | null = null){
    // Show the clicked on dropdown menu
    let element: any = undefined;
    if (user){
      let roles = ["superAdmin", "groupAdmin", "none"];
      for (let role of roles){
        element = document.getElementById("Select"+role+user.name);
        element.disabled = role == user.role;
      }
      element = document.getElementById("roleDropdown"+user.name);
    } else{
      let roles = ["groupAdmin", "none"];
      for (let role of roles){
        element = document.getElementById("newUserSelect"+role);
        element.disabled = role == this.newUserRole;
      }
      element = document.getElementById("newUserRoleDropdown");
      // To fix errors later
      user = {};
    }
    element.classList.toggle("show");

    // Loop through the users and disable the other users dropdowns of the same type (if open)
    for (let otherUser of this.users){
      if (otherUser.name != user.name){
        element = document.getElementById("roleDropdown"+otherUser.name);
        if (element.classList.contains("show")){
          element.classList.remove("show");
        }
      }
    }
    // Hide the new user role dropdown if a user one was just opened
    if (user.name){
      element = document.getElementById("newUserRoleDropdown");
      if (element.classList.contains("show")){
        element.classList.remove("show");
      }
    }
  }

  // Update the users role
  async updateRole(role: string, user: string | null = null){
    // Handle the new users role being changed
    if (!user){
      this.newUserRole = role;
      let roles = ["groupAdmin", "none"];
      for (let role of roles){
        let element: any = document.getElementById("newUserSelect"+role);
        element.disabled = role == this.newUserRole;
      }
    } else {

      this.refeshData();
    }
  }

  // Check for mouse clicks
  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    let target: any = event.target;
    if (!target.matches("input")){
      // Loop through the users and disable the dropdowns for them if the mouse is not clicked on a button
      for (let user of this.users){
        let element: any = document.getElementById("roleDropdown"+user.name);
        if (element.classList.contains("show")){
          element.classList.remove("show");
        }
      }
      let element: any = document.getElementById("newUserRoleDropdown");
      if (element.classList.contains("show")){
        element.classList.remove("show");
      }
    }
  }
}
