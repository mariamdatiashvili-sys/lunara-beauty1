import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';
import { BookingModalComponent } from '../../components/booking-modal/booking-modal';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule, CommonModule, BookingModalComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  private api = inject(ApiService);

  consultationForm = {
    name: '',
    phone: '',
    email: ''
  };

  isSubmitting = false;

  // Modal State
  isModalOpen = false;
  selectedService = '';

  openBookingModal(serviceName: string) {
    this.selectedService = serviceName;
    this.isModalOpen = true;
  }

  onSubmit() {
    this.isSubmitting = true;
    const payload = {
      ...this.consultationForm,
      service: 'Free Consultation',
      date: new Date().toISOString().split('T')[0], // Today
      time: 'Flexible',
      createdAt: new Date().toISOString()
    };

    this.api.post('bookings', payload).subscribe({
      next: () => {
        alert('Consultation request sent! We will contact you shortly.');
        this.isSubmitting = false;
        this.consultationForm = { name: '', phone: '', email: '' }; // Reset form
      },
      error: (err) => {
        console.error(err);
        alert('Failed to send request.');
        this.isSubmitting = false;
      }
    });
  }
}
