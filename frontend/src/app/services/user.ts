import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz que define la estructura de un usuario
export interface User {
  _id?: string;
  userId: string;
  name: string;
  createDate: number;
  updateDate: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // URL base de la API
  private apiUrl = '/api/user';

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Crear un nuevo usuario
  createUser(user: { userId: string; name: string }): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Actualizar un usuario existente
  updateUser(userId: string, user: { name: string }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, user);
  }

  // Eliminar un usuario
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
}
