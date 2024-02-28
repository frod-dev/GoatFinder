import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, addDoc, collection, collectionData, query } from '@angular/fire/firestore';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsService = inject(UtilsService);

  // AUTH
  getAuth(){
    return getAuth();
  }

  // Iniciar sesión
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Registrar user
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Actualizar user
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, {displayName});
  }

  //Reset password
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // Cerrar sesión
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsService.routerLink('/auth');
  }


  // BDD.
  // Collection Get
  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), {idField: 'id'});
  }

  // Set
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // Update
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  // Delete
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  // Get
  async getDocument(path:string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // Post
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }


  // STORAGE.
  // Subir foto
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    });
  }

  //Ruta foto
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  // Eliminar archivo
  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }


}
