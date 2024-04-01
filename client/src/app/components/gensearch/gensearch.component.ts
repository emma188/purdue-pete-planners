import { Component, OnInit } from '@angular/core';
import axios from 'axios'

@Component({
  selector: 'app-gensearch',
  templateUrl: './gensearch.component.html',
  styleUrls: ['./gensearch.component.css']
})
export class GensearchComponent implements OnInit {

  buildings = []
  curUser = JSON.parse(sessionStorage.curUser || '{}');
  building = {name: "No result", location: "None", bussiness_hour:"None", refimg:"https://www.cla.purdue.edu/resources/buildings/images/brng.jpg"}
  showBuild = false
  isAdmin = false

  constructor() {
    if (this.curUser.account_type == 'admin') {
     this.isAdmin = true
    }
  }

  ngOnInit(): void {
    axios.get(`/api/account/getBuildings`)
    .then((res) => {
      this.buildings = res.data
    });
    console.log(this.curUser)
    console.log(this.isAdmin)
  }

  filter = '1';
  searchResponse : string[] = [];
  type = 'none'
  tableargs = {data: [], type: this.type}
  displaySearchResult = false

  getSearchValue(val: string) {
    console.log(val)
    if (this.filter == '1') {
      // Buildings
      // for (var i; i < this.buildings.length; i++) {
      //   if (this.buildings[i].name == val) {

      //   }
      // }

      //Purdue University Beering Hall
      this.buildings.forEach((b:any) => {
        console.log(b.name)
        if (b.name == val) {
          this.building = b
        }
      });
      this.showBuild = true
    } else if (this.filter == '2') {
      this.showBuild = false
    } else if (this.filter == '3') {
      console.log("Searching for users with class tag")
      axios.get(`/api/account/searchUsersCT`, { params: { classtag: val } })
      .then((res) => {
        console.log(res.data[0])
        if (typeof res.data[0] === 'undefined'){
          this.searchResponse = ["No matching user"]
        } else {
          // for (d in res.data[0]) {
          //   this.searchResponse.push(d.user_name)
          // }
  
          this.searchResponse = ['tom', 'bob', 'timmy']
          this.searchResponse = res.data[0].students;
        }
        this.type = 'search'
        this.displaySearchResult = true
        console.log(this.searchResponse)
        this.tableargs = {data: res.data[0].students, type: this.type}
        this.showBuild = false
      });
    } else if (this.filter == '4') { 
      console.log("Searching for users to ban")
      axios.get(`/api/account/searchUsers`, { params: { prefix: val } })
      .then((res) => {
        console.log(res.data[0])
        if (typeof res.data[0] === 'undefined'){
          this.searchResponse = ["No matching user"]
        } else {

          if (res.data[0].banned == 'true') {
            this.searchResponse = [res.data[0].user_name + ' (BANNED)']
          } else {
            this.searchResponse = [res.data[0].user_name]
          }
        }
        this.type = 'ban'
        this.displaySearchResult = true
        this.tableargs = {data: res.data, type: this.type}
      });
    } else if (this.filter == '5') {
      axios.get(`/api/account/deleteStudyGroup`, { params: { prefix: val } })
      .then((res) => {
        console.log(res.data)
        if (res.data === 0){
          alert("Chatroom could not be found")
        } else {
          alert("One ChatRoom was deleted")
        }
      });
    }
  }
}
