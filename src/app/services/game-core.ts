import { computed, EventEmitter, Injectable, signal } from '@angular/core';
import _ from 'lodash';
import { IEvent, IPlayer, IPlayerWord, IWord, TGameView } from '../interface/game';


@Injectable({
  providedIn: 'root'
})
export class GameCore {
  public event: EventEmitter<IEvent> = new EventEmitter();

  public chatable = signal<boolean>(false);
  public chating = signal<boolean>(false);
  public finding = signal<boolean>(false);
  public players = signal<IPlayer[]>([]);
  public playersWords = signal<IPlayerWord[]>([]);
  public availablePlayer = signal<IPlayer | null>(null);
  public view = signal<TGameView>('unknown');
  public selectedWords = signal<IWord[]>([]);
  public availableWords = signal<IWord[]>([]);
  public jobWord = signal<IWord | null>(null);
  public timerCounter = signal<number>(-1);
  public timer = computed(() => {
    if (this.timerCounter() <= -1) return '';

    const min = Math.floor(this.timerCounter() / 60);
    const sec = Math.floor(this.timerCounter() % 60);

    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`
  });
  public message = signal('');
  public visableMessage = signal(false);
  public canRefuseDiscussingPlayerWord = signal<boolean>(false);
  public currentDiscussingPlayerWordIndex = signal<number | null>(null);
  public winnerPlayerWordIndex = signal<number>(0);

  private intervalTimer: any;
  private intervalView: any;
  private timeoutMessage: any;
  private discussingPlayerWordTimeout: any;

  public winnerPlayerCards = signal<IPlayerWord | null>(null);

  public load(): Boolean {
    try {
      const sessionString = window.localStorage.getItem('#shormorq/session');

      if (sessionString) {
        const session = JSON.parse(sessionString);

        this.players.set(session['players']);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  public async find() {
    const players = _.range(0, 8).map(() => {
      var id = _.random(1, 100);

      var player: IPlayer = {
        id: id.toString(),
        name: `بازیکن ${id}`,
        avatar: `https://avatar.iran.liara.run/public/${id}`
      };

      return player;
    });

    this.finding.set(true);
    this.players.set([
      players[0],
    ]);

    for (const item of players) {
      await new Promise((resolve) => setTimeout(resolve, _.random(1000, 3000)));

      this.players.set([
        ...new Set([
          ...this.players(),
          item,
        ]),
      ]);

    }

    await new Promise((resolve) => setTimeout(resolve, _.random(1000, 3000)));

    this.finding.set(false);

    window.localStorage.setItem('#shormorq/session', JSON.stringify({
      players: this.players(),
    }));

    this.event.emit({ event: 'players-found', data: this.players() });

    return true;
  }

  public startTimer(from: number = 60) {
    clearInterval(this.intervalTimer);
    this.timerCounter.set(from);
    this.intervalTimer = setInterval(() => {
      if (this.timerCounter() - 1 <= -1) {
        clearInterval(this.intervalTimer);
        this.timerCounter.set(-1);
        this.event.emit({ event: 'timer-finished', data: null });
      }

      this.timerCounter.set(this.timerCounter() - 1);
    }, 1000);
  }

  public changeJobWord() {
    this.availableWords.set([{
      type: 'job',
      text: 'قاتل'
    }]);

    this.jobWord.set(this.availableWords()[0]);

    this.event.emit({ event: 'job-word-changed', data: { currentWord: this.jobWord() } });
  }

  public continue() {
    this.timerCounter.set(0);
    this.event.emit({ event: 'continued', data: null });
  }

  public changeView(view: TGameView, timer: number = -1, message: boolean = true) {
    this.startTimer(timer);

    if (view == 'unknown') {
      this.view.set('unknown');
      this.selectedWords.set([]);
      this.availableWords.set([]);
      this.jobWord.set(null);
      this.chatable.set(false);
    }

    if (view == 'picking-job') {
      this.view.set('picking-job');
      this.selectedWords.set([]);
      this.availableWords.set([{
        type: 'job',
        text: 'فرش فروش'
      }]);
      this.jobWord.set(this.availableWords()[0]);
      this.chatable.set(false);
    }

    if (view == 'picking-word') {
      this.view.set('picking-word');
      this.selectedWords.set([]);
      this.availableWords.set([
        {
          type: 'word',
          text: 'خیار'
        },
        {
          type: 'word',
          text: 'دمپایی'
        },
        {
          type: 'word',
          text: 'پلاستیکی'
        },
        {
          type: 'word',
          text: 'کهنه'
        },
        {
          type: 'word',
          text: 'پاره'
        },
      ]);
      this.chatable.set(false);
    }

    if (view == 'discussing-word') {
      this.view.set('discussing-word');
      this.availableWords.set([]);
      this.chatable.set(true);
      this.changeDiscussingPlayerWord(0);
    }

    if (view == 'discussing-job') {
      this.view.set('discussing-job');
      this.availableWords.set([]);
      this.chatable.set(false);
    }

    if (view == 'waiting-word') {
      this.view.set('waiting-word');
      this.selectedWords.set([]);
      this.chatable.set(true);
    }

    if (view == 'waiting-job') {
      this.view.set('waiting-job');
      this.selectedWords.set([]);
      this.availableWords.set([]);
      this.chatable.set(false);
    }

    if (view == 'choosing-word') {
      this.view.set('choosing-word');
      this.selectedWords.set([]);
      this.availablePlayer.set(null);
      this.canRefuseDiscussingPlayerWord.set(false);
    }

    if (view == 'winner') {
      this.view.set('winner');
    }

    if (message) {
      this.showViewMessage();
    }

    this.event.emit({ event: 'view-changed', data: { view } });

    clearInterval(this.intervalView);

    if (timer == -1) return Promise.resolve();

    return new Promise<void>((resolve) => {
      this.intervalView = setInterval(() => {
        if (this.timerCounter() <= 0) {
          clearInterval(this.intervalView);
          resolve();
        }
      }, 1000);
    });
  }

  public async showMessage(message: string, timeout = 5000) {
    clearTimeout(this.timeoutMessage);

    if (this.message().length != 0) {
      await this.hideMessage();
    }

    this.message.set(message);

    setTimeout(() => {
      this.visableMessage.set(true);
    }, 10);

    this.timeoutMessage = setTimeout(() => {
      this.hideMessage();
    }, timeout);

  }

  public hideMessage() {
    return new Promise<void>((resolve) => {
      this.visableMessage.set(false);
      setTimeout(() => {
        this.message.set('');
        resolve();
      }, 1000);
    })
  }

  public showViewMessage() {
    const view = this.view();

    if (view == 'picking-job') {
      this.showMessage('شغلتون رو انتخاب کنید')
    }

    if (view == 'picking-word') {
      this.showMessage('کالا رو بسازید');
    }

    if (view == 'discussing-word') {
      this.showMessage('در مورد کالا ها بحث کنید');
    }

    if (view == 'discussing-job') {
      this.showMessage('در مورد کالا بحث کنید');
    }

    if (view == 'waiting-word') {
      this.showMessage('منتظر کالا ها باشید');
    }

    if (view == 'waiting-job') {
      this.showMessage('منتظر شاغل باشید');
    }

    if (view == 'choosing-word') {
      this.showMessage('کالای خود را انتخاب کنید');
    }
  }

  public changeDiscussingPlayerWord(index: number, timeout: number = 20) {
    clearTimeout(this.discussingPlayerWordTimeout);

    const playersWords = this.playersWords()[index];
    this.currentDiscussingPlayerWordIndex.set(index);
    this.selectedWords.set(playersWords.words);
    this.availablePlayer.set(playersWords.player);
    this.canRefuseDiscussingPlayerWord.set(false);

    this.event.emit({
      event: 'discussing-player-word-changed',
      data: {
        currentIndex: index,
        currentWord: this.selectedWords(),
        currentPlayer: this.availablePlayer()
      }
    });

    this.discussingPlayerWordTimeout = setTimeout(() => {
      this.nextDiscussingPlayerWord();
    }, timeout * 1000);

    /**
     * @TODO can refuse discussing player word after 5 seconds
     */
    setTimeout(() => {
      this.canRefuseDiscussingPlayerWord.set(true);
    }, 1000);
  }

  public refuseDiscussingPlayerWord() {
    if (!this.canRefuseDiscussingPlayerWord()) return;

    this.selectedWords.set([]);
    this.availablePlayer.set(null);
    this.canRefuseDiscussingPlayerWord.set(false);

    clearTimeout(this.discussingPlayerWordTimeout);

    this.event.emit({
      event: 'discussing-player-word-refused',
      data: {
        currentIndex: this.currentDiscussingPlayerWordIndex(),
        currentWord: this.selectedWords(),
        currentPlayer: this.availablePlayer()
      }
    });

    this.nextDiscussingPlayerWord();
  }

  public nextDiscussingPlayerWord() {
    const currentIndex = this.currentDiscussingPlayerWordIndex();
    if (currentIndex === null) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex < this.playersWords().length) {
      this.changeDiscussingPlayerWord(nextIndex);
    } else {
      // clear discussingPlayerWordTimeout and every things
      clearTimeout(this.discussingPlayerWordTimeout);
      this.selectedWords.set([]);
      this.availablePlayer.set(null);
      this.canRefuseDiscussingPlayerWord.set(false);

      this.event.emit({
        event: 'discussing-player-word-ended',
        data: null
      });
      /**
       * @TODO end discussing player word
       */
    }
  }

  public chooseWinnerPlayerWord() {
    const index = this.winnerPlayerWordIndex();
    if (index === -1) return;

    const playersWords = this.playersWords()[index];

    this.winnerPlayerCards.set(playersWords);

    this.event.emit({
      event: 'winner-player-word-chosen',
      data: {
        currentIndex: index,
        currentWord: this.selectedWords(),
        currentPlayer: this.availablePlayer()
      }
    });
  }
}