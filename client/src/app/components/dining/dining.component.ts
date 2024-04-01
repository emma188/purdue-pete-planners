import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-dining',
  templateUrl: './dining.component.html',
  styleUrls: ['./dining.component.css']
})
export class DiningComponent implements OnInit {

  constructor() { }

  tableargs1 = {data: [], type: 'meal'};
  tableargs2 = {data: [], type: 'meal'};
  tableargs3 = {data: [], type: 'meal'};
  diningData = {};

  ngOnInit(): void {
    axios.get(`/api/dining/locations`, { params: { location: 'Hillenbrand' } })
    .then((res) => {
      console.log(res.data);
      this.diningData = res.data.Meals;
      this.tableargs1 = {data: res.data.Meals[0].Stations[0].Items, type: 'Breakfast'};
      this.tableargs2 = {data: res.data.Meals[1].Stations[0].Items, type: 'Lunch'};
      this.tableargs3 = {data: res.data.Meals[2].Stations[0].Items, type: 'Dinner'};
    });
  }

  onTabClick(event: any) {
    console.log(event.tab.textLabel);
    axios.get(`/api/dining/locations`, { params: { location: event.tab.textLabel } })
    .then((res) => {
      console.log(res.data);
      this.diningData = res.data.Meals;
      this.tableargs1 = {data: res.data.Meals[0].Stations[0].Items, type: 'Breakfast'};
      this.tableargs2 = {data: res.data.Meals[1].Stations[0].Items, type: 'Lunch'};
      this.tableargs3 = {data: res.data.Meals[2].Stations[0].Items, type: 'Dinner'};
      console.log(this.tableargs1);
    });
  }

}
