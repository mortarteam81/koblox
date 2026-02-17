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
  private player!: Phaser.GameObjects.Rectangle;      // 충돌 히트박스 (invisible)
  private playerVisual!: Phaser.GameObjects.Container; // 보네카 암발라부 비주얼
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
  private onGameEnd!: (score: number) => void;
  private scoreTimer = 0;

  constructor() {
    super({ key: 'JumpRunnerScene' });
  }

  preload() {}

  create() {
    this.onGameEnd = this.registry.get('onGameEnd');
    this.score = 0;
    this.gameOver = false;
    this.playerVY = 0;
    this.onGround = true;
    this.scrollSpeed = INITIAL_SPEED;
    this.obstacleTimer = 0;
    this.nextObstacleTime = 1500;
    this.scoreTimer = 0;

    // Sky background (브레인롯 분위기 - 보라빛 하늘)
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xc8a2c8);

    // Moving background clouds
    this.bgTiles = [];
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.rectangle(
        i * 110,
        Phaser.Math.Between(30, 100),
        Phaser.Math.Between(60, 100),
        20,
        0xffffff,
        0.6
      );
      this.bgTiles.push(cloud);
    }

    // Ground (이탈리아 국기 느낌 - 초록)
    this.ground = this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + 20, GAME_WIDTH, 40, 0x228b22);

    // 충돌 히트박스 (투명)
    this.player = this.add.rectangle(PLAYER_X, GROUND_Y - PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE, 0x000000);
    this.player.setAlpha(0);
    this.player.setDepth(2);

    // 보네카 암발라부 캐릭터 빌드
    this.playerVisual = this.buildAmbalabulChar();
    this.playerVisual.setDepth(3);

    // 캐릭터 상하 흔들림 애니메이션
    this.tweens.add({
      targets: this.playerVisual,
      scaleY: 0.88,
      scaleX: 1.1,
      duration: 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Obstacles group
    this.obstacles = this.add.group();

    // Score
    this.scoreText = this.add.text(8, 8, '🧠 0', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#4a0080',
      strokeThickness: 3,
    }).setDepth(10);

    // Jump input
    this.input.keyboard!.on('keydown-SPACE', this.jump, this);
    this.input.keyboard!.on('keydown-UP', this.jump, this);
    this.input.on('pointerdown', this.jump, this);
  }

  private buildAmbalabulChar(): Phaser.GameObjects.Container {
    // 몸통 (둥근 보라색)
    const body = this.add.circle(0, 2, 14, 0x9b30ff);

    // 얼굴 하이라이트
    const highlight = this.add.circle(-4, -4, 5, 0xc87dff, 0.5);

    // 흰자위
    const leftWhite = this.add.circle(-5, -2, 5, 0xffffff);
    const rightWhite = this.add.circle(5, -2, 5, 0xffffff);

    // 동공 (카오스 눈 - 방향 제각각)
    const leftPupil = this.add.circle(-4, -1, 3, 0x1a0033);
    const rightPupil = this.add.circle(7, -3, 3, 0x1a0033);

    // 눈 하이라이트
    const leftGlint = this.add.circle(-3, -2, 1, 0xffffff);
    const rightGlint = this.add.circle(8, -4, 1, 0xffffff);

    // 입 (삐뚤어진 브레인롯 스마일)
    const mouth = this.add.arc(1, 5, 7, 10, 170, false, 0x33001a);

    // 작은 팔들 (선)
    const leftArm = this.add.rectangle(-16, 4, 8, 3, 0x9b30ff, 0.9);
    leftArm.setAngle(-30);
    const rightArm = this.add.rectangle(16, 4, 8, 3, 0x9b30ff, 0.9);
    rightArm.setAngle(30);

    // 이름표
    const label = this.add.text(0, 21, '암발라부', {
      fontSize: '7px',
      color: '#ffe0ff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const container = this.add.container(
      this.player.x,
      this.player.y,
      [body, highlight, leftWhite, rightWhite, leftPupil, rightPupil, leftGlint, rightGlint, mouth, leftArm, rightArm, label]
    );

    return container;
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
      this.scoreText.setText(`🧠 ${this.score}`);
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

    // 비주얼을 히트박스에 동기화
    this.playerVisual.setPosition(this.player.x, this.player.y);

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

    // 보네카 암발라부 충격 이펙트
    this.tweens.killTweensOf(this.playerVisual);
    this.playerVisual.setScale(1.4);
    this.time.delayedCall(80, () => this.playerVisual.setScale(0.7));
    this.time.delayedCall(160, () => this.playerVisual.setScale(1.2));
    (this.playerVisual.getAt(0) as Phaser.GameObjects.Arc).setFillStyle(0xff2222);

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.65)
      .setDepth(20);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 24, '보네카 암발라부 탈락!', {
      fontSize: '22px',
      color: '#ff80ff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#1a0033',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(21);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 16, `점수: ${this.score}`, {
      fontSize: '20px',
      color: '#ffff00',
      fontFamily: 'Arial',
    }).setOrigin(0.5).setDepth(21);

    this.time.delayedCall(1400, () => {
      this.onGameEnd(this.score);
    });
  }
}
