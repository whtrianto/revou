import Chicken from './chicken';
import Car from './car';

class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private chicken: Chicken;
    private cars: Car[];
    private score: number;
    private gameOver: boolean;
    private animationId: number | null = null;
    private resetButton!: HTMLButtonElement;



    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d')!;
        this.chicken = new Chicken(400, 550);
        this.cars = [];
        this.score = 0;
        this.gameOver = false;

        this.createResetButton();
        this.init();
    }

    private init(): void {
        document.addEventListener('keydown', this.handleInput.bind(this));
        this.spawnCars();
        this.gameLoop();
    }

    private handleInput(e: KeyboardEvent): void {
        if (this.gameOver) return;

        switch(e.key) {
            case 'ArrowUp':
                this.chicken.moveUp();
                break;
            case 'ArrowDown':
                this.chicken.moveDown();
                break;
            case 'ArrowLeft':
                this.chicken.moveLeft();
                break;
            case 'ArrowRight':
                this.chicken.moveRight();
                break;
        }
    }

    private spawnCars(): void {
        setInterval(() => {
            if (!this.gameOver) {
                this.cars.push(new Car());
            }
        }, 250);
    }

    private gameLoop(): void {
        if (this.gameOver) {
            this.drawGameOver();
            return;
        }

        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(this.gameLoop.bind(this));
    }

    private update(): void {
        this.cars = this.cars.filter(car => car.isVisible());
        this.cars.forEach(car => car.update());

        this.cars.forEach(car => {
            if (this.checkCollision(car, this.chicken)) {
                this.gameOver = true;
            }
        });

        if (this.chicken.y <= 50) {
            this.score++;
            this.chicken.reset();
        }
    }

    private draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, 100, this.canvas.width, 400);

        this.ctx.fillStyle = 'black';
        this.ctx.font = '24px Arial';
        const scoreText = `Score: ${this.score}`;
        const textWidth = this.ctx.measureText(scoreText).width;
        const centerX = (this.canvas.width - textWidth) / 2;
        this.ctx.fillText(scoreText, centerX, 30);

        this.chicken.draw(this.ctx);
        this.cars.forEach(car => car.draw(this.ctx));
        
        // Ensure reset button is hidden during normal gameplay
        this.resetButton.style.display = 'none';
    }

    private drawGameOver(): void {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 80);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        // Show reset button when game is over
        this.resetButton.style.display = 'block';
    }

    private checkCollision(car: Car, chicken: Chicken): boolean {
        const tolerance = 5;
        return (car.x < chicken.x + 30 - tolerance &&
                car.x + 60 > chicken.x + tolerance &&
                car.y < chicken.y + 30 - tolerance &&
                car.y + 30 > chicken.y + tolerance);
    }

    private createResetButton(): void {
        this.resetButton = document.createElement('button');
        this.resetButton.textContent = 'Reset Game';
        this.resetButton.style.position = 'absolute';
        this.resetButton.style.left = '50%';
        this.resetButton.style.top = '50%';
        this.resetButton.style.transform = 'translate(-50%, 80px)';
        this.resetButton.style.padding = '12px 24px';
        this.resetButton.style.fontSize = '18px';
        this.resetButton.style.fontWeight = 'bold';
        this.resetButton.style.backgroundColor = '#4CAF50';
        this.resetButton.style.color = 'white';
        this.resetButton.style.border = 'none';
        this.resetButton.style.borderRadius = '8px';
        this.resetButton.style.cursor = 'pointer';
        this.resetButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        this.resetButton.style.transition = 'all 0.3s ease';
        this.resetButton.style.display = 'none';
        this.resetButton.addEventListener('click', this.resetGame.bind(this));
        
        // Add hover effects
        this.resetButton.addEventListener('mouseenter', () => {
            this.resetButton.style.backgroundColor = '#45a049';
            this.resetButton.style.transform = 'translate(-50%, 80px) scale(1.05)';
        });
        
        this.resetButton.addEventListener('mouseleave', () => {
            this.resetButton.style.backgroundColor = '#4CAF50';
            this.resetButton.style.transform = 'translate(-50%, 80px) scale(1)';
        });
        
        document.body.appendChild(this.resetButton);
    }

    private resetGame(): void {
        this.score = 0;
        this.gameOver = false;
        this.chicken = new Chicken(400, 550);
        this.cars = [];
        this.resetButton.style.display = 'none';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.gameLoop();
    }

}

export default Game;
