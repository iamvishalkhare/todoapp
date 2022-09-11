import {Component} from '@angular/core';
import {TodoDataService} from './todo-data.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TodoDataService]
})
export class AppComponent {

  todoItems: Array<any> = []
  textInput: string = ''
  isAllDisabled: boolean = true
  isActiveDisabled: boolean = false
  isCompletedDisabled: boolean = false


  constructor(private todoDataService: TodoDataService,
              private _snackBar: MatSnackBar) {
    this.getTodos('all');
  }

  addNewItem(item: string) {
    if (item.length == 0) {
      return
    }
    this.todoDataService.addNewTodo(item).subscribe(
      (data: any) => {
        if (data.status) {
          this.todoItems.unshift(data.data)
          this.textInput = ''
          this.openSnackBar(data.message, 'OK')
        }
        else {
          this.openSnackBar(data.message, 'OK')
        }
      }
    )
  }
  onCheckChange(item: any){
    item.status = item.status === 'active' ? 'completed' : 'active'
    this.todoDataService.updateItem(item).subscribe(
      (data: any) => {
        if (!data.status) {
          item.status = item.status === 'active' ? 'completed' : 'active'
          this.openSnackBar(data.message, 'OK');
        }
      }
    )
  }

  getTodos(filter_value: string) {
    this.detectBtnDisable(filter_value);
    this.todoDataService.getTodos(filter_value).subscribe(
      (data: any) => {
        if (data.status && Object.keys(data.data).length) {
          this.todoItems = data.data
        } else {
          this.todoItems = []
        }
      }
    );
  }

  detectBtnDisable(filter_value: string) {
    if (filter_value == 'all') {
      this.isAllDisabled = true;
      this.isActiveDisabled = false;
      this.isCompletedDisabled = false;
    }
    if (filter_value == 'active') {
      this.isAllDisabled = false;
      this.isActiveDisabled = true;
      this.isCompletedDisabled = false;
    }
    if (filter_value == 'completed') {
      this.isAllDisabled = false;
      this.isActiveDisabled = false;
      this.isCompletedDisabled = true;
    }
  }

  deleteTodos() {
    this.todoDataService.deleteItems().subscribe(
      (data: any) => {
        if (data.status) {
          this.getTodos('all')
        }
      }
    )

  }

  completedTasksCount(){
    return this.todoItems.filter(x => x.status == 'completed').length
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      duration: 3000
    });
  }

}
