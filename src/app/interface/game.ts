export interface IWord {
    type: 'job' | 'word';
    image?: string;
    text: string;
}

export interface IPlayer {
    id: string
    name: string
    avatar: string
}

export interface IPlayerWord {
    words: IWord[];
    player: IPlayer;
}

export interface IEvent {
    event: TGameEvent
    data: any
}

export type TGameEvent = 'players-found' | 'timer-finished' | 'job-word-changed' | 'view-changed' | 'continued' | 'discussing-player-word-changed' | 'discussing-player-word-refused' | 'discussing-player-word-ended' | 'winner-player-word-chosen';

export type TGameView = 'unknown' | 'picking-word' | 'picking-job' | 'discussing-word' | 'discussing-job' | 'waiting-job' | 'waiting-word' | 'choosing-word' | 'winner';

// picking-word: در حال انتخاب کلمه و تولید کالا
// picking-job: در حال انتخاب شغل
// discussing-word: صحبت کردن درباره کالا - مخصوص کسی که الان شغل داره
// discussing-job: صحبت کردن در مورد کالا برای شاغل - مخصوص کسی که الان کالا ساخته
// waiting-job: در انتظار انتخاب شغل
// waiting-word: در انتظار انتخاب کلمات و ساخت کالا
// choosing-word: در حال انتخاب کالا توسط شاغل
// winner: نمایش برنده دور