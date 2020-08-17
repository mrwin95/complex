import axios from 'axios';
import { async } from '@angular/core/testing';

export class FibService {
  state = {
    seenIndexes: [],
    values: [],
    index: ''
  };

  async fetchValues() {
    const values = await axios.get('/api/values/current');
    this.state.values = values.data;
  }

  async fetchIndexes(){
    const seenIndexes = await axios.get('/api/values/all');
    this.state.seenIndexes = seenIndexes.data;
  }
}
