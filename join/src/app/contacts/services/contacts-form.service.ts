﻿import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Contact } from './contact-data.service';
/**
 * Service for managing contact forms and validation.
 * Handles form creation, validation, data preparation, and form operations.
 * 
 * @author Daniel Grabowski, Gary Angelone, Joshua Brunke, Morteza Chinahkash
 * @version 1.0.0
 */
@Injectable({ providedIn: 'root' })

export class ContactsFormService {
  private contactForm: FormGroup;
  /** Constructor initializes form service with form builder */
  constructor(private fb: FormBuilder) {
    this.contactForm = this.createContactForm();
  }

  /**
   * Creates the reactive form for contact management.
   * 
   * @returns Configured FormGroup
   */
  private createContactForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [this.phoneValidator]],
    });
  }

  /**
   * Custom validator for phone numbers.
   * 
   * @param control - Form control to validate
   * @returns Validation error object or null
   */
  private phoneValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value || value.trim() === '' || value === 'N/A') {
      return null;
    }
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return { invalidPhone: true };
    }
    return null;
  }

  /**
   * Gets the contact form instance.
   * 
   * @returns FormGroup instance
   */
  getForm(): FormGroup {
    return this.contactForm;
  }

  /**
   * Validates the contact form and marks fields as touched.
   * 
   * @returns True if form is valid
   */
  validateForm(): boolean {
    this.ensurePhoneValue();
    if (!this.contactForm.valid) {
      this.contactForm.markAllAsTouched();
      return false;
    }
    return true;
  }

  /**
   * Ensures phone field has a value (sets to 'N/A' if empty).
   */
  private ensurePhoneValue(): void {
    const phoneControl = this.contactForm.get('phone');
    const phoneValue = phoneControl?.value;
    if (!phoneValue?.trim()) {
      phoneControl?.setValue('N/A');
      phoneControl?.updateValueAndValidity();
    }
  }

  /**
   * Prepares and sanitizes form data for submission.
   * 
   * @returns Sanitized contact data
   */
  prepareFormData(): Partial<Contact> {
    const formValue = this.contactForm.value;
    return {
      name: formValue.name?.trim(),
      email: formValue.email?.trim().toLowerCase(),
      phone: formValue.phone?.trim() || 'N/A'
    };
  }

  /**
   * Populates form with contact data for editing.
   * 
   * @param contact - Contact data to populate form with
   */
  populateForm(contact: Contact): void {
    this.contactForm.patchValue({
      name: contact.name,
      email: contact.email,
      phone: contact.phone === 'N/A' ? '' : contact.phone,
    });
  }

  /**
   * Resets the form to initial state.
   */
  resetForm(): void {
    this.contactForm.reset();
    this.contactForm.markAsUntouched();
  }

  /**
   * Checks if a specific field has errors.
   * 
   * @param fieldName - Name of the field to check
   * @returns True if field has errors and is touched
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Gets error message for a specific field.
   * 
   * @param fieldName - Name of the field
   * @returns Error message or empty string
   */
  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (!this.shouldShowFieldError(field)) {
      return '';
    }
    return this.getErrorMessageByField(fieldName, field!.errors!);
  }

  /**
   * Determines if field error should be shown.
   * 
   * @param field - Form control to check
   * @returns True if error should be displayed
   * @private
   */
  private shouldShowFieldError(field: AbstractControl | null): boolean {
    return !!(field && field.errors && field.touched);
  }

  /**
   * Gets appropriate error message based on field name and errors.
   * 
   * @param fieldName - Name of the field
   * @param errors - Field errors object
   * @returns Error message string
   * @private
   */
  private getErrorMessageByField(fieldName: string, errors: any): string {
    switch (fieldName) {
      case 'name':
        return this.getNameFieldError(errors);
      case 'email':
        return this.getEmailFieldError(errors);
      case 'phone':
        return this.getPhoneFieldError(errors);
      default:
        return '';
    }
  }

  /**
   * Gets error message for name field.
   * 
   * @param errors - Field errors object
   * @returns Name field error message
   * @private
   */
  private getNameFieldError(errors: any): string {
    if (errors['required']) return 'Name is required';
    if (errors['minlength']) return 'Name must be at least 2 characters';
    return '';
  }

  /**
   * Gets error message for email field.
   * 
   * @param errors - Field errors object
   * @returns Email field error message
   * @private
   */
  private getEmailFieldError(errors: any): string {
    if (errors['required']) return 'Email is required';
    if (errors['email']) return 'Please enter a valid email address';
    return '';
  }

  /**
   * Gets error message for phone field.
   * 
   * @param errors - Field errors object
   * @returns Phone field error message
   * @private
   */
  private getPhoneFieldError(errors: any): string {
    if (errors['invalidPhone']) return 'Please enter a valid phone number';
    return '';
  }

  /**
   * Gets all form errors as an object.
   * 
   * @returns Object with field names as keys and error messages as values
   */
  getAllErrors(): { [key: string]: string } {
    const errors: { [key: string]: string } = {};
    Object.keys(this.contactForm.controls).forEach(key => {
      const error = this.getFieldError(key);
      if (error) {
        errors[key] = error;
      }
    });

    return errors;
  }

  /**
   * Checks if form has any validation errors.
   * 
   * @returns True if form has errors
   */
  hasErrors(): boolean {
    return this.contactForm.invalid;
  }

  /**
   * Gets form validation status.
   * 
   * @returns Form validity status
   */
  isValid(): boolean {
    return this.contactForm.valid;
  }

  /**
   * Marks all fields as touched to trigger validation display.
   */
  markAllAsTouched(): void {
    this.contactForm.markAllAsTouched();
  }

  /**
   * Gets current form values.
   * 
   * @returns Current form values
   */
  getFormValues(): any {
    return this.contactForm.value;
  }

  /**
   * Validates specific field by name.
   * 
   * @param fieldName - Name of field to validate
   * @returns Validation result
   */
  validateField(fieldName: string): { isValid: boolean; error?: string } {
    const field = this.contactForm.get(fieldName);
    if (!field) {
      return { isValid: false, error: 'Field not found' };
    }
    field.markAsTouched();
    field.updateValueAndValidity();
    if (field.valid) {
      return { isValid: true };
    }
    return {
      isValid: false,
      error: this.getFieldError(fieldName)
    };
  }

  /**
   * Sets a specific field value.
   * 
   * @param fieldName - Name of the field
   * @param value - Value to set
   */
  setFieldValue(fieldName: string, value: any): void {
    const field = this.contactForm.get(fieldName);
    if (field) {
      field.setValue(value);
      field.updateValueAndValidity();
    }
  }

  /**
   * Gets a specific field value.
   * 
   * @param fieldName - Name of the field
   * @returns Field value
   */
  getFieldValue(fieldName: string): any {
    return this.contactForm.get(fieldName)?.value;
  }

  /**
   * Validates form data for consistency and business rules.
   * 
   * @param formData - Form data to validate
   * @returns Validation result with any issues
   */
  validateFormData(formData: Partial<Contact>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    this.validateFormNameField(formData, errors);
    this.validateFormEmailField(formData, errors);
    this.validateFormNameLength(formData, errors);
    return this.buildFormDataValidationResult(errors);
  }

  /**
   * Validates the name field in form data.
   * 
   * @param formData - Form data to validate
   * @param errors - Array to collect validation errors
   * @private
   */
  private validateFormNameField(formData: Partial<Contact>, errors: string[]): void {
    if (!formData.name?.trim()) {
      errors.push('Name is required');
    }
  }

  /**
   * Validates the email field in form data.
   * 
   * @param formData - Form data to validate
   * @param errors - Array to collect validation errors
   * @private
   */
  private validateFormEmailField(formData: Partial<Contact>, errors: string[]): void {
    if (!formData.email?.trim()) {
      errors.push('Email is required');
    } else if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.push('Invalid email format');
      }
    }
  }

  /**
   * Validates the name field length in form data.
   * 
   * @param formData - Form data to validate
   * @param errors - Array to collect validation errors
   * @private
   */
  private validateFormNameLength(formData: Partial<Contact>, errors: string[]): void {
    if (formData.name && formData.name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
  }

  /**
   * Builds the form data validation result object.
   * 
   * @param errors - Array of validation errors
   * @returns Validation result object
   * @private
   */
  private buildFormDataValidationResult(errors: string[]): { isValid: boolean; errors: string[] } {
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Creates a new form instance (useful for multiple forms).
   * 
   * @returns New FormGroup instance
   */
  createNewForm(): FormGroup {
    return this.createContactForm();
  }

  /**
   * Cleanup method for service destruction.
   */
  cleanup(): void {
    this.resetForm();
  }
}
