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

                    let errorText = 'Unknown error occurred during login.';
                    if (err.error && Array.isArray(err.error.message)) {
                        errorText = err.error.message.join(', ');
                    } else if (err.error && typeof err.error.message === 'string') {
                        errorText = err.error.message;
                    } else if (err.error && typeof err.error.error === 'string') {
                        errorText = err.error.error;
                    } else if (err.message) {
                        errorText = err.message;
                    }

                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: errorText,
                        confirmButtonColor: '#b75c83'
                    });
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
                    Swal.fire({
                        icon: 'success',
                        title: 'Registration Successful!',
                        text: 'Successfully registered.',
                        confirmButtonColor: '#b75c83'
                    }).then(() => {
                        this.closeModal();
                    });
                },
                error: (err) => {
                    this.isLoading.set(false);
                    console.error('Registration API Error Payload:', err);

                    let errorText = 'Unknown error occurred during registration.';

                    if (err.error && Array.isArray(err.error.errorKeys) && err.error.errorKeys.length > 0) {
                        const keyMappings: { [key: string]: string } = {
                            'errors.email_in_use': 'This email is already registered.',
                            'errors.invalid_email': 'Please provide a valid email address.',
                            'errors.password_too_short': 'Password must be at least 8 characters long.',
                            'errors.password_too_weak': 'Password requires at least one uppercase, lowercase, number, and special character.',
                            'errors.invalid_phone_number': 'Phone number format is invalid.',
                            'errors.user_age': 'Age must be a valid number.',
                            'errors.user_zipcode': 'Zipcode is invalid.'
                        };
                        errorText = err.error.errorKeys.map((key: string) => keyMappings[key] || key).join('<br>');
                    } else if (err.error && Array.isArray(err.error.message)) {
                        errorText = err.error.message.join('<br>'); // Join with HTML break for Swal
                    } else if (err.error && typeof err.error.message === 'string') {
                        errorText = err.error.message;
                    } else if (err.error && typeof err.error.error === 'string') {
                        errorText = err.error.error;
                    } else if (err.message) {
                        errorText = err.message;
                    }

                    Swal.fire({
                        icon: 'error',
                        title: 'Registration Failed',
                        html: errorText, // Using html so <br> works for multiple validation errors
                        confirmButtonColor: '#b75c83'
                    });
                }
            });
        }
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
