import Phaser from 'phaser';

const GAME_WIDTH = 480;
const GAME_HEIGHT = 360;
const PLAYER_SPEED = 180;
const STAR_COUNT = 12;
const OBSTACLE_INTERVAL = 2000;
const GAME_DURATION = 30;

export class StarCollectorScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Arc;
  private stars!: Phaser.GameObjects.Group;
  private obstacles!: Phaser.GameObjects.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private score = 0;
  private timeLeft = GAME_DURATION;
  private gameOver = false;
  private obstacleTimer!: Phaser.Time.TimerEvent;
  private countdownTimer!: Phaser.Time.TimerEvent;
  private onGameEnd: (score: number) => void;

  // Touch drag support
  private dragStart: { x: number; y: number } | null = null;
  private touchVelocity = { x: 0, y: 0 };

  constructor(onGameEnd: (score: number) => void) {
    super({ key: 'StarCollectorScene' });
    this.onGameEnd = onGameEnd;
  }

  preload() {}

  create() {
    this.score = 0;
    this.timeLeft = GAME_DURATION;
    this.gameOver = false;

    // Background
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0a0a2a);

    // Grid lines for style
    for (let i = 0; i < GAME_WIDTH; i += 60) {
      this.add.line(0, 0, i, 0, i, GAME_HEIGHT, 0x1a1a4a, 0.3).setOrigin(0);
    }
    for (let j = 0; j < GAME_HEIGHT; j += 60) {
      this.add.line(0, 0, 0, j, GAME_WIDTH, j, 0x1a1a4a, 0.3).setOrigin(0);
    }

    // Player (circle)
    this.player = this.add.circle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 14, 0x00aaff);
    this.player.setDepth(2);

    // Stars group
    this.stars = this.add.group();
    this.spawnStars();

    // Obstacles group
    this.obstacles = this.add.group();

    // Keyboard
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Touch drag
    this.input.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      this.dragStart = { x: ptr.x, y: ptr.y };
    });
    this.input.on('pointermove', (ptr: Phaser.Input.Pointer) => {
      if (this.dragStart) {
        this.touchVelocity = {
          x: (ptr.x - this.dragStart.x) * 3,
          y: (ptr.y - this.dragStart.y) * 3,
        };
        this.dragStart = { x: ptr.x, y: ptr.y };
      }
    });
    this.input.on('pointerup', () => {
      this.dragStart = null;
      this.touchVelocity = { x: 0, y: 0 };
    });

    // HUD
    this.scoreText = this.add.text(8, 8, '⭐ 0', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setDepth(10);

    this.timerText = this.add.text(GAME_WIDTH - 8, 8, `⏱ ${this.timeLeft}`, {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(1, 0).setDepth(10);

    // Obstacle spawn timer
    this.obstacleTimer = this.time.addEvent({
      delay: OBSTACLE_INTERVAL,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    });

    // Countdown timer
    this.countdownTimer = this.time.addEvent({
      delay: 1000,
      callback: this.tick,
      callbackScope: this,
      loop: true,
    });
  }

  private spawnStars() {
    for (let i = 0; i < STAR_COUNT; i++) {
      const x = Phaser.Math.Between(20, GAME_WIDTH - 20);
      const y = Phaser.Math.Between(20, GAME_HEIGHT - 20);
      const star = this.add.star(x, y, 5, 4, 10, 0xffd700);
      star.setDepth(1);
      this.stars.add(star);
    }
  }

  private spawnObstacle() {
    if (this.gameOver) return;
    const side = Phaser.Math.Between(0, 3);
    let x = 0, y = 0, vx = 0, vy = 0;
    const speed = Phaser.Math.Between(60, 120);

    switch (side) {
      case 0: x = Phaser.Math.Between(0, GAME_WIDTH); y = -15; vx = 0; vy = speed; break;
      case 1: x = GAME_WIDTH + 15; y = Phaser.Math.Between(0, GAME_HEIGHT); vx = -speed; vy = 0; break;
      case 2: x = Phaser.Math.Between(0, GAME_WIDTH); y = GAME_HEIGHT + 15; vx = 0; vy = -speed; break;
      case 3: x = -15; y = Phaser.Math.Between(0, GAME_HEIGHT); vx = speed; vy = 0; break;
    }

    const obstacle = this.add.rectangle(x, y, 28, 28, 0xff4444) as unknown as Phaser.GameObjects.Rectangle & {
      vx: number;
      vy: number;
    };
    (obstacle as unknown as { vx: number; vy: number }).vx = vx;
    (obstacle as unknown as { vx: number; vy: number }).vy = vy;
    obstacle.setDepth(1);
    this.obstacles.add(obstacle);
  }

  private tick() {
    if (this.gameOver) return;
    this.timeLeft--;
    this.timerText.setText(`⏱ ${this.timeLeft}`);
    if (this.timeLeft <= 10) {
      this.timerText.setColor('#ff4444');
    }
    if (this.timeLeft <= 0) {
      this.endGame();
    }
  }

  update(time: number, delta: number) {
    if (this.gameOver) return;

    const dt = delta / 1000;
    let vx = 0;
    let vy = 0;

    // Keyboard
    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -PLAYER_SPEED;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = PLAYER_SPEED;
    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -PLAYER_SPEED;
    else if (this.cursors.down.isDown || this.wasd.down.isDown) vy = PLAYER_SPEED;

    // Touch
    if (this.touchVelocity.x !== 0 || this.touchVelocity.y !== 0) {
      vx = Phaser.Math.Clamp(this.touchVelocity.x * PLAYER_SPEED, -PLAYER_SPEED, PLAYER_SPEED);
      vy = Phaser.Math.Clamp(this.touchVelocity.y * PLAYER_SPEED, -PLAYER_SPEED, PLAYER_SPEED);
    }

    // Move player
    this.player.x = Phaser.Math.Clamp(this.player.x + vx * dt, 14, GAME_WIDTH - 14);
    this.player.y = Phaser.Math.Clamp(this.player.y + vy * dt, 14, GAME_HEIGHT - 14);

    // Collect stars
    this.stars.getChildren().forEach((obj) => {
      const star = obj as Phaser.GameObjects.Star;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, star.x, star.y);
      if (dist < 20) {
        star.destroy();
        this.score += 10;
        this.scoreText.setText(`⭐ ${this.score}`);

        if (this.stars.getLength() === 0) {
          this.spawnStars();
        }
      }
    });

    // Move & check obstacles
    this.obstacles.getChildren().forEach((obj) => {
      const obs = obj as Phaser.GameObjects.Rectangle & { vx: number; vy: number };
      obs.x += obs.vx * dt;
      obs.y += obs.vy * dt;

      // Remove if off screen
      if (obs.x < -40 || obs.x > GAME_WIDTH + 40 || obs.y < -40 || obs.y > GAME_HEIGHT + 40) {
        obs.destroy();
        return;
      }

      // Collision with player
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, obs.x, obs.y);
      if (dist < 20) {
        this.endGame();
      }
    });
  }

  private endGame() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.obstacleTimer.remove();
    this.countdownTimer.remove();

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6)
      .setDepth(20);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, '게임 종료!', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(21);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, `점수: ${this.score}`, {
      fontSize: '22px',
      color: '#ffd700',
      fontFamily: 'Arial',
    }).setOrigin(0.5).setDepth(21);

    this.time.delayedCall(1200, () => {
      this.onGameEnd(this.score);
    });
  }
}
