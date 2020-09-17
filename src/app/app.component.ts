import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  @Input() valores: boolean;
  x = 0
  ngOnInit(): void {
    setInterval(() => {
      this.x++
      if (this.x === 5) {
        this.valores = true
      }
    }, 1000)

  }

  refresh() {
    console.log("hello world")
  }

}
