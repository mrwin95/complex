import {Component} from '@angular/core';
import { FibService } from './other.service';

@Component({
  selector: 'app-other-component',
  templateUrl: './other.component.html'
})
export class OtherComponent {

  title: string;

  constructor(private fibService: FibService){
    this.title = "Welcome"
  }


}
