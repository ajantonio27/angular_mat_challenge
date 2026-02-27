import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';

// ── Custom Validators ──────────────────────────────────────────
function alphanumericPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';
  if (!value) return null;
  const startsWithLetter = /^[a-zA-Z]/.test(value);
  const alphanumericOnly = /^[a-zA-Z0-9]+$/.test(value);
  if (!startsWithLetter) return { startsWithLetter: true };
  if (!alphanumericOnly) return { alphanumericOnly: true };
  return null;
}

function birthYearValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const year = new Date(control.value).getFullYear();
  if (year > 2006) return { tooYoung: true };
  return null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule,
    MatSlideToggleModule,  // Extra #1
    MatBadgeModule,        // Extra #2
    MatProgressBarModule,  // Extra #3
    MatStepperModule,      // Extra #4 (bonus)
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent {

  // ── Theme ──────────────────────────────────────────────────
  darkMode = signal(true);
  toggleTheme() { this.darkMode.update(v => !v); }

  // ── UI State ───────────────────────────────────────────────
  hidePassword = true;
  submitted = false;

  // ── Result Data ────────────────────────────────────────────
  gamertag = '';
  email = '';
  gender = '';
  birthDate!: Date;
  game = '';
  rank = '';
  platform = '';
  skillLevel = 5;
  bio = '';

  // ── Options ────────────────────────────────────────────────
  games = ['Valorant', 'League of Legends', 'Mobile Legends', 'DOTA 2', 'CS2', 'Apex Legends', 'Fortnite', 'Street Fighter 6'];
  ranks = ['Iron / Bronze', 'Silver / Gold', 'Platinum / Diamond', 'Master / Grandmaster', 'Challenger / Top 500'];
  platforms = ['PC', 'PlayStation', 'Xbox', 'Mobile', 'Nintendo Switch'];
  roles: string[] = ['Duelist', 'Support', 'Tank', 'Sniper', 'Flex'];
  selectedRoles: string[] = [];

  minSkill = 1;
  maxSkill = 10;
  maxDate = new Date(2006, 11, 31); // Dec 31 2006 — born 2006 or earlier

  // ── Form ───────────────────────────────────────────────────
  form = new FormGroup({
    gamertag:   new FormControl('', [Validators.required, Validators.minLength(3)]),
    email:      new FormControl('', [Validators.required, Validators.email]),
    password:   new FormControl('', [Validators.required, Validators.minLength(8), alphanumericPasswordValidator]),
    gender:     new FormControl('', [Validators.required]),
    birthDate:  new FormControl<Date | null>(null, [Validators.required, birthYearValidator]),
    game:       new FormControl('', [Validators.required]),
    rank:       new FormControl('', [Validators.required]),
    platform:   new FormControl('', [Validators.required]),
    skillLevel: new FormControl(5),
    bio:        new FormControl(''),
    agreeToTerms: new FormControl(false, [Validators.requiredTrue]),
  });

  // ── Password Strength ──────────────────────────────────────
  get passwordStrength(): number {
    const v = this.form.get('password')?.value || '';
    let score = 0;
    if (v.length >= 8)  score += 25;
    if (v.length >= 12) score += 25;
    if (/[A-Z]/.test(v)) score += 25;
    if (/[0-9]/.test(v)) score += 25;
    return score;
  }

  get passwordStrengthLabel(): string {
    const s = this.passwordStrength;
    if (s <= 25)  return 'Weak';
    if (s <= 50)  return 'Fair';
    if (s <= 75)  return 'Good';
    return 'Strong';
  }

  get passwordStrengthColor(): string {
    const s = this.passwordStrength;
    if (s <= 25)  return 'warn';
    if (s <= 50)  return 'accent';
    return 'primary';
  }

  // ── Roles ──────────────────────────────────────────────────
  toggleRole(role: string) {
    const i = this.selectedRoles.indexOf(role);
    i >= 0 ? this.selectedRoles.splice(i, 1) : this.selectedRoles.push(role);
  }

  isRoleSelected(role: string) { return this.selectedRoles.includes(role); }

  // ── Submit ─────────────────────────────────────────────────
  onSubmit(data: any) {
    this.submitted = true;
    if (this.form.valid) {
      this.gamertag   = data.gamertag   ?? '';
      this.email      = data.email      ?? '';
      this.gender     = data.gender     ?? '';
      this.birthDate  = data.birthDate;
      this.game       = data.game       ?? '';
      this.rank       = data.rank       ?? '';
      this.platform   = data.platform   ?? '';
      this.skillLevel = data.skillLevel ?? 5;
      this.bio        = data.bio        ?? '';
      console.log('Registration successful!', this.form.value);
    } else {
      console.log('Form invalid');
    }
  }

  onReset() {
    this.form.reset({ skillLevel: 5 });
    this.submitted = false;
    this.selectedRoles = [];
  }
}