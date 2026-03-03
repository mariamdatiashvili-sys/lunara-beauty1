import { Component, signal, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent implements OnInit, OnDestroy {
  reviews = [
    { text: "Absolutely amazing experience! My skin has never felt this radiant and soft. Highly recommend Lunara Beauty!", author: "Emily R." },
    { text: "The professionalism and attention to detail are unmatched. I love how they understand every client's needs.", author: "Sarah M." },
    { text: "Beautiful ambiance and expert staff. Every visit feels like a self-care ritual I look forward to.", author: "Olivia K." }
  ];

  currentIndex = signal(0);
  private intervalId: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  nextSlide() {
    this.currentIndex.update(i => (i + 1) % this.reviews.length);
  }

  prevSlide() {
    this.currentIndex.update(i => (i - 1 + this.reviews.length) % this.reviews.length);
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => this.nextSlide(), 5000);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
