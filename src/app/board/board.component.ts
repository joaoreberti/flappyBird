import { NgZone, HostListener,Input } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';





export class Background {
  private color = 'grey'

  constructor(private ctx: CanvasRenderingContext2D, private canvas) { }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


  }


}

export class Sewers {
  private color = "green"
  private x = 0;
  private y = 0;
  private w = 20
  private heightBottom
  private gap = 100;
  private heightTop;

  constructor(private ctx: CanvasRenderingContext2D, private canvas) {
    /*  let gap = this.randomRange(40, 100)
     let gapStarts = this.randomRange(40,160) */

    this.x = this.canvas.width,
      this.y = this.canvas.height
    this.heightBottom = this.randomRange(this.gap, this.canvas.height)
    this.heightTop = this.canvas.height - this.heightBottom - this.gap

  }

  private randomRange(low: number, high: number): number {
    let h = Math.floor(Math.random() * high) - low
    return h < 0 ? 0 : h

  }

  moveLeft() {
    this.x--
    this.draw()
  }

  checkToDestroy() {
    if (this.x === 0) {
      return true
    }
  }

  checkIfObjectsColide(bird) {

    let intervalY
    //console.log(`abcissa do pássaro${bird.coordinateX}, posição x do esgoto entre ${this.x - this.w} e ${this.x}`)
    //console.log(`ordenada do pássaro${bird.coordinateY}, posição y do esgoto entre ${this.canvas.height - this.heightBottom} e ${this.heightTop}`)

    if (((bird.coordinateX + bird.width > this.x - this.w &&
      bird.coordinateX + bird.width < this.x) || (bird.coordinateX > this.x - this.w &&
        bird.coordinateX < this.x)) && ((bird.coordinateY < this.heightTop ||
          bird.coordinateY > this.canvas.height - this.heightBottom) || (bird.coordinateY + bird.width < this.heightTop ||
            bird.coordinateY + bird.width > this.canvas.height - this.heightBottom))

    ) {
      //console.log(bird.coordinateY);
      return true

    } else {
      return false
    }



  }

  maybeAddNewSewer() {
    if (this.x < (this.canvas.width) / 3) {
      let rand = Math.floor(Math.random() * 50);

      //console.log(rand);

      if (rand < 1) {

        //console.log("time to add new sewer");
        return true

      }
    }
  }

  private draw() {


    this.ctx.fillStyle = this.color;

    //bottom
    this.ctx.fillRect(this.x - this.w, this.y - this.heightBottom, this.w, this.heightBottom);

    //top
    this.ctx.fillRect(this.x - this.w, 0, this.w, this.heightTop);

  }

}

export class Bird {
  private color = 'red';
  private x = 50;
  private y = 50;
  private z = 20;

  constructor(private ctx: CanvasRenderingContext2D, private canvas) { }

  get coordinateX() {
    return this.x
  }

  get coordinateY() {
    return this.y
  }

  get width() {
    return this.z
  }

  moveUp() {
    if (this.y <= this.z) {
      this.draw
    } else {
      this.y = this.y - 50;
      this.draw();
    }



  }

  moveDown() {
    if (this.y >= this.canvas.height - this.z) {
      this.draw();
    } else {
      this.y = this.y + 1;
      this.draw();
    }

  }

  moveDownFaster() {
    if (this.y >= this.canvas.height - this.z) {
      this.draw()

    } else {
      this.y = this.y +2
      this.draw()
    }

  }

  private draw() {

    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.z, this.z);


  }
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']

})


export class BoardComponent implements OnInit {
  @ViewChild('layer1', {
    static: true
  }
  ) layer1: ElementRef<HTMLCanvasElement>;
  @ViewChild('layer2', {
    static: true
  }
  ) layer2: ElementRef<HTMLCanvasElement>;




  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === "Space") {
      //console.log(event.code);
      this.ctxActiveElements.clearRect(0, 0, this.layer2.nativeElement.width, this.layer2.nativeElement.height)
      this.sewers.forEach(sewer => {
        sewer.moveLeft()
      })
      this.bird.moveUp()
      this.ticks++
    }
    //console.log(`lastup ${this.lastUp} e ${this.ticks}`)

    this.lastUp = this.ticks


  }
  requestId;
  interval;
  background;
  bird;
  key;
  sewers = [];
  ticks = 0;
  lastUp = 0;
  defeat = false;
  timer;
  points;
  constructor(private ngZone: NgZone) {

  }
  private ctxActiveElements: CanvasRenderingContext2D;
  private ctxPassiveElement: CanvasRenderingContext2D;


  ngOnInit(): void {

    this.points= 0

    this.ctxActiveElements = this.layer2.nativeElement.getContext('2d');
    this.ctxPassiveElement = this.layer1.nativeElement.getContext('2d');

    this.bird = new Bird(this.ctxActiveElements, this.layer2.nativeElement);



    this.background = new Background(this.ctxPassiveElement, this.layer1.nativeElement)

    this.sewers = this.sewers.concat(new Sewers(this.ctxActiveElements, this.layer2.nativeElement))



    this.background.draw()

    this.ngZone.runOutsideAngular(() => this.tick());


    this.requestId = requestAnimationFrame(this.tick);

    this.timer = setInterval(() => {
      if (this.defeat) {
        clearInterval(this.timer)
      }



      this.tick();
    }, 5);



  }




  tick(): void {

    if (this === undefined) {
      return
    }
    this.ctxActiveElements.clearRect(0, 0, this.layer2.nativeElement.width, this.layer2.nativeElement.height)
    this.sewers.map((sewer, index) => {
      sewer.moveLeft()
      if (sewer.checkIfObjectsColide(this.bird)) {
        //console.log("should colide")

        this.defeat = true
      }

      if (index === this.sewers.length - 1) {
        if (sewer.maybeAddNewSewer()) {
          this.sewers.push(new Sewers(this.ctxActiveElements, this.layer2.nativeElement))
        }

      }
      if (sewer.checkToDestroy()) {
        this.sewers.shift()
      }
    })
    if (this.ticks - this.lastUp > 100) {
      //console.log("falling faster");

      this.bird.moveDownFaster()
    } else {
/*       console.log("falling slower")
 */      this.bird.moveDown();
    }
    this.ticks++

  }

  animate(): void {
    this.ctxActiveElements.clearRect(0, 0, this.layer2.nativeElement.width, this.layer2.nativeElement.height)

    this.defeat = true
    this.bird = null
    this.sewers = []
    this.ticks = 0;
    this.lastUp = 0;


  }
  ngOnDestroy() {
    console.log("joao")

    clearInterval(this.interval);
    console.log(this.requestId)
    cancelAnimationFrame(this.requestId);
  }
}
