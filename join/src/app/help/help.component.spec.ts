﻿import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpComponent } from './help.component';
describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
