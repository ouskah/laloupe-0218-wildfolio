import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CityService } from '../services/city.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { City } from '../shared/models/city.model';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css'],
})
export class CitiesComponent implements OnInit {

  city = new City();
  cities: City[] = [];
  isLoading = true;
  isEditing = false;

  addCityForm: FormGroup;
  name = new FormControl('', Validators.required);
  link = new FormControl('', Validators.required);

  constructor(private cityService: CityService, private formBuilder: FormBuilder, public toast: ToastComponent) { }

  ngOnInit() {
    this.getCity();
    this.addCityForm = this.formBuilder.group({
      name: this.name,
      link: this.link,
    });
  }

  getCity() {
    this.cityService.getCities().subscribe(
      (data) => {
        this.cities = data;
      },
      error => console.log(error),
      () => this.isLoading = false,
    );
  }

  addCity() {
    if (this.canAddCity()) {
      this.cityService.addCity(this.addCityForm.value).subscribe(
        (res) => {
          this.cities.push(res);
          this.addCityForm.reset();
          this.toast.setMessage('item added successfully.', 'success');
        },
        error => console.log(error),
      );
    } else {
      this.addCityForm.reset();
      this.toast.setMessage('campus already exist.', 'warning');
    }
  }

  enableEditing(city: City) {
    this.isEditing = true;
    this.city = city;
  }

  cancelEditing() {
    this.isEditing = false;
    this.city = new City();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the cats to reset the editing
    this.getCity();
  }

  editCity(city: City) {
    this.cityService.editCity(city).subscribe(
      () => {
        this.isEditing = false;
        this.city = city;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error),
    );
  }

  deleteCity(city: City) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.cityService.deleteCity(city).subscribe(
        () => {
          const pos = this.cities.map(elem => elem._id).indexOf(city._id);
          this.cities.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error),
      );
    }
  }

  canAddCity() {
    for (let i = 0; i < this.cities.length; i += 1) {
      if (this.cities[i].name === this.addCityForm.value.name) {
        return false;
      }
    }
    return true;
  }
}
