import Phaser from 'phaser';

const GAME_WIDTH = 480;
const GAME_HEIGHT = 280;
const GROUND_Y = GAME_HEIGHT - 40;
const PLAYER_X = 80;
const PLAYER_SIZE = 24;
const GRAVITY = 1200;
const JUMP_VELOCITY = -520;
const INITIAL_SPEED = 220;
const SPEED_INCREMENT = 20;
const OBSTACLE_MIN_INTERVAL = 900;

export class JumpRunnerScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private ground!: Phaser.GameObjects.Rectangle;
  private obstacles!: Phaser.GameObjects.Group;
  private scoreText!: Phaser.GameObjects.Text;
  private score = 0;
  private gameOver = false;
  private playerVY = 0;
  private onGround = false;
  private scrollSpeed = INITIAL_SPEED;
  private obstacleTimer = 0;
  private nextObstacleTime = 1500;
  private bgTiles: Phaser.GameObjects.Rectangle[] = [];
  private onGameEnd: (score: number) => void;
  private scoreTimer = 0;

  constructor(onGameEnd: (score: number) => void) {
    super({ key: 'JumpRunnerScene' });
    this.onGameEnd = onGameEnd;
  }

  preload() {}

  create() {
    this.score = 0;
    this.gameOver = false;
    this.playerVY = 0;
    this.onGround = true;
    this.scrollSpeed = INITIAL_SPEED;
    this.obstacleTimer = 0;
    this.nextObstacleTime = 1500;
    this.scoreTimer = 0;

    // Sky background
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x87ceeb);

    // Moving background clouds (rectangles)
    this.bgTiles = [];
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.rectangle(
        i * 110,
        Phaser.Math.Between(30, 100),
        Phaser.Math.Between(60, 100),
        20,
        0xffffff,
        0.7
      );
      this.bgTiles.push(cloud);
    }

    // Ground
    this.ground = this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + 20, GAME_WIDTH, 40, 0x4caf50);

    // Player
    this.player = this.add.rectangle(PLAYER_X, GROUND_Y - PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE, 0xff6b35);
    this.player.setDepth(2);

    // Eye
    this.add.circle(PLAYER_X + 6, GROUND_Y - PLAYER_SIZE / 2 - 4, 3, 0x000000).setDepth(3);

    // Obstacles group
    this.obstacles = this.add.group();

    // Score
    this.scoreText = this.add.text(8, 8, '🏃 0', {
      fontSize: '18px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setDepth(10);

    // Jump input
    this.input.keyboard!.on('keydown-SPACE', this.jump, this);
    this.input.keyboard!.on('keydown-UP', this.jump, this);
    this.input.on('pointerdown', this.jump, this);
  }

  private jump() {
    if (this.gameOver) return;
    if (this.onGround) {
      this.playerVY = JUMP_VELOCITY;
      this.onGround = false;
    }
  }

  update(_time: number, delta: number) {
    if (this.gameOver) return;
    const dt = delta / 1000;

    // Score accumulation
    this.scoreTimer += delta;
    if (this.scoreTimer >= 100) {
      this.score++;
      this.scoreTimer = 0;
      this.scrollSpeed = INITIAL_SPEED + Math.floor(this.score / 10) * SPEED_INCREMENT;
      this.scoreText.setText(`🏃 ${this.score}`);
    }

    // Physics
    if (!this.onGround) {
      this.playerVY += GRAVITY * dt;
    }
    this.player.y += this.playerVY * dt;

    // Landing
    const groundTop = GROUND_Y - PLAYER_SIZE / 2;
    if (this.player.y >= groundTop) {
      this.player.y = groundTop;
      this.playerVY = 0;
      this.onGround = true;
    }

    // Move clouds
    this.bgTiles.forEach((cloud) => {
      cloud.x -= this.scrollSpeed * 0.2 * dt;
      if (cloud.x < -60) {
        cloud.x = GAME_WIDTH + 60;
        cloud.y = Phaser.Math.Between(30, 100);
      }
    });

    // Spawn obstacles
    this.obstacleTimer += delta;
    if (this.obstacleTimer >= this.nextObstacleTime) {
      this.obstacleTimer = 0;
      this.nextObstacleTime = Math.max(
        OBSTACLE_MIN_INTERVAL,
        Phaser.Math.Between(1000, 2200) - this.score * 3
      );
      this.spawnObstacle();
    }

    // Move obstacles
    this.obstacles.getChildren().forEach((obj) => {
      const obs = obj as Phaser.GameObjects.Rectangle;
      obs.x -= this.scrollSpeed * dt;

      if (obs.x < -40) {
        obs.destroy();
        return;
      }

      // Collision
      const px = this.player.x;
      const py = this.player.y;
      const pw = PLAYER_SIZE / 2 - 3;
      const ph = PLAYER_SIZE / 2 - 3;
      const ow = (obs.width as number) / 2 - 3;
      const oh = (obs.height as number) / 2 - 3;

      if (
        Math.abs(px - obs.x) < pw + ow &&
        Math.abs(py - obs.y) < ph + oh
      ) {
        this.endGame();
      }
    });
  }

  private spawnObstacle() {
    const height = Phaser.Math.Between(24, 48);
    const obs = this.add.rectangle(
      GAME_WIDTH + 20,
      GROUND_Y - height / 2,
      20,
      height,
      0x8b4513
    );
    obs.setDepth(1);
    this.obstacles.add(obs);
  }

  private endGame() {
    if (this.gameOver) return;
    this.gameOver = true;

    this.input.keyboard!.off('keydown-SPACE', this.jump, this);
    this.input.keyboard!.off('keydown-UP', this.jump, this);
    this.input.off('pointerdown', this.jump, this);

    // Flash red
    this.player.setFillStyle(0xff0000);

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6)
      .setDepth(20);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, '게임 종료!', {
      fontSize: '26px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(21);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, `점수: ${this.score}`, {
      fontSize: '20px',
      color: '#ffff00',
      fontFamily: 'Arial',
    }).setOrigin(0.5).setDepth(21);

    this.time.delayedCall(1200, () => {
      this.onGameEnd(this.score);
    });
  }
}
