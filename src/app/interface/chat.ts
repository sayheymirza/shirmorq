import { IPlayer } from "./game"

export interface IMessage {
    player: IPlayer
    text: string
}