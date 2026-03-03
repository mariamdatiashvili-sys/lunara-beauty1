import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service } from '../../pages/services/services';

@Component({
    selector: 'app-admin-service-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-service-modal.html',
    styleUrl: './admin-service-modal.css'
})
export class AdminServiceModalComponent implements OnInit {
    @Input() service: Service | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<Service>();

    // Form State
    formData: Service = {
        id: '',
        name: '',
        price: 0,
        rating: 5.0,
        description: '',
        image: '',
        reviews: []
    };

    ngOnInit() {
        if (this.service) {
            // If editing an existing service, clone its data into the form
            this.formData = { ...this.service };
        }
    }

    closeModal() {
        this.close.emit();
    }

    submitForm() {
        // Basic validation
        if (!this.formData.name || this.formData.price <= 0) {
            alert("Please provide a valid name and price.");
            return;
        }

        // Emit the completely updated/new object back to the parent component
        this.save.emit(this.formData);
    }

    // Prevent closing when clicking inside the modal content
    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
