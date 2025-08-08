// src/signalr.ts
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5146/notifications")
  .withAutomaticReconnect()
  .build();

export default connection;

