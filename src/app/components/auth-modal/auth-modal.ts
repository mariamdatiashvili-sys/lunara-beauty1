import { Component, EventEmitter, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-auth-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './auth-modal.html',
    styleUrl: './auth-modal.css'
})
export class AuthModalComponent {
    private auth = inject(AuthService);
    @Output() close = new EventEmitter<void>();

    mode = signal<'login' | 'register'>('login');
    isLoading = signal(false);
    errorMessage = signal<string | null>(null);

    // Form Fields
    firstName = signal('');
    lastName = signal('');
    email = signal('');
    password = signal('');

    // Additional Everrest Required Fields
    age = signal<number | null>(null);
    address = signal('');
    phone = signal('');
    zipcode = signal('');
    avatar = signal('');
    gender = signal<'MALE' | 'FEMALE' | 'OTHER'>('MALE');

    closeModal() {
        this.close.emit();
    }

    toggleMode(newMode: 'login' | 'register') {
        this.mode.set(newMode);
        this.errorMessage.set(null);
    }

    submit() {
        this.errorMessage.set(null);

        if (!this.email().trim() || !this.password().trim()) {
            this.errorMessage.set('Email and password are required.');
            return;
        }

        this.isLoading.set(true);

        if (this.mode() === 'login') {
            this.auth.login({ email: this.email(), password: this.password() }).subscribe({
                next: () => {
                    this.isLoading.set(false);
                    this.closeModal();

                    // Show a small beautiful toast notification
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer);
                            toast.addEventListener('mouseleave', Swal.resumeTimer);
                        }
                    });

                    Toast.fire({
                        icon: 'success',
                        title: 'Signed in successfully'
                    });
                },
                error: (err) => {
                    this.isLoading.set(false);
                    console.error('Login API Error:', err);

                    if (err.error && Array.isArray(err.error.message)) {
                        this.errorMessage.set(`Login failed: ${err.error.message.join(', ')}`);
                    } else if (err.error && typeof err.error.message === 'string') {
                        this.errorMessage.set(`Login failed: ${err.error.message}`);
                    } else if (err.error && typeof err.error.error === 'string') {
                        this.errorMessage.set(`Login failed: ${err.error.error}`);
                    } else if (err.error) {
                        try {
                            this.errorMessage.set(`Raw API Error: ${JSON.stringify(err.error)}`);
                        } catch (e) {
                            this.errorMessage.set('Login failed. Unparseable Response.');
                        }
                    } else {
                        this.errorMessage.set(`Login failed: ${err.message || 'Unknown error'}`);
                    }
                }
            });
        } else {
            if (!this.firstName().trim() || !this.lastName().trim()) {
                this.errorMessage.set('First Name and Last Name are required for registration.');
                this.isLoading.set(false);
                return;
            }

            let phoneStr = String(this.phone() || "599000000");
            if (!phoneStr.startsWith('+995')) {
                phoneStr = '+995' + phoneStr.replace(/[^0-9]/g, '');
            }

            const payload = {
                firstName: this.firstName(),
                lastName: this.lastName(),
                age: Number(this.age()) || 25,
                email: this.email(),
                password: this.password(),
                address: this.address() || "Tbilisi, Georgia",
                phone: phoneStr,
                zipcode: String(this.zipcode() || "0100"),
                avatar: String(this.avatar() || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"),
                gender: this.gender()
            };

            this.auth.register(payload).subscribe({
                next: () => {
                    this.isLoading.set(false);
                    this.closeModal();
                },
                error: (err) => {
                    this.isLoading.set(false);
                    console.error('Registration API Error:', err);

                    // Everrest usually returns validation errors as an array inside err.error.message
                    if (err.error && Array.isArray(err.error.message)) {
                        this.errorMessage.set(`Validation: ${err.error.message.join(', ')}`);
                    } else if (err.error && typeof err.error.message === 'string') {
                        this.errorMessage.set(`Error: ${err.error.message}`);
                    } else if (err.error && typeof err.error.error === 'string') {
                        this.errorMessage.set(`Error: ${err.error.error}`);
                    } else if (err.error) {
                        try {
                            this.errorMessage.set(`Raw API Error: ${JSON.stringify(err.error)}`);
                        } catch (e) {
                            this.errorMessage.set('Registration failed. Bad Request (unparseable).');
                        }
                    } else {
                        this.errorMessage.set(`Registration failed: ${err.message || 'Unknown error'}`);
                    }
                }
            });
        }
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
