import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgentsComponent } from './argents.component';

describe('ArgentsComponent', () => {
  let component: ArgentsComponent;
  let fixture: ComponentFixture<ArgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArgentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
