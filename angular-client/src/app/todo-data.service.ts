import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class TodoDataService {

  baseUrl = '13.235.106.236'

  constructor(private http: HttpClient) {
  }
  getTodos(filter_value: string) {
    return this.http.get('http://'+this.baseUrl+'/todos?filter='+filter_value)
  }

  addNewTodo(item: string) {
    return this.http.post('http://'+this.baseUrl+'/todo', {'item': item})
  }

  updateItem(item: any) {
    return this.http.put('http://'+this.baseUrl+'/todo', item)
  }

  deleteItems() {
    return this.http.delete('http://'+this.baseUrl+'/todos')
  }
}
