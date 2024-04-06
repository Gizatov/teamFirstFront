import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MainService } from '../../../core/service/main.service';
import {Router} from "@angular/router";
import {DialogService} from "../../../core/service/dialog.service";
import {MatDialog} from "@angular/material/dialog";
import {AddUserComponent} from "../pages/authentication/add-user/classic/add-user.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  displayedColumns: string[] = [ 'id','name', 'lastName','studentId', 'email','faculty','role', 'actions'];
  dataSource: MatTableDataSource<any>;
  dataS
  loading: boolean = false;
  // dataSource: any[] = [];
  size = 5;
  page = 0;
  total: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private mainService: MainService ,private router: Router,private dialogService: DialogService,private _matDialog: MatDialog) { }

  ngOnInit(): void {
    this.loading = true;
    this.mainService.getAllMembers().subscribe((data: any[]) => {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    });
  }

  editUser(user: any): void {
    // Implement your logic for editing user here
  }

  deleteUser(user: any): void {
    // Implement your logic for deleting user here
  }

  editRecord(element: any): void {
    // Перенаправление на компонент редактирования с параметрами
    this.router.navigate(['/edit-user', element.id]);
  }
  openEditUserModal(userId: string): void {
    this.dialogService.openEditUserModal(userId);
  }
  openRegDialog() {
    this.dialogService.openAddUserModal();
  }
}
