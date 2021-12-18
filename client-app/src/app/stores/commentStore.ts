import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/comment";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor(){
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if(store.activityStore.selectedActivity){
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(`http://localhost:5000/chat?activityId=${activityId}`, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();
            
            this.hubConnection.start().catch(e => console.log("Error establishing the connection: ", e));
            this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
                runInAction(() => {
                    comments.forEach(
                        comment => comment.createdAt = new Date(comment.createdAt + 'Z') // handle UTC time issue on the initial load from server
                    );
                    this.comments = comments;
                });
            });

            this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt)
                    this.comments.unshift(comment)
                });
            });
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(e => console.log("Error stopping connection: ", e));
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id;

        try {
            this.hubConnection?.invoke("SendComment", values);
        } catch(e){
            console.log(e);
        }

    }
 }