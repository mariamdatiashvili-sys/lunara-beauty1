import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  private api = inject(ApiService);

  formData = {
    name: '',
    email: '',
    message: ''
  };

  isSubmitting = false;

  onSubmit() {
    this.isSubmitting = true;
    this.api.post('messages', this.formData).subscribe({
      next: () => {
        alert('Message sent successfully!');
        this.isSubmitting = false;
        this.formData = { name: '', email: '', message: '' };
      },
      error: (err) => {
        console.error(err);
        alert('Failed to send message.');
        this.isSubmitting = false;
      }
    });
  }
}
