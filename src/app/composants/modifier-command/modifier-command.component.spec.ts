import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierCommandComponent } from './modifier-command.component';

describe('ModifierCommandComponent', () => {
  let component: ModifierCommandComponent;
  let fixture: ComponentFixture<ModifierCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierCommandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
