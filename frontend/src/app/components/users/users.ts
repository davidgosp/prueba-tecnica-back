import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService, User } from '../../services/user';
import { UserDialogComponent } from '../user-dialog/user-dialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class UsersComponent implements OnInit {
  // Columnas a mostrar en la tabla
  displayedColumns: string[] = ['userId', 'name', 'createDate', 'updateDate', 'actions'];

  // Array de usuarios
  users: User[] = [];

  // Estado de carga
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Cargar usuarios al iniciar el componente
    this.loadUsers();
  }

  // Método para cargar todos los usuarios
  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
        console.log('Usuarios cargados:', users);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.isLoading = false;
      }
    });
  }

  // Método para abrir el diálogo de crear usuario
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: {}
    });

    // Cuando se cierra el diálogo, si hay datos, crear el usuario
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createUser(result);
      }
    });
  }

  // Método para abrir el diálogo de editar usuario
  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user }
    });

    // Cuando se cierra el diálogo, si hay datos, actualizar el usuario
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUser(user.userId, result);
      }
    });
  }

  // Método para crear un usuario
  createUser(userData: { userId: string; name: string }): void {
    this.userService.createUser(userData).subscribe({
      next: (newUser) => {
        console.log('Usuario creado:', newUser);
        this.loadUsers(); // Recargar la tabla
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        alert('Error al crear usuario: ' + (error.error?.error || 'Error desconocido'));
      }
    });
  }

  // Método para actualizar un usuario
  updateUser(userId: string, userData: { name: string }): void {
    this.userService.updateUser(userId, userData).subscribe({
      next: (updatedUser) => {
        console.log('Usuario actualizado:', updatedUser);
        this.loadUsers(); // Recargar la tabla
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        alert('Error al actualizar usuario: ' + (error.error?.error || 'Error desconocido'));
      }
    });
  }

  // Método para eliminar un usuario
  deleteUser(user: User): void {
    if (confirm(`¿Estás seguro de eliminar al usuario ${user.name}?`)) {
      this.userService.deleteUser(user.userId).subscribe({
        next: () => {
          console.log('Usuario eliminado');
          this.loadUsers(); // Recargar la tabla
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar usuario: ' + (error.error?.error || 'Error desconocido'));
        }
      });
    }
  }

  // Método para formatear fechas
  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString('es-ES');
  }
}
